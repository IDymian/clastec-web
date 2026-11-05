import { armarMensaje, type Cotizacion, type ProductoMensaje } from './validacion.ts';

export type ResultadoEnvio = { ok: true; canal: string } | { ok: false; error: string };

/** WhatsApp limita la longitud práctica de la URL; recortamos el detalle si hace falta. */
const MAX_URL = 7000;

/**
 * Punto único de envío de cotizaciones.
 * Fase 1 (prototipo): abre WhatsApp con el mensaje prellenado; no se guarda nada en un servidor.
 * Para conectar un servicio real (Formspree, Resend, API propia), reemplaza la implementación
 * de esta función. Las claves deben ir en variables de entorno del servidor, nunca en el cliente.
 */
export async function submitQuote(
  c: Cotizacion,
  whatsapp: string,
  productos: readonly ProductoMensaje[] = [],
): Promise<ResultadoEnvio> {
  let url = `https://wa.me/${encodeURIComponent(whatsapp)}?text=${encodeURIComponent(armarMensaje(c, productos))}`;
  if (url.length > MAX_URL) {
    url = `https://wa.me/${encodeURIComponent(whatsapp)}?text=${encodeURIComponent(
      `${armarMensaje(c)}\nProductos: ${productos.length} ítems (te envío el detalle por correo).`,
    )}`;
  }
  window.open(url, '_blank', 'noopener,noreferrer');
  return { ok: true, canal: 'WhatsApp' };
}

export function enlaceCorreo(c: Cotizacion, correo: string, productos: readonly ProductoMensaje[] = []): string {
  const asunto = encodeURIComponent(`Solicitud de cotización: ${c.servicio}`);
  return `mailto:${correo}?subject=${asunto}&body=${encodeURIComponent(armarMensaje(c, productos))}`;
}
