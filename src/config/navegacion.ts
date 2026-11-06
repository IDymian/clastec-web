/** Menú principal: siempre visible, sin desplegables (máximo 7 opciones, Ley de Hick). */
export const menuPrincipal = [
  { href: '/', texto: 'Inicio', icono: 'casa' },
  { href: '/servicios/', texto: 'Servicios', icono: 'herramienta' },
  { href: '/catalogo/', texto: 'Catálogo', icono: 'buscar' },
  { href: '/sector-publico/', texto: 'Sector público', icono: 'escudo' },
  { href: '/nosotros/', texto: 'Nosotros', icono: 'usuarios' },
  { href: '/preguntas-frecuentes/', texto: 'Preguntas', icono: 'pregunta' },
  { href: '/contacto/', texto: 'Contacto', icono: 'telefono' },
] as const;

/** Barra inferior en celulares: las 5 acciones más usadas, con icono y texto. */
export const barraInferior = [
  { href: '/', texto: 'Inicio', icono: 'casa' },
  { href: '/servicios/', texto: 'Servicios', icono: 'herramienta' },
  { href: '/catalogo/', texto: 'Catálogo', icono: 'buscar' },
  { href: '/cotizar/', texto: 'Cotizar', icono: 'documento' },
] as const;

export function esActivo(ruta: string, href: string): boolean {
  const limpia = ruta.replace(/\/$/, '') || '/';
  if (href === '/') return limpia === '/';
  return limpia === href.replace(/\/$/, '') || limpia.startsWith(href);
}
