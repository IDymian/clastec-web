# CLASTEC — Sitio web (prototipo)

> **Prototipo — no es el sitio oficial.** El sitio oficial de CLASTEC S.A.C. es <https://clastec.com>.

Sitio B2B para CLASTEC S.A.C. (outsourcing de impresión y servicios de TI, Lima, Perú).
Objetivo: que un jefe de TI, logística o compras entienda en segundos qué hace la empresa, por qué
confiar en ella y cómo **solicitar una cotización**.

## Páginas (125 vistas)

| Ruta | Contenido |
|---|---|
| `/` | Landing comercial: hero con productos, confianza, servicios, cifras, catálogo, proceso, testimonios y CTA |
| `/servicios/` y `/servicios/{id}/` | Índice y 5 servicios: en qué consiste, qué incluye, proceso y preguntas |
| `/servicios/alquiler-de-equipos/{equipo}/` | 8 páginas: laptops, PCs, impresoras, escáneres, servidores, switches, UPS, proyectores |
| `/catalogo/`, `/catalogo/{categoria}/` | Catálogo con 6 categorías y buscador (1,952 productos) |
| `/catalogo/equipo/{slug}/` | 90 fichas de equipo con foto, características y botones de cotizar o alquilar |
| `/cotizar/` | Formulario de 5 campos y lista de productos editable |
| `/contacto/` | Teléfono, WhatsApp, correo y formulario como tarjetas grandes; horario y cobertura |
| `/sector-publico/`, `/nosotros/`, `/clientes/`, `/como-trabajamos/` | Empresa, experiencia, testimonios, pasos y tiempos de atención |
| `/preguntas-frecuentes/`, `/guias/comprar-o-alquilar/` | Ayuda con respuestas siempre visibles y guía comparativa |
| `/trabaja-con-nosotros/`, `/mapa-del-sitio/`, legales, `/404` | Postulaciones, índice de todas las páginas y páginas legales |

## Diseño claro y accesible

- Landing comercial moderna (hero con productos reales, prueba social, servicios, catálogo y cierre con CTA).
- **Menú siempre visible, sin desplegables**; en celular, además, barra inferior fija con Inicio, Servicios,
  Catálogo, Cotizar y Llamar.
- Botón **"Volver a…"** y migas de pan en todas las páginas internas; mapa del sitio.
- Botones de al menos 44 px, foco muy visible, contraste AA (Lighthouse: 100 en accesibilidad).
- Preguntas frecuentes con la respuesta a la vista (sin acordeones). Una idea por página.
- Teléfono visible en todas las páginas: muchas personas prefieren llamar.
- Tests que fallan si aparece un desplegable o si falta el menú o la barra inferior.

## Stack

