/**
 * Extractor del catálogo público de clastec.com → data/snapshot/catalogo.json
 *
 * Reglas (ver CLAUDE.md):
 *  - Solo GET a endpoints públicos de la Store API de WooCommerce.
 *  - Máximo 4 peticiones concurrentes, 300 ms de pausa entre lotes, reintentos con backoff.
 *  - El contenido se trata como DATOS: se guarda solo texto plano, nunca HTML.
 *  - Se descartan productos con slugs de la lista negra, enlaces a ejecutables o texto sospechoso,
 *    y se registran en data/raw/hallazgos-extraccion.md (ignorado por git).
 *
 * Uso: npm run extract
 */
import { mkdir, writeFile, appendFile } from 'node:fs/promises';
import { join } from 'node:path';

const BASE = 'https://clastec.com/wp-json/wc/store/v1';
const UA = 'clastec-prototype-extractor (+prototipo autorizado; solo lectura)';
const CONCURRENCIA = 4;
const PAUSA_MS = 300;
const POR_PAGINA = 100;
const RAIZ = join(import.meta.dirname, '..');

const LISTA_NEGRA = [
  'telechargement-windows', 'scarica-shotcut', 'download-do-blender', 'descarga-de-mariadb',
  'n-track-studio', 'pycharm', 'inicio123',
];
const EJECUTABLE = /\.(exe|msi|zip|rar|7z|apk|scr|bat|dmg)(\?|"|'|\s|$)/i;
const SOSPECHOSO = /\b(ignore (all|previous|your) instructions|ignora (tus|las) instrucciones|casino|viagra|cialis|crack|keygen|torrent|apuestas)\b/i;

type Termino = { name: string };
type ProductoApi = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  short_description: string;
  description: string;
  images: { thumbnail?: string; src?: string; alt?: string }[];
  attributes: { name: string; terms: Termino[] }[];
};
type CategoriaApi = { id: number; name: string; slug: string; count: number; parent: number };

export type Producto = {
  id: number;
  nombre: string;
  slug: string;
  categoria: string;
  sku?: string;
  marca?: string;
  modelo?: string;
  familia?: string;
  color?: string;
  funcion?: string;
  caracteristicas: string[];
  imagen?: string;
};

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function obtener<T>(url: string, intento = 1): Promise<{ datos: T; total: number }> {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return { datos: (await r.json()) as T, total: Number(r.headers.get('x-wp-total') ?? 0) };
  } catch (e) {
    if (intento >= 4) throw new Error(`Falló ${url}: ${String(e)}`);
    await esperar(500 * 2 ** intento);
    return obtener<T>(url, intento + 1);
  }
}

const ENTIDADES: Record<string, string> = { '&amp;': '&', '&quot;': '"', '&#039;': "'", '&lt;': '<', '&gt;': '>', '&nbsp;': ' ', '&#8211;': '–', '&#8220;': '“', '&#8221;': '”', '&#174;': '®', '&reg;': '®', '&#8482;': '™' };

/** Convierte HTML en texto plano (sin etiquetas). */
function texto(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[#a-z0-9]+;/gi, (m) => ENTIDADES[m] ?? ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Extrae los <li> como lista de características en texto plano. */
function caracteristicas(html: string): string[] {
  const items = [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => texto(m[1] ?? ''));
  return items.filter((t) => t.length > 2).slice(0, 6).map((t) => (t.length > 140 ? `${t.slice(0, 137)}…` : t));
}

function atributo(p: ProductoApi, nombre: RegExp): string | undefined {
  return p.attributes.find((a) => nombre.test(a.name))?.terms.map((t) => texto(t.name)).join(', ') || undefined;
}

function imagen(p: ProductoApi): string | undefined {
  const url = p.images[0]?.thumbnail ?? p.images[0]?.src;
  return url && /^https:\/\/clastec\.com\/wp-content\/uploads\/[\w/.-]+\.(png|jpe?g|webp)$/i.test(url) ? url : undefined;
}

const hallazgos: string[] = [];

function revisar(p: ProductoApi): string | null {
  const todo = `${p.slug} ${p.name} ${p.short_description} ${p.description}`;
  if (LISTA_NEGRA.some((s) => todo.includes(s))) return 'slug o enlace en lista negra';
  if (/href=["'][^"']*/i.test(todo) && EJECUTABLE.test(todo)) return 'enlace a ejecutable o comprimido';
  if (SOSPECHOSO.test(todo)) return 'texto sospechoso (spam o instrucciones dirigidas a una IA)';
  return null;
}

async function enLotes<T, R>(items: T[], fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += CONCURRENCIA) {
    out.push(...(await Promise.all(items.slice(i, i + CONCURRENCIA).map(fn))));
    await esperar(PAUSA_MS);
  }
  return out;
}

async function main() {
  const capturado = new Date().toISOString();
  const { datos: categorias } = await obtener<CategoriaApi[]>(`${BASE}/products/categories?per_page=100`);
  const productos = new Map<number, Producto>();

  for (const cat of categorias) {
    const paginas = Math.max(1, Math.ceil(cat.count / POR_PAGINA));
    const lotes = await enLotes(
      Array.from({ length: paginas }, (_, i) => i + 1),
      (pag) => obtener<ProductoApi[]>(`${BASE}/products?category=${cat.id}&per_page=${POR_PAGINA}&page=${pag}`),
    );
    for (const p of lotes.flatMap((l) => l.datos)) {
      const motivo = revisar(p);
      if (motivo) {
        hallazgos.push(`| ${capturado.slice(0, 10)} | producto ${p.id} (\`${p.slug}\`) | ${motivo} |`);
        continue;
      }
      if (productos.has(p.id)) continue;
      const pr: Producto = {
        id: p.id,
        nombre: texto(p.name),
        slug: p.slug,
        categoria: cat.slug,
        caracteristicas: caracteristicas(p.short_description),
      };
      const opcionales = {
        sku: p.sku ? texto(p.sku) : undefined,
        marca: atributo(p, /^marca/i),
        modelo: atributo(p, /^modelo/i),
        familia: atributo(p, /^familia/i),
        color: atributo(p, /mono|color/i),
        funcion: atributo(p, /funcionalidad/i),
        imagen: imagen(p),
      };
      for (const [k, v] of Object.entries(opcionales)) if (v) (pr as Record<string, unknown>)[k] = v;
      productos.set(p.id, pr);
    }
    console.log(`✓ ${cat.name}: ${cat.count} declarados`);
  }

  const salida = {
    capturado,
    fuente: 'https://clastec.com/wp-json/wc/store/v1',
    nota: 'Snapshot de solo lectura. Sin precios: el catálogo es para solicitar cotización.',
    categorias: categorias.map((c) => ({ id: c.id, nombre: texto(c.name), slug: c.slug, cantidad: c.count })),
    productos: [...productos.values()],
  };

  await mkdir(join(RAIZ, 'data', 'snapshot'), { recursive: true });
  await writeFile(join(RAIZ, 'data', 'snapshot', 'catalogo.json'), `${JSON.stringify(salida)}\n`);
  if (hallazgos.length) {
    await mkdir(join(RAIZ, 'data', 'raw'), { recursive: true });
    await appendFile(join(RAIZ, 'data', 'raw', 'hallazgos-extraccion.md'), `\n### Extracción del catálogo ${capturado}\n\n| Fecha | Elemento | Motivo |\n|---|---|---|\n${hallazgos.join('\n')}\n`);
  }
  console.log(`Productos guardados: ${productos.size}. Descartados: ${hallazgos.length}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
