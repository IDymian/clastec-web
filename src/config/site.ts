/**
 * ÚNICA fuente de datos de la empresa.
 * Cualquier dato visible (años, teléfonos, cifras, correo) debe salir de aquí.
 * Los campos marcados con `pendienteConfirmar` deben validarse con el dueño antes de producción.
 */

const FUNDACION = { anio: 2004, mes: 2 } as const; // febrero de 2004

function aniosDesde(anio: number, mes: number, hoy = new Date()): number {
  const meses = (hoy.getFullYear() - anio) * 12 + (hoy.getMonth() + 1 - mes);
  return Math.floor(meses / 12);
}

export const site = {
  nombreComercial: 'CLASTEC',
  razonSocial: 'Corporación Latinoamericana de Servicios Tecnológicos S.A.C.',
  ruc: '20508161418',
  fundacion: FUNDACION,
  aniosExperiencia: aniosDesde(FUNDACION.anio, FUNDACION.mes),
  ubicacion: 'La Victoria, Lima, Perú',
  /** Hay dos direcciones publicadas en el sitio actual; no se muestra ninguna hasta confirmar. */
  direccion: null as string | null,
  horario: 'Lunes a viernes, 8:30 a 18:30',
  correoVentas: 'ventas@clastec.com',
  telefonos: [
    { etiqueta: 'Ventas', numero: '+51998176904', visible: '+51 998 176 904' },
    { etiqueta: 'Ventas', numero: '+51943412456', visible: '+51 943 412 456' },
  ],
  /** Número que recibe las cotizaciones por WhatsApp (pendiente de confirmar). */
  whatsapp: '51998176904',
  cifras: {
    departamentos: 17,
    departamentosConPersonal: 13,
    contratosActivos: 70,
    equiposAdministrados: 1100,
    pendienteConfirmar: true,
  },
  redes: {
    facebook: 'https://www.facebook.com/ClastecPeru',
  },
  sitioOficial: 'https://clastec.com',
} as const;

export type Servicio = {
  id: string;
  titulo: string;
  resumen: string;
  puntos: readonly string[];
};

export const servicios: readonly Servicio[] = [
  {
    id: 'outsourcing-de-impresion',
    titulo: 'Outsourcing de impresión',
    resumen:
      'Pagas por lo que imprimes. Nosotros ponemos los equipos, el tóner, el mantenimiento y el control de consumo.',
    puntos: ['Costo por página predecible', 'Reportes de consumo por área', 'Soporte técnico en sitio'],
  },
  {
    id: 'alquiler-de-equipos',
    titulo: 'Alquiler de equipos',
    resumen:
      'Laptops, PCs, impresoras multifuncionales, escáneres, servidores y switches listos para trabajar.',
    puntos: ['Sin inversión inicial', 'Reemplazo ante fallas', 'Plazos flexibles'],
  },
  {
    id: 'mantenimiento',
    titulo: 'Mantenimiento preventivo y correctivo',
    resumen:
      'Técnicos certificados que mantienen tus equipos operativos y reducen paradas no planificadas.',
    puntos: ['Planes preventivos', 'Atención correctiva', 'Repuestos originales'],
  },
  {
    id: 'digitalizacion',
    titulo: 'Digitalización de documentos',
    resumen:
      'Convertimos tu archivo físico en documentos digitales con búsqueda de texto (OCR).',
    puntos: ['Escaneo masivo', 'Indexación y OCR', 'Entrega ordenada y segura'],
  },
  {
    id: 'mesa-de-ayuda',
    titulo: 'Mesa de ayuda de TI',
    resumen:
      'Un punto único de contacto para resolver incidencias de tus usuarios con buenas prácticas ITIL.',
    puntos: ['Atención por niveles', 'Seguimiento de tickets', 'Indicadores de servicio'],
  },
] as const;

export const alianzas = [
  { nombre: 'Xerox', detalle: 'Partner Platinum · Centro Autorizado de Servicios (ASP) · Canal CMPS' },
  { nombre: 'HP', detalle: 'Partner' },
  { nombre: 'Epson', detalle: 'Alianza comercial' },
] as const;

export const certificaciones = ['Xerox', 'HP', 'Epson', 'Lexmark', 'Microsoft', 'ITIL'] as const;

/** Entidades públicas atendidas según el sitio actual. Logos: pendiente de permiso. */
export const entidadesPublicas = [
  'Cortes Superiores de Justicia',
  'Ministerio de Cultura',
  'MINCETUR',
  'Jurado Nacional de Elecciones',
] as const;

export const preguntas = [
  {
    p: '¿Conviene comprar o alquilar los equipos?',
    r: 'Si renuevas equipos con frecuencia o no quieres inmovilizar capital, el alquiler suele ser más conveniente: incluye mantenimiento y reemplazo. Te ayudamos a comparar ambos escenarios con tus números.',
  },
  {
    p: '¿Atienden fuera de Lima?',
    r: `Sí. Tenemos presencia en ${site.cifras.departamentos} departamentos del Perú, ${site.cifras.departamentosConPersonal} de ellos con personal propio.`,
  },
  {
    p: '¿Trabajan con entidades del Estado?',
    r: 'Sí. Participamos en procesos de contratación pública y atendemos a entidades como Cortes Superiores de Justicia y ministerios.',
  },
  {
    p: '¿En cuánto tiempo responden una cotización?',
    r: 'Respondemos en menos de 24 horas hábiles. Si es urgente, escríbenos por WhatsApp.',
  },
] as const;
