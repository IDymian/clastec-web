import { armarMensaje, type Cotizacion } from './validacion.ts';

export type ResultadoEnvio = { ok: true; canal: string } | { ok: false; error: string };

/**
 * Punto único de envío de cotizaciones.
 * Fase 1 (prototipo): abre WhatsApp con el mensaje prellenado; no se guarda nada en un servidor.
 * Para conectar un servicio real (Formspree, Resend, API propia), reemplaza la implementación
 * de esta función. Las claves deben ir en variables de entorno del servidor, nunca en el cliente.
 */
export async function submitQuote(c: Cotizacion, whatsapp: string): Promise<ResultadoEnvio> {
  const url = `https://wa.me/${encodeURIComponent(whatsapp)}?text=${encodeURIComponent(armarMensaje(c))}`;
  const ventana = window.open(url, '_blank', 'noopener,noreferrer');
  // Con 'noopener' algunos navegadores devuelven null aunque la pestaña se abra; no lo tratamos como error.
  void ventana;
  return { ok: true, canal: 'WhatsApp' };
}

export function enlaceCorreo(c: Cotizacion, correo: string): string {
  const asunto = encodeURIComponent(`Solicitud de cotización: ${c.servicio}`);
  return `mailto:${correo}?subject=${asunto}&body=${encodeURIComponent(armarMensaje(c))}`;
}
