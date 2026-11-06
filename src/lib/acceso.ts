/**
 * Control de acceso del despliegue de prueba (HTTP Basic Auth).
 * Sin dependencias para poder probarlo con `node --test` y usarlo en el middleware de Vercel.
 */

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
