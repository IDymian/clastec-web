# Seguridad

## Reportar una vulnerabilidad

No abras un issue público. Escribe al mantenedor del repositorio por mensaje privado de GitHub
(o usa *Security → Report a vulnerability* si está habilitado) con los pasos para reproducirla.

## Medidas aplicadas

| Área | Medida |
|---|---|
| Navegador | `Content-Security-Policy` estricta (`script-src 'self'`, sin `unsafe-inline`), `frame-ancestors 'none'`, HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP. Configuradas en `public/_headers` y `vercel.json`. |
| Imágenes externas | Única excepción a `'self'`: `img-src https://clastec.com` para las fotos del catálogo, con `referrerpolicy="no-referrer"` y rutas validadas por patrón. Temporal hasta alojarlas localmente. |
| Catálogo | El extractor guarda solo texto plano. Las tarjetas se construyen con nodos DOM y `textContent` (sin `innerHTML`). Test que verifica que el índice no tiene HTML ni precios. |
| Lista de cotización | Solo en `localStorage` del navegador, validada al leer y con límites (50 ítems, 999 unidades). |
| Código | Sin scripts, estilos ni manejadores de eventos en línea (verificado por test). JSON-LD escapado. Enlaces externos con `rel="noopener noreferrer"`. |
| Datos personales | El formulario no envía datos a ningún servidor en el prototipo. Consentimiento explícito (Ley 29733). Entradas limpiadas y con longitud máxima. |
| Privacidad | Sin analítica, píxeles ni cookies de terceros (verificado por test). |
| Indexación | `noindex` en meta y cabecera `X-Robots-Tag`, `robots.txt` con `Disallow: /`, banner visible de prototipo. |
| Integridad | Tests de IDs duplicados y enlaces internos rotos en todas las páginas. |
| Contenido | Test que falla si aparece algún slug de spam conocido del sitio actual o enlaces a ejecutables/comprimidos. |
| Secretos | `.env` ignorado por git; `.env.example` sin valores; test que busca patrones de credenciales en el build. |
| Dependencias | `package-lock.json` versionado, `npm ci --ignore-scripts` y `npm audit` en CI, Dependabot semanal. |
| CI | GitHub Actions con `permissions: contents: read` y `persist-credentials: false`. |
