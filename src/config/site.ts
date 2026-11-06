/**
 * ÚNICA fuente de datos de la empresa.
 * Cualquier dato visible (años, teléfonos, cifras, correo, clientes) debe salir de aquí.
 * Los campos marcados como pendientes deben validarse con el dueño antes de producción
 * (ver docs/hallazgos-extraccion.md).
 */

const FUNDACION = { anio: 2004, mes: 2 } as const; // febrero de 2004
const INICIO_OUTSOURCING = 2008; // la portada actual indica 18 años en outsourcing de impresión

function aniosDesde(anio: number, mes = 1, hoy = new Date()): number {
  return Math.floor(((hoy.getFullYear() - anio) * 12 + (hoy.getMonth() + 1 - mes)) / 12);
}

export const site = {
  nombreComercial: 'CLASTEC',
  razonSocial: 'Corporación Latinoamericana de Servicios Tecnológicos S.A.C.',
  ruc: '20508161418',
  fundacion: FUNDACION,
  aniosExperiencia: aniosDesde(FUNDACION.anio, FUNDACION.mes),
  aniosOutsourcing: aniosDesde(INICIO_OUTSOURCING),
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
    clientes: 110,
    contratosActivos: 70,
    /** Portada: 1,300 · Nosotros: 1,100. Se usa el más reciente. Pendiente de confirmar. */
    equiposAdministrados: 1300,
  },
  redes: {
    facebook: 'https://www.facebook.com/ClastecPeru',
  },
  sitioOficial: 'https://clastec.com',
} as const;

export const alianzas = [
  { nombre: 'Xerox', nivel: 'Partner Platinum', detalle: 'Centro Autorizado de Servicios (ASP) y Canal Autorizado de Servicios de Impresión Administrada (CMPS).' },
  { nombre: 'HP', nivel: 'Partner', detalle: 'Equipos, suministros y servicio técnico.' },
  { nombre: 'Epson', nivel: 'Alianza comercial', detalle: 'Impresoras, escáneres e impresoras de etiquetas.' },
] as const;

export const certificaciones = ['Xerox', 'HP', 'Epson', 'Lexmark', 'Microsoft', 'ITIL'] as const;

/** Entidades públicas atendidas según el sitio actual. Logos: pendiente de permiso. */
export const entidadesPublicas = [
  'Cortes Superiores de Justicia',
  'Ministerio de Cultura',
  'MINCETUR',
  'Jurado Nacional de Elecciones',
] as const;

/** Testimonios publicados en la portada actual. Pendiente: confirmar permiso de uso. */
export const testimonios = [
  {
    texto: 'Contábamos con un proveedor de outsourcing de impresión cuyo servicio había decaído mucho. CLASTEC participó en nuestro proceso de licitación con equipos Xerox y una plataforma que asegura la continuidad operativa. Nuestros usuarios están satisfechos.',
    autor: 'Ing. Julia Carrión Pérez',
    cargo: 'Coordinadora de Informática',
    entidad: 'Corte Superior de Justicia de Lima Sur',
  },
  {
    texto: 'El apoyo de CLASTEC fue muy oportuno y dedicado: estuvieron con nosotros hasta culminar las labores, dejando una buena imagen ante nuestros clientes internos y externos.',
    autor: 'Ing. Juaclio Becerra Núñez',
    cargo: 'Coordinador de Informática',
    entidad: 'CSJ Arequipa',
  },
  {
    texto: 'Gracias a la pronta atención de sus técnicos, las labores se mantuvieron operativas y los problemas se redujeron considerablemente. Recomendaría su servicio sin dudarlo.',
    autor: 'Eric Marco Guevara Lavado',
    cargo: 'Supervisor de Obra',
    entidad: 'Ministerio de Cultura',
  },
  {
    texto: 'No teníamos soporte técnico para nuestros servidores, que son primordiales para el negocio. Con CLASTEC tenemos mantenimientos preventivos y correctivos programados con niveles de servicio.',
    autor: 'Víctor Delgado Armas',
    cargo: 'Analista de Sistemas',
    entidad: 'Inmobiliaria y Constructora Marcan',
  },
] as const;

