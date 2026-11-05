# CLASTEC — Landing page (prototipo)

> **Prototipo — no es el sitio oficial.** El sitio oficial de CLASTEC S.A.C. es <https://clastec.com>.

Landing page B2B para CLASTEC S.A.C. (outsourcing de impresión y servicios de TI, Lima, Perú).
Objetivo: que un jefe de TI, logística o compras entienda en segundos qué hace la empresa, por qué
confiar en ella y cómo **solicitar una cotización**.

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
```

Variables de entorno: copia `.env.example` a `.env`. Hoy solo existe `SITE_URL` (URL del despliegue,
para canonical y Open Graph). **Nunca** subas `.env` al repositorio.

## Estructura

```
src/
├─ config/site.ts      # ÚNICA fuente de datos de la empresa (años, teléfonos, cifras…)
├─ components/         # Secciones de la landing
├─ layouts/Base.astro  # <head>, SEO, noindex, banner de prototipo
├─ lib/                # Validación y envío del formulario (submitQuote)
├─ pages/              # index, privacidad, libro-de-reclamaciones, 404
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

- Logo oficial y colores de marca (hoy se usa una identidad provisional).
- Dirección vigente (el sitio actual publica dos), cifras y número de WhatsApp que recibe cotizaciones.
- Permiso para mostrar entidades/clientes y testimonios.
- Texto legal definitivo de privacidad y si aplica el Libro de Reclamaciones.
