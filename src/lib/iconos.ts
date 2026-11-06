/** Iconos lineales propios (24×24), sin librerías externas. */
export const trazos = {
  impresora: 'M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2M7 14h10v7H7z',
  laptop: 'M4 5h16v10H4zM2 19h20',
  herramienta: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.8-.7-.7-2.8z',
  documento: 'M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5M8 13h8M8 17h6',
  auriculares: 'M4 15v-3a8 8 0 0 1 16 0v3M4 15a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2zM20 15a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2zM18 17v1a3 3 0 0 1-3 3h-3',
  check: 'M5 12l5 5L20 7',
  escudo: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M9 12l2 2 4-4',
  mapa: 'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  grafico: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  reloj: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  usuarios: 'M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM22 19v-1a4 4 0 0 0-3-3.9M16 4.1a3 3 0 0 1 0 5.8',
  buscar: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5',
  carrito: 'M9 5h11l-1.5 8H8.5zM9 5 8 2H3M8.5 13 7 17h12M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  telefono: 'M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z',
  correo: 'M3 5h18v14H3zM3 6l9 7 9-7',
  casa: 'M3 11l9-8 9 8M5 9.5V21h5v-6h4v6h5V9.5',
  pregunta: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01',
  whatsapp: 'M4 20l1.3-3.9A8 8 0 1 1 8 19l-4 1zM9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2L9 9.5z',
  flecha: 'M5 12h14M13 6l6 6-6 6',
  volver: 'M19 12H5M11 6l-6 6 6 6',
  trabajo: 'M4 8h16v12H4zM9 8V5h6v3M4 13h16',
  mapaSitio: 'M4 4h6v5H4zM14 4h6v5h-6zM4 15h6v5H4zM14 15h6v5h-6zM7 9v6M17 9v6',
} as const;

export type NombreIcono = keyof typeof trazos;