- [Astro](https://astro.build) 7 (generación estática; JS solo para formulario, lista de cotización y catálogo)
- TypeScript en modo `strictest`
- Tailwind CSS 4
- Tests con el runner nativo de Node (`node --test`)

## Requisitos

- Node.js 22.12 o superior (ver `.nvmrc`)

## Uso

```bash
npm ci            # instala dependencias exactas del lockfile
npm run dev       # servidor de desarrollo en http://localhost:4321
npm run build     # genera el sitio estático en dist/
npm run preview   # sirve dist/ localmente
npm test          # tests (ejecutar después del build)
npm run verify    # check de tipos + build + tests
npm run extract   # vuelve a capturar el catálogo de clastec.com (solo GET)
npm run imagenes  # descarga y convierte a WebP las imágenes nuevas del catálogo
npm run informe   # regenera docs/informe/informe-gerencia.pdf desde el .md (requiere Edge o Chrome)
```

## Catálogo

`scripts/extract.ts` descarga el catálogo público de la Store API de WooCommerce a
`data/snapshot/catalogo.json` (solo texto plano, sin HTML ni precios). El build lee ese snapshot,
no la API en vivo, y genera `/catalogo/indice.json` (≈50 KB comprimido) para la búsqueda en el navegador.
`scripts/imagenes.ts` descarga las fotos del catálogo (1,291 imágenes) y las convierte a WebP de 288×288
en `public/img/catalogo/` (≈5.7 MB en total, ≈4.5 KB por imagen). El sitio no depende de clastec.com
para mostrar nada. Ambos scripts son incrementales y respetan los mismos límites de peticiones.

Variables de entorno: copia `.env.example` a `.env`. `SITE_URL` es la URL del despliegue (canonical y
Open Graph). `PROTOTIPO_USUARIO` y `PROTOTIPO_CLAVE` se configuran **solo en Vercel**. **Nunca** subas `.env`.

## Estructura

```
src/
├─ config/site.ts      # ÚNICA fuente de datos de la empresa (años, teléfonos, cifras…)
├─ content/servicios.ts # Contenido de los 5 servicios y tipos de equipo en alquiler
├─ components/         # Header, Cabecera, Migas, Cotizar, Testimonios, CtaBanda…
├─ layouts/Base.astro  # <head>, SEO, noindex, banner de prototipo
├─ lib/                # Validación, envío (submitQuote), lista de cotización y catálogo
├─ pages/              # 125 páginas + catalogo/indice.json
└─ styles/global.css   # Tema de Tailwind (identidad provisional)
public/
├─ _headers            # Cabeceras de seguridad (Netlify / Cloudflare Pages)
└─ robots.txt          # Disallow: / (prototipo)
vercel.json            # Cabeceras de seguridad (Vercel)
middleware.ts          # Contraseña del despliegue de prueba (Vercel)
tests/                 # Validaciones + verificaciones de seguridad del build
```

## Formulario de cotización

Cinco campos (nombre, empresa o RUC, correo o teléfono, servicio, mensaje opcional) y consentimiento
obligatorio según la Ley N.° 29733. Valida RUC (dígito verificador), teléfono peruano y correo.

En el prototipo **no se envían datos a ningún servidor**: se abre WhatsApp o el programa de correo con el
mensaje listo. Para conectar un servicio real, reemplaza `submitQuote()` en `src/lib/cotizacion.ts`
(las claves van en variables de entorno del servidor, nunca en el cliente).

## Seguridad

Ver [SECURITY.md](SECURITY.md). En resumen: CSP estricta sin scripts en línea, cabeceras HTTP de
seguridad, `noindex`, sin analítica ni píxeles, sin secretos en el código, CI con permisos mínimos,
`npm audit` y Dependabot.

## Despliegue de prueba

Publicado en Vercel (<https://clastec-prototipo.vercel.app>), protegido con usuario y contraseña por
`middleware.ts`. Si faltan las variables `PROTOTIPO_USUARIO` / `PROTOTIPO_CLAVE`, responde 503 (falla cerrado).
Despliegue manual: `npx vercel deploy --prod --scope dt-eam12`.

**¿Vas a continuar o reemplazar el proyecto?** Lee [`docs/TRASPASO.md`](docs/TRASPASO.md): estado, despliegue,
dónde personalizar, cómo quitar las marcas de prototipo y qué conviene rescatar.

## Informe para la gerencia

[`docs/informe/informe-gerencia.md`](docs/informe/informe-gerencia.md) (y su PDF): problemas de seguridad del sitio
actual con evidencia, prioridades, pasos de limpieza, comparativa Lighthouse antes/después y las decisiones de
diseño de cada vista frente al sitio actual.

## Pendiente de confirmar con la empresa

- Logo oficial en alta calidad (hoy se usa un isotipo provisional con los colores del sitio actual).
- Dirección vigente (el sitio actual publica dos), cifras (1,100 vs. 1,300 equipos) y número de WhatsApp.
- Permiso para mostrar entidades, clientes y los testimonios con nombre.
- Contenido de la página de Sector público (RNP y documentación que presentan).
- Texto legal definitivo de privacidad y si aplica el Libro de Reclamaciones.
