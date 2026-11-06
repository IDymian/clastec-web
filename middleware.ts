/**
 * Vercel Routing Middleware: protege TODO el prototipo con usuario y contraseña.
 * Las credenciales vienen de las variables de entorno PROTOTIPO_USUARIO y PROTOTIPO_CLAVE,
 * configuradas en Vercel (nunca en el código). Si faltan, el sitio queda bloqueado.
 */
import { next } from '@vercel/functions';
import { verificarAcceso } from './src/lib/acceso.ts';

export const config = { matcher: '/:path*' };

const CABECERAS_SEGURAS = {
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow',
  'Content-Type': 'text/plain; charset=utf-8',
};

export default function middleware(request: Request): Response {
  const resultado = verificarAcceso(
    request.headers.get('authorization'),
    process.env['PROTOTIPO_USUARIO'],
    process.env['PROTOTIPO_CLAVE'],
  );

  if (resultado === 'permitido') return next();

  if (resultado === 'sin-configurar') {
    return new Response('Prototipo cerrado: falta configurar el acceso.', { status: 503, headers: CABECERAS_SEGURAS });
  }

  return new Response('Prototipo privado de CLASTEC. Se necesita usuario y contraseña.', {
    status: 401,
    headers: { ...CABECERAS_SEGURAS, 'WWW-Authenticate': 'Basic realm="Prototipo CLASTEC", charset="UTF-8"' },
  });
}
