/**
 * Descarga y optimiza las imágenes del catálogo → public/img/catalogo/{hash}.webp
 *
 * - Solo GET a https://clastec.com/wp-content/uploads/ (rutas validadas por patrón).
 * - Máximo 4 descargas concurrentes, 300 ms entre lotes, reintentos con backoff.
 * - Verifica tipo de contenido, tamaño máximo y firma del archivo (PNG/JPEG/WebP) antes de procesarlo.
 * - Convierte a WebP 288×288 (sin metadatos). Es incremental: no vuelve a bajar lo que ya existe.
 * - Escribe data/snapshot/imagenes.json (URL → archivo) para que el build use solo imágenes locales.
 *
 * Uso: npm run imagenes   (después de npm run extract)
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const RAIZ = join(import.meta.dirname, '..');
const SALIDA = join(RAIZ, 'public', 'img', 'catalogo');
const MANIFIESTO = join(RAIZ, 'data', 'snapshot', 'imagenes.json');
const UA = 'clastec-prototype-extractor (+prototipo autorizado; solo lectura)';
const CONCURRENCIA = 4;
const PAUSA_MS = 300;
const MAX_BYTES = 3 * 1024 * 1024;
const LADO = 288;
const URL_VALIDA = /^https:\/\/clastec\.com\/wp-content\/uploads\/[\w/.-]+\.(png|jpe?g|webp)$/i;

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Firma de los primeros bytes: solo se aceptan imágenes reales. */
function esImagen(b: Buffer): boolean {
  const png = b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const jpg = b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  const webp = b.subarray(0, 4).toString('ascii') === 'RIFF' && b.subarray(8, 12).toString('ascii') === 'WEBP';
  return png || jpg || webp;
}

async function descargar(url: string, intento = 1): Promise<Buffer> {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'image/*' }, redirect: 'error' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const tipo = r.headers.get('content-type') ?? '';
    if (!tipo.startsWith('image/')) throw new Error(`tipo no permitido: ${tipo}`);
    const largo = Number(r.headers.get('content-length') ?? 0);
    if (largo > MAX_BYTES) throw new Error(`demasiado grande: ${largo} B`);
    const b = Buffer.from(await r.arrayBuffer());
    if (b.length > MAX_BYTES) throw new Error(`demasiado grande: ${b.length} B`);
    if (!esImagen(b)) throw new Error('la firma del archivo no es PNG/JPEG/WebP');
    return b;
  } catch (e) {
    const definitivo = /tipo no permitido|demasiado grande|firma|HTTP 404/.test(String(e));
    if (definitivo || intento >= 4) throw e;
    await esperar(500 * 2 ** intento);
    return descargar(url, intento + 1);
  }
}

export const nombreArchivo = (url: string) => `${createHash('sha256').update(url).digest('hex').slice(0, 16)}.webp`;

async function main() {
  const snapshot = JSON.parse(await readFile(join(RAIZ, 'data', 'snapshot', 'catalogo.json'), 'utf8')) as {
    productos: { imagen?: string }[];
  };
  const urls = [...new Set(snapshot.productos.map((p) => p.imagen).filter((u): u is string => !!u && URL_VALIDA.test(u)))];
  await mkdir(SALIDA, { recursive: true });

  const manifiesto: Record<string, string> = {};
  const fallos: { url: string; motivo: string }[] = [];
  let nuevas = 0;

  for (let i = 0; i < urls.length; i += CONCURRENCIA) {
    const lote = urls.slice(i, i + CONCURRENCIA);
    let descargoAlgo = false;
    await Promise.all(
      lote.map(async (url) => {
        const archivo = nombreArchivo(url);
        const destino = join(SALIDA, archivo);
        if (existsSync(destino)) {
          manifiesto[url] = archivo;
          return;
        }
        descargoAlgo = true;
        try {
          const original = await descargar(url);
          await sharp(original, { limitInputPixels: 25_000_000, failOn: 'error' })
            .rotate()
            .resize(LADO, LADO, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }, withoutEnlargement: false })
            .webp({ quality: 72, effort: 5 })
            .toFile(destino);
          manifiesto[url] = archivo;
          nuevas++;
        } catch (e) {
          fallos.push({ url, motivo: e instanceof Error ? e.message : String(e) });
        }
      }),
    );
    if (descargoAlgo) await esperar(PAUSA_MS);
    if ((i / CONCURRENCIA) % 50 === 0) console.log(`… ${Math.min(i + CONCURRENCIA, urls.length)}/${urls.length}`);
  }

  const ordenado = Object.fromEntries(Object.entries(manifiesto).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(MANIFIESTO, `${JSON.stringify({ generado: new Date().toISOString(), lado: LADO, imagenes: ordenado, fallos }, null, 1)}\n`);
  console.log(`Imágenes: ${Object.keys(manifiesto).length} disponibles (${nuevas} nuevas), ${fallos.length} fallidas.`);
  for (const f of fallos.slice(0, 20)) console.log(`  ✗ ${f.url}: ${f.motivo}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
