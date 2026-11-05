/**
 * Contenido de los servicios. Reescrito a partir del sitio actual (clastec.com) con lenguaje
 * orientado al cliente. Cifras y datos de contacto viven en src/config/site.ts.
 */

export type Item = { t: string; d: string };
export type Pregunta = { p: string; r: string };
export type IconoNombre = 'impresora' | 'laptop' | 'herramienta' | 'documento' | 'auriculares';

export type Servicio = {
  id: string;
  titulo: string;
  tituloCorto: string;
  icono: IconoNombre;
  resumen: string;
  seo: { titulo: string; descripcion: string };
  gancho: string;
  intro: readonly string[];
  beneficios: readonly Item[];
  incluye: readonly Item[];
  caracteristicas: readonly string[];
  proceso?: { titulo: string; pasos: readonly Item[] };
  preguntas: readonly Pregunta[];
};

export const servicios: readonly Servicio[] = [
  {
    id: 'outsourcing-de-impresion',
    titulo: 'Outsourcing de impresión',
    tituloCorto: 'Outsourcing',
    icono: 'impresora',
    resumen: 'Pagas por lo que imprimes. Nosotros ponemos los equipos, el tóner, los repuestos y el soporte.',
    seo: {
      titulo: 'Outsourcing de impresión en Perú | CLASTEC',
      descripcion: 'Controla y reduce tus costos de impresión, copia y escaneo. Equipos Xerox y HP, suministros, mantenimiento y soporte con niveles de servicio (SLA).',
    },
    gancho: '¿Sabes cuánto gasta tu empresa en imprimir?',
    intro: [
      'Nos hacemos responsables de que tus impresoras y multifuncionales funcionen siempre: equipos, suministros, repuestos y servicio técnico en una sola factura.',
      'Podemos trabajar con equipos nuestros o con los que ya tienes. Como distribuidor autorizado de las principales marcas accedemos a mejores condiciones en equipos y consumibles, y ese ahorro se refleja en tu costo por página.',
    ],
    beneficios: [
      { t: 'Menor costo por página', d: 'Reducción significativa del gasto en impresión, copia y escaneo.' },
      { t: 'Continuidad operativa', d: 'Equipo de reemplazo si una impresora no puede repararse a tiempo.' },
      { t: 'Una sola factura', d: 'Olvídate de comprar tóner, repuestos y servicios por separado.' },
      { t: 'Calidad garantizada', d: 'Suministros y repuestos de las marcas, instalados por técnicos certificados.' },
    ],
    incluye: [
      { t: 'Equipos', d: 'Impresoras y multifuncionales de última generación en la cantidad y configuración que necesitas.' },
      { t: 'Suministros', d: 'Tóner, drum y fusor calculados según tu volumen real de impresión.' },
      { t: 'Repuestos', d: 'Kits ADF, rodillos y demás repuestos originales sin costo adicional.' },
      { t: 'Mantenimiento', d: 'Preventivo programado y correctivo cuando se necesite.' },
      { t: 'Acuerdos de nivel de servicio (SLA)', d: 'Tiempos de respuesta, reparación y cambio de equipo por contrato.' },
      { t: 'Equipo de respaldo', d: 'De características iguales o superiores al instalado.' },
      { t: 'Mesa de ayuda', d: 'Un solo número para reportar cualquier incidencia.' },
      { t: 'Administrador de cuenta', d: 'Reportes mensuales de consumo y atención de requerimientos adicionales.' },
      { t: 'Herramienta de gestión', d: 'Monitoreo de equipos y contadores para controlar el consumo por área.' },
    ],
    caracteristicas: [
      'Instalación, configuración y capacitación a usuarios en cada sede.',
      'Escaneo a carpeta, correo, red o nube según el equipo.',
      'Trabajamos con Xerox, HP y otras marcas líderes.',
      'Suministros calculados sobre una cobertura de impresión del 5 %, según los fabricantes.',
    ],
    proceso: {
      titulo: 'Cómo implementamos el servicio',
      pasos: [
        { t: 'Diagnóstico', d: 'Revisamos tus equipos, volúmenes y gasto actual.' },
        { t: 'Propuesta', d: 'Te proponemos equipos, ubicaciones y un costo por página.' },
        { t: 'Instalación', d: 'Trasladamos, instalamos y configuramos en cada sede.' },
        { t: 'Operación', d: 'Monitoreamos, abastecemos y reportamos cada mes.' },
      ],
    },
    preguntas: [
      { p: '¿Puedo usar mis propios equipos?', r: 'Sí. Podemos operar el servicio con tus equipos actuales o con equipos de CLASTEC.' },
      { p: '¿Cómo se calcula el costo?', r: 'Por volumen de páginas impresas, copiadas o escaneadas, según lo acordado en el contrato.' },
    ],
  },
  {
    id: 'alquiler-de-equipos',
    titulo: 'Alquiler de equipos informáticos',
    tituloCorto: 'Alquiler',
    icono: 'laptop',
    resumen: 'Laptops, PCs, impresoras, escáneres, servidores, switches, UPS y proyectores, desde un día hasta tres años.',
    seo: {
      titulo: 'Alquiler de laptops, PCs, impresoras y servidores | CLASTEC',
      descripcion: 'Alquila equipos informáticos para proyectos, eventos o tu operación diaria. Mantenimiento, equipos de respaldo y SLA incluidos.',
    },
    gancho: 'Los equipos que necesitas, cuando los necesitas.',
    intro: [
      'Contar con equipos actualizados sin inmovilizar capital. Atendemos desde un equipo por un mes o varios para un evento de pocos días, hasta flotas completas por tres años.',
      'Trabajamos con empresas de ingeniería, construcción, salud, consultoría y entidades públicas. Nuestros asesores te ayudan a elegir el equipo adecuado para tu proyecto y presupuesto.',
    ],
    beneficios: [
      { t: 'Sin inversión inicial', d: 'Pagas un alquiler mensual en lugar de comprar.' },
      { t: 'Flexibilidad', d: 'Aumenta o reduce equipos según tu demanda.' },
      { t: 'Tecnología actual', d: 'Renovamos la flota con los modelos más demandados.' },
      { t: 'Mantenimiento incluido', d: 'Preventivo y correctivo durante todo el contrato.' },
    ],
    incluye: [
      { t: 'Consumibles', d: 'Tóner, drum, cintas, tintas y papel según lo acordado.' },
      { t: 'Acuerdos de nivel de servicio (SLA)', d: 'Definidos antes de entregar los equipos.' },
      { t: 'Equipos de respaldo', d: 'Amplio stock de las principales marcas y modelos.' },
      { t: 'Mantenimiento y soporte', d: 'Para mantener los equipos en su máximo rendimiento.' },
      { t: 'Mesa de ayuda', d: 'Primer nivel de soporte para cualquier evento.' },
      { t: 'Administrador de cuenta', d: 'Según el tipo y el plazo del alquiler.' },
    ],
    caracteristicas: [
      'Equipos de diversas marcas, modelos y configuraciones técnicas.',
      'Precios, plazos y niveles de servicio flexibles.',
      'Técnicos y asesores especialistas durante todo el contrato.',
    ],
    proceso: {
      titulo: 'Qué garantizan nuestros SLA',
      pasos: [
        { t: 'Tiempo de respuesta', d: 'Lo que tarda el técnico en llegar a tu sede.' },
        { t: 'Tiempo de reparación', d: 'Lo que tarda en dejar el equipo operativo.' },
        { t: 'Tiempo de cambio', d: 'Si no se puede reparar, lo reemplazamos por uno igual o superior.' },
      ],
    },
    preguntas: [
      { p: '¿Cuál es el plazo mínimo de alquiler?', r: 'Depende del equipo y del uso: días o semanas para eventos y ferias; semanas, meses o años para proyectos.' },
      { p: '¿Qué condiciones hay para alquilar?', r: 'Pago del mes por adelantado, un depósito de garantía (también puede ser un cheque de gerencia) y una declaración jurada sobre el cuidado de los equipos.' },
      { p: 'Si el equipo falla, ¿cuánto tarda el técnico?', r: 'Primero intentamos resolverlo de forma remota. Si no es posible, coordinamos la visita en el tiempo acordado en el contrato: desde 30 minutos hasta 24 horas.' },
    ],
  },
  {
    id: 'mantenimiento',
    titulo: 'Mantenimiento preventivo y correctivo',
    tituloCorto: 'Mantenimiento',
    icono: 'herramienta',
    resumen: 'Técnicos certificados que alargan la vida de tus equipos y los reparan cuando fallan.',
    seo: {
      titulo: 'Mantenimiento preventivo y correctivo de equipos | CLASTEC',
      descripcion: 'Mantenimiento de computadoras, laptops, impresoras y servidores con SLA, informes técnicos, equipo de respaldo y mesa de ayuda.',
    },
    gancho: 'Menos paradas, equipos que duran más.',
    intro: [
      'El mantenimiento preventivo son visitas programadas de revisión, limpieza, ajuste y diagnóstico de hardware y software para evitar fallas.',
      'El correctivo resuelve una falla cuando ocurre: cambio de componentes, problemas de software o virus. Al terminar cada visita, el técnico entrega un informe con los resultados.',
    ],
    beneficios: [
      { t: 'Continuidad operativa', d: 'Menos interrupciones en el trabajo de tus usuarios.' },
      { t: 'Mayor vida útil', d: 'Equipos bien mantenidos rinden más años.' },
      { t: 'Garantía del trabajo', d: 'Respaldamos la calidad de cada intervención.' },
      { t: 'Información para decidir', d: 'Inventario e informes para planificar renovaciones.' },
    ],
    incluye: [
      { t: 'Mantenimiento preventivo', d: 'Limpieza interna y externa, lubricación y ajustes.' },
      { t: 'Mantenimiento correctivo', d: 'Atención cuando un equipo sufre una falla.' },
      { t: 'Acuerdos de nivel de servicio (SLA)', d: 'Protocolo de atención con tiempos por contrato.' },
      { t: 'Equipo de respaldo', d: 'De características iguales o similares mientras reparamos.' },
      { t: 'Inventario de equipos', d: 'Registro de los datos técnicos de cada equipo.' },
      { t: 'Informes técnicos', d: 'Informe mensual y de cada mantenimiento preventivo.' },
      { t: 'Mesa de ayuda', d: 'Soporte telefónico para tus requerimientos.' },
      { t: 'Administrador de cuenta', d: 'Toda la información del servicio en una persona.' },
    ],
    caracteristicas: [
      'Computadoras, laptops, impresoras, multifuncionales y servidores.',
      'Repuestos originales.',
      'Visitas programadas o a demanda.',
    ],
    preguntas: [
      { p: '¿Atienden equipos que no compré con ustedes?', r: 'Sí. Hacemos mantenimiento a equipos de las principales marcas, independientemente de dónde se compraron.' },
      { p: '¿Cada cuánto se hace el preventivo?', r: 'Lo definimos contigo según el uso y la criticidad de cada equipo.' },
    ],
  },
  {
    id: 'digitalizacion',
    titulo: 'Digitalización de documentos',
    tituloCorto: 'Digitalización',
    icono: 'documento',
    resumen: 'Convertimos tu archivo físico en documentos digitales con búsqueda de texto (OCR) y gestión documental.',
    seo: {
      titulo: 'Digitalización de documentos con OCR | CLASTEC',
      descripcion: 'Escaneo masivo, OCR, indexación y gestión documental. En nuestras instalaciones o en las tuyas, con control de calidad.',
    },
    gancho: 'Encuentra cualquier documento en segundos.',
    intro: [
      'Tus clientes y usuarios esperan acceso inmediato a la información. Digitalizar el archivo físico es el primer paso de la transformación digital.',
      'Escaneamos con equipos de alta velocidad y OCR, organizamos los archivos como los necesitas y, si lo requieres, los integramos a tu ERP, CRM o a un gestor documental.',
    ],
    beneficios: [
      { t: 'Eficiencia operativa', d: 'Menos tiempo buscando papeles.' },
      { t: 'Ahorro de espacio', d: 'Reduce costos de almacenamiento físico.' },
      { t: 'Trabajo colaborativo', d: 'Comparte documentos fácilmente entre áreas y sedes.' },
      { t: 'Automatización', d: 'Captura de datos de facturas y otros documentos.' },
    ],
    incluye: [
      { t: 'Documentos de todo tipo', d: 'Libros, cuadernos, manuales y tesis, nuevos o antiguos.' },
      { t: 'Donde lo necesites', d: 'En nuestras instalaciones o en las tuyas.' },
      { t: 'OCR zonal o completo', d: 'Texto buscable en todo el documento o en campos clave.' },
      { t: 'Gestor documental', d: 'Software para organizar y consultar los archivos, si lo necesitas.' },
    ],
    caracteristicas: [
      'Equipos modernos de gran velocidad y excelente calidad de imagen.',
      'Personal especializado en gestión documental.',
      'Integración con CRM, ERP o gestor documental.',
    ],
    proceso: {
      titulo: 'Nuestro proceso de digitalización',
      pasos: [
        { t: 'Planificación', d: 'Revisamos contigo el volumen y los entregables.' },
        { t: 'Transporte y recepción', d: 'Recogemos los documentos con nuestra movilidad.' },
        { t: 'Preparación', d: 'Revisamos y preparamos cada documento con cuidado.' },
        { t: 'Escaneo', d: 'Digitalizamos con equipos de producción.' },
        { t: 'Conversión e indexación', d: 'OCR zonal o completo e índices de búsqueda.' },
        { t: 'Control de calidad', d: 'Todos los tamaños, formatos y en el orden correcto.' },
        { t: 'Entregables', d: 'Archivos organizados según lo que requieras.' },
        { t: 'Entrega', d: 'Devolvemos los originales e informe final.' },
      ],
    },
    preguntas: [
      { p: '¿Pueden digitalizar documentos deteriorados?', r: 'Sí. Trabajamos con documentos en distintos estados de conservación, incluidos antiguos y maltratados.' },
      { p: '¿Los documentos salen de mi empresa?', r: 'No es necesario: podemos hacer el proceso en tus instalaciones.' },
    ],
  },
  {
    id: 'mesa-de-ayuda',
    titulo: 'Mesa de ayuda de TI',
    tituloCorto: 'Mesa de ayuda',
    icono: 'auriculares',
    resumen: 'Soporte técnico remoto y presencial para tus usuarios, con tickets y reportes mensuales.',
    seo: {
      titulo: 'Mesa de ayuda de TI para empresas | CLASTEC',
      descripcion: 'Soporte remoto y presencial, gestión de incidencias con tickets y reportes mensuales. Ideal para empresas sin un área de TI propia.',
    },
    gancho: 'Tu área de TI, sin contratar un área de TI.',
    intro: [
      'Para empresas con recursos limitados, la mesa de ayuda es la forma más económica de tener soporte técnico profesional: pagas solo por el soporte que necesitas.',
      'Resolvemos incidencias rápido y mantenemos tus sistemas, equipos y dispositivos actualizados y protegidos, con un enfoque preventivo basado en buenas prácticas ITIL.',
    ],
    beneficios: [
      { t: 'Eficiencia operativa', d: 'Sistemas disponibles cuando tus usuarios los necesitan.' },
      { t: 'Ahorro en costos', d: 'Sin sueldos, beneficios ni capacitación de personal propio.' },
      { t: 'Experiencia técnica', d: 'Especialistas en diversas áreas de TI.' },
      { t: 'Escalable', d: 'Aumenta el nivel de soporte a medida que creces.' },
    ],
    incluye: [
      { t: 'Soporte remoto', d: 'Por chat, teléfono y correo, con acceso remoto al equipo.' },
      { t: 'Soporte presencial', d: 'Técnicos en tus instalaciones cuando se requiere.' },
      { t: 'Gestión de incidencias', d: 'Registro, priorización y seguimiento de tickets.' },
      { t: 'Mantenimiento correctivo', d: 'Para asegurar la operatividad de los equipos.' },
      { t: 'Problemas comunes', d: 'Correo, impresoras, red, accesos y software de oficina.' },
      { t: 'Reportes mensuales', d: 'Detalle de las incidencias atendidas y tiempos.' },
    ],
    caracteristicas: [
      'Primera atención remota para resolver más rápido y sin costo de traslado.',
      'Atención por niveles de soporte.',
      'Indicadores de servicio medibles.',
    ],
    preguntas: [
      { p: '¿Sirve para una empresa pequeña?', r: 'Sí. Está pensada especialmente para empresas que no tienen un área de TI propia.' },
      { p: '¿Cómo se reporta un problema?', r: 'Por chat, teléfono o correo. Cada reporte genera un ticket con seguimiento.' },
    ],
  },
] as const;

/** Tipos de equipos en alquiler (secciones de la página de alquiler). */
export const equiposAlquiler = [
  { id: 'laptops', t: 'Laptops y notebooks', d: 'Modelos recientes para equipos de trabajo, proyectos y capacitaciones.' },
  { id: 'pcs', t: 'PCs y computadoras', d: 'Estaciones de trabajo configuradas según tus aplicaciones.' },
  { id: 'impresoras', t: 'Impresoras y multifuncionales', d: 'Láser y LED, monocromáticas o a color, y matriciales. Con suministros.' },
  { id: 'escaneres', t: 'Escáneres', d: 'Departamentales y de producción para digitalización.' },
  { id: 'servidores', t: 'Servidores', d: 'Capacidad de procesamiento para proyectos y contingencias.' },
  { id: 'switches', t: 'Switches', d: 'Conectividad de red para sedes, oficinas temporales y eventos.' },
  { id: 'ups', t: 'UPS', d: 'Protección eléctrica para tus equipos críticos.' },
  { id: 'proyectores', t: 'Proyectores', d: 'Para presentaciones, capacitaciones y eventos.' },
] as const;

export const servicioPorId = (id: string) => servicios.find((s) => s.id === id);
