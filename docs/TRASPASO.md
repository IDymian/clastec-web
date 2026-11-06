# Traspaso del proyecto

Guía para quien continúe o reemplace este prototipo. Estado al **6 de noviembre de 2026**.

## Qué es y en qué estado está

- **Prototipo** del nuevo sitio de CLASTEC S.A.C. No es el sitio oficial (<https://clastec.com>, en WordPress).
- 125 páginas estáticas (Astro 7 + Tailwind 4), catálogo de 1,952 productos sin precios y formulario de
  cotización que abre WhatsApp o el correo. **No hay backend ni base de datos.**
- Publicado en Vercel, **protegido con usuario y contraseña**: <https://clastec-prototipo.vercel.app>.
- Datos de la empresa sin confirmar con el dueño (ver "Pendiente de confirmar" en el [README](../README.md)).

Es un punto de partida: se puede personalizar o descartar por completo. Lo que conviene conservar aunque se
descarte el diseño está en "Qué rescatar".

## Despliegue actual (Vercel)

| Dato | Valor |
|---|---|
| Equipo / proyecto | `dt-eam12` (DTeam) / `clastec-prototipo` |
| URL | <https://clastec-prototipo.vercel.app> |
| Cómo se publica | Manual desde la CLI: `npx vercel deploy --prod --scope dt-eam12` (Windows: `npx.cmd`) |
| Protección | `middleware.ts` (Basic Auth). Lee `PROTOTIPO_USUARIO` y `PROTOTIPO_CLAVE` de las variables de entorno de Vercel |
| Si faltan las variables | El sitio responde **503 "Prototipo cerrado"** (falla cerrado, nunca queda abierto por error) |

- El repositorio **no** está conectado a Vercel por Git: cada `git push` no despliega solo. Para conectarlo:
  Vercel → Account Settings → Authentication → GitHub, y luego el proyecto → Settings → Git.
- La contraseña es de tipo *Secret*: no se puede leer desde Vercel. Si se pierde, se reemplaza
  (`vercel env rm PROTOTIPO_CLAVE production` y `vercel env add …`) y se vuelve a desplegar. Mínimo 12 caracteres.
- Las credenciales **nunca** van en el código ni en `.env` versionado.
- Si el autor de los commits usa un correo que no está en la cuenta de Vercel, Vercel bloquea el
  despliegue (`TEAM_ACCESS_REQUIRED`). Solución: añadir y verificar ese correo en la cuenta.
- Para transferir el proyecto a otra cuenta: Vercel → proyecto → Settings → General → Transfer.

## Cómo personalizarlo

| Quiero cambiar… | Dónde |
|---|---|
| Teléfonos, correo, años, cifras, testimonios, alianzas | `src/config/site.ts` (única fuente de datos de la empresa) |
| Textos de los 5 servicios y equipos en alquiler | `src/content/servicios.ts` |
| Colores, tipografía, botones | `src/styles/global.css` (`@theme` y `@utility`) |
| Menú y barra inferior del celular | `src/config/navegacion.ts` |
| Portada | `src/pages/index.astro` |
| Cabecera, pie, tarjetas, pasos, CTA | `src/components/` |
| Envío real del formulario | `submitQuote()` en `src/lib/cotizacion.ts` (las claves, en el servidor) |
| Catálogo | `npm run extract` y `npm run imagenes` (solo GET a clastec.com, ver README) |

Antes de cada commit: `npm run verify` (tipos + build + 33 tests). Los tests fallan si se rompe un enlace,
aparece una página spam del sitio actual, un script en línea, un rastreador o un secreto.

## Para publicarlo como sitio oficial (quitar las marcas de prototipo)

1. Borrar `middleware.ts` y las variables `PROTOTIPO_*` en Vercel (deja de pedir contraseña).
2. Quitar `<meta name="robots" content="noindex, nofollow">` en `src/layouts/Base.astro`.
3. Quitar `X-Robots-Tag` en `vercel.json` y `public/_headers`.
4. `public/robots.txt`: cambiar `Disallow: /` por `Allow: /` y añadir el sitemap.
5. Quitar `<PrototipoBanner />` en `src/layouts/Base.astro`.
6. Ajustar los tests de `tests/build.test.ts` que exigen `noindex` y el banner.
7. Definir `SITE_URL` con el dominio definitivo y conectar el dominio en Vercel.
8. Confirmar antes con la empresa todos los datos pendientes y los permisos de testimonios y clientes.

## Qué rescatar aunque se descarte el diseño

- El diagnóstico del sitio actual se entregó aparte a la gerencia (no está en este repositorio). Su limpieza
  no depende del sitio nuevo.
- `data/snapshot/` y `public/img/catalogo/`: catálogo limpio (texto plano, sin precios) e imágenes en WebP.
- `tests/build.test.ts`: la lista negra de slugs spam y las comprobaciones de seguridad del build.
- `vercel.json` / `public/_headers`: CSP estricta y cabeceras de seguridad.
- `src/lib/validacion.ts`: validación de RUC (dígito verificador), teléfono peruano y correo.

## Decisiones de diseño vigentes

- Landing comercial (rediseño del 6 de noviembre de 2026), con los colores del sitio actual (azul marino y dorado).
- **Se retiró** el control de tamaño de letra (A / A+ / A++) y la letra base de 18 px, a pedido.
- Se mantiene: menú siempre visible sin desplegables, respuestas de preguntas frecuentes visibles,
  "Volver a…" y migas, teléfono a la vista y barra inferior en celular.
- Lighthouse en celular (local): 100 / 100 / 100 en rendimiento, accesibilidad y buenas prácticas;
  SEO bajo a propósito por el `noindex`.
