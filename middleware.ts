/**
 * Vercel Routing Middleware: protege TODO el prototipo con usuario y contraseña.
 * Las credenciales vienen de las variables de entorno PROTOTIPO_USUARIO y PROTOTIPO_CLAVE,
 * configuradas en Vercel (nunca en el código). Si faltan, el sitio queda bloqueado.
 *
 * Todo está en este único archivo a propósito: Vercel no empaqueta imports locales
 * del middleware, así que un import a src/ falla en producción (MIDDLEWARE_INVOCATION_FAILED).
 */
import { next } from '@vercel/functions';

export const config = { matcher: '/:path*' };

export type ResultadoAcceso = 'permitido' | 'denegado' | 'sin-configurar';

/** Comparación en tiempo constante para no filtrar información por tiempos de respuesta. */
function iguales(a: string, b: string): boolean {
  const ca = new TextEncoder().encode(a);
  const cb = new TextEncoder().encode(b);
  let diferencia = ca.length ^ cb.length;
  for (let i = 0; i < Math.max(ca.length, cb.length); i++) diferencia |= (ca[i] ?? 0) ^ (cb[i] ?? 0);
  return diferencia === 0;
}

/**
 * Falla cerrado: si las credenciales no están configuradas (o son demasiado cortas),
 * nadie entra. Así un despliegue mal configurado nunca queda público.
 */
export function verificarAcceso(cabecera: string | null, usuario?: string, clave?: string): ResultadoAcceso {
  if (!usuario || !clave || clave.length < 12) return 'sin-configurar';
  if (!cabecera?.startsWith('Basic ')) return 'denegado';
  let decodificado: string;
  try {
    decodificado = atob(cabecera.slice(6).trim());
  } catch {
    return 'denegado';
  }
  const separador = decodificado.indexOf(':');
  if (separador < 0) return 'denegado';
  const okUsuario = iguales(decodificado.slice(0, separador), usuario);
  const okClave = iguales(decodificado.slice(separador + 1), clave);
  return okUsuario && okClave ? 'permitido' : 'denegado';
}

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
