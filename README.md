# CLASTEC — Sitio web (prototipo)

> **Prototipo — no es el sitio oficial.** El sitio oficial de CLASTEC S.A.C. es <https://clastec.com>.

Sitio B2B para CLASTEC S.A.C. (outsourcing de impresión y servicios de TI, Lima, Perú).
Objetivo: que un jefe de TI, logística o compras entienda en segundos qué hace la empresa, por qué
confiar en ella y cómo **solicitar una cotización**.

## Páginas

| Ruta | Contenido |
|---|---|
| `/` | Hero, beneficios, 5 servicios, cifras, catálogo destacado, sector público, proceso, testimonios, FAQ y formulario |
| `/servicios/` y `/servicios/{id}/` | Índice y 5 páginas: qué incluye, beneficios, proceso, FAQ propia y cotización con el servicio preseleccionado |
| `/servicios/alquiler-de-equipos/` | Además: 8 tipos de equipo con anclas, plazos y SLA |
| `/catalogo/` | 1,952 productos con búsqueda (sin tildes, por número de parte), filtros por categoría y marca, filtros en la URL y lista de cotización |
| `/sector-publico/` | Página nueva: entidades atendidas, ventajas y etapas de contratación |
| `/nosotros/` | Historia (línea de tiempo), diferenciadores, alianzas, certificaciones |
| `/preguntas-frecuentes/` | FAQ por tema y por servicio (datos estructurados FAQPage) |
| `/contacto/` | Formulario con la lista de productos editable |
| `/privacidad/`, `/libro-de-reclamaciones/`, `/404` | Legales y página de error útil con búsqueda |

## Stack

- [Astro](https://astro.build) 7 (generación estática, cero JS salvo el formulario)
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
```

## Catálogo

`scripts/extract.ts` descarga el catálogo público de la Store API de WooCommerce a
`data/snapshot/catalogo.json` (solo texto plano, sin HTML ni precios). El build lee ese snapshot,
no la API en vivo, y genera `/catalogo/indice.json` (≈50 KB comprimido) para la búsqueda en el navegador.
`scripts/imagenes.ts` descarga las fotos del catálogo (1,291 imágenes) y las convierte a WebP de 288×288
en `public/img/catalogo/` (≈5.7 MB en total, ≈4.5 KB por imagen). El sitio no depende de clastec.com
para mostrar nada. Ambos scripts son incrementales y respetan los mismos límites de peticiones.

Variables de entorno: copia `.env.example` a `.env`. Hoy solo existe `SITE_URL` (URL del despliegue,
para canonical y Open Graph). **Nunca** subas `.env` al repositorio.

## Estructura

```
src/
├─ config/site.ts      # ÚNICA fuente de datos de la empresa (años, teléfonos, cifras…)
├─ content/servicios.ts # Contenido de los 5 servicios y tipos de equipo en alquiler
├─ components/         # Header, Cabecera, Migas, Cotizar, Testimonios, CtaBanda…
├─ layouts/Base.astro  # <head>, SEO, noindex, banner de prototipo
├─ lib/                # Validación, envío (submitQuote), lista de cotización y catálogo
├─ pages/              # 16 páginas + catalogo/indice.json
└─ styles/global.css   # Tema de Tailwind (identidad provisional)
public/
├─ _headers            # Cabeceras de seguridad (Netlify / Cloudflare Pages)
└─ robots.txt          # Disallow: / (prototipo)
vercel.json            # Cabeceras de seguridad (Vercel)
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

Vercel o Netlify detectan el proyecto automáticamente (`npm run build`, carpeta `dist`). Las cabeceras de
seguridad ya están configuradas. Recomendado: proteger el despliegue con contraseña.

## Pendiente de confirmar con la empresa

- Logo oficial en alta calidad (hoy se usa un isotipo provisional con los colores del sitio actual).
- Dirección vigente (el sitio actual publica dos), cifras (1,100 vs. 1,300 equipos) y número de WhatsApp.
- Permiso para mostrar entidades, clientes y los testimonios con nombre.
- Contenido de la página de Sector público (RNP y documentación que presentan).
- Texto legal definitivo de privacidad y si aplica el Libro de Reclamaciones.