export const historia = [
  { anio: '2004', t: 'Fundación', d: 'Socios con experiencia en el mercado informático crean CLASTEC en Lima, comercializando repuestos y suministros.' },
  { anio: 'Crecimiento', t: 'Servicios técnicos', d: 'Incorporamos el mantenimiento preventivo y correctivo de equipos informáticos.' },
  { anio: String(INICIO_OUTSOURCING), t: 'Outsourcing de impresión', d: 'Lanzamos el servicio que hoy es nuestra principal línea de negocio.' },
  { anio: 'Expansión', t: 'Soluciones integrales', d: 'Sumamos digitalización documental, alquiler de equipos y mesa de ayuda de TI.' },
  { anio: 'Hoy', t: 'Partner Platinum de Xerox', d: `Presencia en ${site.cifras.departamentos} departamentos, ${site.cifras.contratosActivos} contratos activos y más de ${site.cifras.equiposAdministrados.toLocaleString('es-PE')} equipos administrados.` },
] as const;

export const documentosReglamentarios = ['Código de Ética', 'Reglamento Interno de Trabajo', 'Política Integrada'] as const;

/** Preguntas generales (la portada muestra las primeras). Las de cada servicio están en src/content/servicios.ts. */
export const preguntasGenerales = [
  {
    categoria: 'Sobre CLASTEC',
    preguntas: [
      { p: '¿Atienden fuera de Lima?', r: `Sí. Tenemos presencia en ${site.cifras.departamentos} departamentos del Perú, ${site.cifras.departamentosConPersonal} de ellos con personal propio.` },
      { p: '¿Trabajan con entidades del Estado?', r: 'Sí. Participamos en procesos de contratación pública y atendemos a Cortes Superiores de Justicia, ministerios y otras entidades.' },
      { p: '¿En cuánto tiempo responden una cotización?', r: 'Respondemos en menos de 24 horas hábiles. Si es urgente, escríbenos por WhatsApp.' },
    ],
  },
  {
    categoria: 'Compra de productos',
    preguntas: [
      { p: '¿Cómo compro un producto del catálogo?', r: 'Agrégalo a tu lista de cotización y envíanosla. Un asesor confirma disponibilidad, precio, forma de pago y entrega. Verifica número de parte, marca y compatibilidad antes de pedir.' },
      { p: '¿Qué formas de pago aceptan?', r: 'Transferencia bancaria (BCP, Scotiabank, BBVA y BanBif) y efectivo para montos menores, coordinando antes con un asesor. No pagues sin confirmar el stock.' },
      { p: '¿Emiten factura o boleta?', r: 'Sí, emitimos factura o boleta en todas las ventas, según seas empresa o persona natural.' },
      { p: '¿Hacen delivery?', r: 'Sí, a la mayoría de distritos de Lima y Callao. El costo depende del tamaño del producto y el destino. Tras confirmar el pago, el despacho toma de 24 a 48 horas.' },
    ],
  },
  {
    categoria: 'Alquiler y soporte',
    preguntas: [
      { p: '¿Conviene comprar o alquilar los equipos?', r: 'Si renuevas equipos con frecuencia o no quieres inmovilizar capital, el alquiler suele convenir más: incluye mantenimiento y reemplazo. Te ayudamos a comparar ambos escenarios con tus números.' },
      { p: '¿Cuál es el plazo mínimo de alquiler?', r: 'Varía según la necesidad: días para eventos, semanas o meses para proyectos y hasta tres años para flotas.' },
      { p: 'Si un equipo falla, ¿qué tan rápido llega un técnico?', r: 'Primero damos atención remota. Si no se resuelve, coordinamos la visita en el tiempo acordado en el contrato: desde 30 minutos hasta 24 horas.' },
    ],
  },
] as const;

/** Preguntas destacadas para la portada. */
export const preguntas = [
  ...preguntasGenerales[2].preguntas.slice(0, 1),
  ...preguntasGenerales[0].preguntas,
] as const;
