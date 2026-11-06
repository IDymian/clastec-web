/**
 * Catálogo (tiempo de build): lee data/snapshot/catalogo.json y genera un índice compacto
 * para la búsqueda en el navegador. Sin precios ni carrito: todo termina en una cotización.
 */
import snapshot from '../../data/snapshot/catalogo.json';
import manifiestoImagenes from '../../data/snapshot/imagenes.json';

/** URL original → archivo WebP local en /img/catalogo/ (generado por npm run imagenes). */
const imagenesLocales = (manifiestoImagenes as { imagenes: Record<string, string> }).imagenes;
export const RUTA_IMAGENES = '/img/catalogo/';

type ProductoSnapshot = {
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

/** Nombres que entiende un jefe de compras (el sitio actual usa "Laptops/Notebooks/Portátiles"). */
export const CATEGORIAS = [
  { slug: 'multifuncionales-impresoras', nombre: 'Impresoras y multifuncionales', grupo: 'Equipos', icono: 'impresora', descripcion: 'Equipos Xerox, HP, Epson y más para imprimir, copiar y escanear.' },
  { slug: 'laptops-notebooks-portatiles', nombre: 'Laptops', grupo: 'Equipos', icono: 'laptop', descripcion: 'Laptops HP, Lenovo, Dell y otras marcas para trabajo y proyectos.' },
  { slug: 'escaneres', nombre: 'Escáneres', grupo: 'Equipos', icono: 'documento', descripcion: 'Escáneres para digitalizar documentos en oficina o producción.' },
  { slug: 'impresoras-de-etiquetas', nombre: 'Impresoras de etiquetas', grupo: 'Equipos', icono: 'impresora', descripcion: 'Impresoras Epson ColorWorks para etiquetas a color.' },
  { slug: 'suministros', nombre: 'Suministros (tóner, drum, developer)', grupo: 'Repuestos y suministros', icono: 'check', descripcion: 'Tóner, drum, developer y otros consumibles por número de parte.' },
  { slug: 'repuestos', nombre: 'Repuestos', grupo: 'Repuestos y suministros', icono: 'herramienta', descripcion: 'Rodillos, fusores, kits de mantenimiento y más, por número de parte.' },
] as const;

export type Categoria = (typeof CATEGORIAS)[number];
export const categoriaPorSlug = (slug: string) => CATEGORIAS.find((c) => c.slug === slug);

/** Elemento del índice. Claves cortas para reducir el tamaño del JSON. */
export type ItemIndice = {
  i: number; // id
  n: string; // nombre
  c: number; // índice de categoría en CATEGORIAS
  m?: string; // marca
  p?: string; // número de parte
  f?: string[]; // características (solo equipos)
  img?: string; // archivo WebP local en RUTA_IMAGENES
  s?: string; // slug de la página de detalle (solo equipos)
};

const productos = (snapshot as { productos: ProductoSnapshot[] }).productos;
export const fechaCaptura = (snapshot as { capturado: string }).capturado;

const MARCAS: Record<string, string> = { Fujitzu: 'Fujitsu', Macbook: 'Apple' };

function numeroParte(p: ProductoSnapshot): string | undefined {
  const desdeCaracteristica = p.caracteristicas
    .find((c) => /^n[uú]mero de parte:/i.test(c))
    ?.split(':')[1]
    ?.trim();
  return p.sku || desdeCaracteristica || undefined;
}

/** Para repuestos y suministros el nombre trae "para las impresoras modelos: …"; lo acortamos. */
function nombreCorto(p: ProductoSnapshot): string {
  const corte = p.nombre.split(/ para (las|los|la|el) (impresoras?|equipos?) modelos?:/i)[0] ?? p.nombre;
  return corte.length > 120 ? `${corte.slice(0, 117)}…` : corte;
}

export function indice(): ItemIndice[] {
  return productos
    .map((p): ItemIndice | null => {
      const c = CATEGORIAS.findIndex((cat) => cat.slug === p.categoria);
      if (c < 0) return null;
      const esEquipo = CATEGORIAS[c]?.grupo === 'Equipos';
      const item: ItemIndice = { i: p.id, n: nombreCorto(p), c };
      const marca = p.marca ? (MARCAS[p.marca] ?? p.marca) : undefined;
      if (marca) item.m = marca;
      const parte = numeroParte(p);
      if (parte) item.p = parte;
      if (esEquipo) {
        const f = p.caracteristicas.filter((x) => !/^(tipo|condici[oó]n|marca de la impresora):/i.test(x)).slice(0, 4);
        if (f.length) item.f = f;
      } else if (p.modelo) {
        item.f = [`Compatible: ${p.modelo.length > 90 ? `${p.modelo.slice(0, 87)}…` : p.modelo}`];
      }
      const img = p.imagen ? imagenesLocales[p.imagen] : undefined;
      if (img) item.img = img;
      if (esEquipo) item.s = p.slug;
      return item;
    })
    .filter((x): x is ItemIndice => x !== null)
    .sort((a, b) => a.c - b.c || a.n.localeCompare(b.n, 'es'));
}

export function conteoPorCategoria(): (Categoria & { cantidad: number })[] {
  const idx = indice();
  return CATEGORIAS.map((cat, c) => ({ ...cat, cantidad: idx.filter((p) => p.c === c).length }));
}

export function marcas(): string[] {
  return [...new Set(indice().map((p) => p.m).filter((m): m is string => Boolean(m)))].sort((a, b) => a.localeCompare(b, 'es'));
}

export function destacados(limite = 8): ItemIndice[] {
  return indice()
    .filter((p) => p.c <= 1 && p.img && p.m && ['Xerox', 'HP', 'Lenovo', 'Epson'].includes(p.m))
    .slice(0, limite);
}

/** Producto completo para las páginas de detalle de equipos. */
export type Equipo = ProductoSnapshot & { categoriaNombre: string; categoriaSlug: string; img?: string; parte?: string };

export function equipos(): Equipo[] {
  return productos
    .filter((p) => CATEGORIAS.some((c) => c.slug === p.categoria && c.grupo === 'Equipos'))
    .map((p) => {
      const cat = categoriaPorSlug(p.categoria);
      const img = p.imagen ? imagenesLocales[p.imagen] : undefined;
      const parte = numeroParte(p);
      return {
        ...p,
        marca: p.marca ? (MARCAS[p.marca] ?? p.marca) : undefined,
        categoriaNombre: cat?.nombre ?? '',
        categoriaSlug: p.categoria,
        ...(img ? { img } : {}),
        ...(parte ? { parte } : {}),
      } as Equipo;
    });
}
