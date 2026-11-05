/**
 * Verificaciones de seguridad sobre el sitio compilado (dist/). Ejecutar después de `npm run build`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = join(import.meta.dirname, '..', 'dist');

/** Spam inyectado en el sitio actual: nunca debe aparecer en el build. */
const LISTA_NEGRA = [
  'telechargement-windows-de-slack-n-a-pour-une-communication-efficace',
  'scarica-shotcut-21-09-13-per-windows-una-guida-completa',
  'download-do-blender-2-93-4-para-windows-guia-completo-para-instalacao',
  'descarga-de-mariadb-10-6-4-para-windows-y-guia-de-instalacion',
  'windowsxia-zai-n-track-studio-9-1-4-wan-zheng-ruan-ti-zhi-nan-yu-an-zhuang-shuo-ming',
  'windowsdaunrodo-pycharm-2021-2-2-nituitexiang-siku',
  'inicio123',
];

/** Dominios de analítica / seguimiento prohibidos en el prototipo. */
const RASTREADORES = [
  'googletagmanager.com',
  'google-analytics.com',
  'gtag(',
  'connect.facebook.net',
  'fbq(',
  'hotjar',
  'clarity.ms',
];

const EJECUTABLES = /href=["'][^"']+\.(exe|msi|zip|rar|7z|apk|scr|bat|dmg)["']/i;

/** Patrones típicos de credenciales filtradas. */
const SECRETOS = [
  /AKIA[0-9A-Z]{16}/, // AWS
  /gh[pousr]_[A-Za-z0-9]{36}/, // GitHub
  /sk_(live|test)_[A-Za-z0-9]{16,}/, // Stripe
  /AIza[0-9A-Za-z_-]{35}/, // Google API
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
];

function archivos(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const ruta = join(dir, n);
    return statSync(ruta).isDirectory() ? archivos(ruta) : [ruta];
  });
}

const existeDist = existsSync(DIST);
const todos = existeDist ? archivos(DIST).filter((f) => ['.html', '.js', '.css', '.txt', '.xml', '.json'].includes(extname(f))) : [];
const html = todos.filter((f) => f.endsWith('.html'));
const leer = (f: string) => readFileSync(f, 'utf8');

test('existe el build (ejecuta `npm run build` antes)', () => {
  assert.ok(existeDist && html.length > 0, 'No hay dist/. Ejecuta npm run build.');
});

test('ningún slug de la lista negra aparece en el build', () => {
  for (const f of todos) {
    const contenido = leer(f).toLowerCase();
    for (const slug of LISTA_NEGRA) assert.ok(!contenido.includes(slug), `"${slug}" aparece en ${f}`);
  }
});

test('no hay enlaces a ejecutables ni comprimidos', () => {
  for (const f of html) assert.doesNotMatch(leer(f), EJECUTABLES, f);
});

test('no se carga analítica ni píxeles de seguimiento', () => {
  for (const f of todos) {
    const contenido = leer(f);
    for (const r of RASTREADORES) assert.ok(!contenido.includes(r), `"${r}" aparece en ${f}`);
  }
});

test('no hay credenciales en el build', () => {
  for (const f of todos) {
    const contenido = leer(f);
    for (const p of SECRETOS) assert.doesNotMatch(contenido, p, f);
  }
});

test('cada página tiene noindex, banner de prototipo, lang es-PE y un solo h1', () => {
  for (const f of html) {
    const c = leer(f);
    assert.match(c, /<meta name="robots" content="noindex, nofollow"/, `${f}: falta noindex`);
    assert.match(c, /Prototipo — no es el sitio oficial/, `${f}: falta banner`);
    assert.match(c, /<html lang="es-PE"/, `${f}: falta lang`);
    assert.equal((c.match(/<h1[\s>]/g) ?? []).length, 1, `${f}: debe tener un único h1`);
  }
});

test('no hay scripts ni estilos en línea (compatibles con la CSP)', () => {
  for (const f of html) {
    const c = leer(f);
    const scripts = [...c.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>/g)];
    assert.equal(scripts.length, 0, `${f}: script en línea`);
    assert.doesNotMatch(c, /<style[\s>]/, `${f}: <style> en línea`);
    assert.doesNotMatch(c, /\sstyle="/, `${f}: atributo style`);
    assert.doesNotMatch(c, /\son[a-z]+="/, `${f}: manejador de eventos en línea`);
  }
});

test('los enlaces externos con target=_blank llevan rel noopener', () => {
  for (const f of html) {
    for (const [a] of leer(f).matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
      assert.match(a, /rel="[^"]*noopener/, `${f}: ${a}`);
    }
  }
});

test('robots.txt bloquea la indexación', () => {
  assert.match(leer(join(DIST, 'robots.txt')), /Disallow: \//);
});

test('las imágenes tienen alt', () => {
  for (const f of html) {
    for (const [img] of leer(f).matchAll(/<img\b[^>]*>/g)) assert.match(img, /\balt=/, `${f}: ${img}`);
  }
});

test('no hay IDs duplicados en ninguna página', () => {
  for (const f of html) {
    const ids = [...leer(f).matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    const repetidos = ids.filter((id, i) => ids.indexOf(id) !== i);
    assert.deepEqual(repetidos, [], `${f}: IDs duplicados`);
  }
});

test('todos los enlaces internos apuntan a páginas existentes', () => {
  for (const f of html) {
    for (const [, href] of leer(f).matchAll(/<a\s[^>]*href="(\/[^"#?]*)/g)) {
      const ruta = href ?? '/';
      const candidatos = [join(DIST, ruta), join(DIST, ruta, 'index.html'), join(DIST, `${ruta}.html`)];
      assert.ok(candidatos.some((c) => existsSync(c) && (statSync(c).isFile() || existsSync(join(c, 'index.html')))), `${f}: enlace roto ${ruta}`);
    }
  }
});

test('el índice del catálogo no tiene precios, HTML ni imágenes externas inesperadas', () => {
  const ruta = join(DIST, 'catalogo', 'indice.json');
  assert.ok(existsSync(ruta), 'falta catalogo/indice.json');
  const datos = JSON.parse(leer(ruta)) as { productos: { n: string; img?: string; f?: string[] }[] };
  assert.ok(datos.productos.length > 1000, 'el catálogo debería tener más de 1,000 productos');
  const crudo = leer(ruta);
  assert.doesNotMatch(crudo, /"(price|prices|precio)"/i, 'el índice no debe incluir precios');
  for (const p of datos.productos) {
    assert.doesNotMatch(`${p.n} ${(p.f ?? []).join(' ')}`, /<[a-z/!]/i, `HTML en producto: ${p.n}`);
    if (p.img) assert.match(p.img, /^[\w/.-]+\.(png|jpe?g|webp)$/i, `imagen sospechosa: ${p.img}`);
  }
});

test('la CSP solo permite imágenes externas de clastec.com', () => {
  const cabeceras = readFileSync(join(import.meta.dirname, '..', 'public', '_headers'), 'utf8');
  const csp = cabeceras.match(/Content-Security-Policy: (.+)/)?.[1] ?? '';
  assert.match(csp, /script-src 'self';/);
  assert.doesNotMatch(csp, /unsafe-inline|unsafe-eval/);
  assert.match(csp, /img-src 'self' data: https:\/\/clastec\.com;/);
});
