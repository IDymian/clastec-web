/**
 * Validaciones del formulario de cotización. Sin dependencias, para poder probarlas con `node --test`.
 */

export type Cotizacion = {
  nombre: string;
  empresa: string;
  contacto: string;
  servicio: string;
  mensaje: string;
  consentimiento: boolean;
};

export type Errores = Partial<Record<keyof Cotizacion, string>>;

const LIMITES = { nombre: 80, empresa: 120, contacto: 80, servicio: 80, mensaje: 1000 } as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** RUC peruano: 11 dígitos, prefijo válido y dígito verificador (módulo 11). */
export function esRucValido(valor: string): boolean {
  if (!/^(10|15|16|17|20)\d{9}$/.test(valor)) return false;
  const pesos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const suma = pesos.reduce((acc, p, i) => acc + p * Number(valor[i]), 0);
  const dv = (11 - (suma % 11)) % 10;
  return dv === Number(valor[10]);
}

/** Celular peruano (9 dígitos que empiezan en 9) o fijo de Lima (7 dígitos, opcionalmente con 01). */
export function esTelefonoPeruano(valor: string): boolean {
  const limpio = valor.replace(/[\s()-]/g, '').replace(/^\+?51/, '');
  return /^9\d{8}$/.test(limpio) || /^(01)?[2-7]\d{6}$/.test(limpio) || /^0[4-8]\d{6,7}$/.test(limpio);
}

export function esCorreo(valor: string): boolean {
  return EMAIL.test(valor);
}

/** Quita espacios sobrantes y caracteres de control. */
export function limpiar(valor: string): string {
  // eslint-disable-next-line no-control-regex
  return valor.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function validarCotizacion(c: Cotizacion): Errores {
  const e: Errores = {};

  if (c.nombre.length < 2) e.nombre = 'Escribe tu nombre (mínimo 2 caracteres).';

  if (c.empresa.length < 2) {
    e.empresa = 'Escribe el nombre de tu empresa o entidad, o su RUC.';
  } else if (/^\d+$/.test(c.empresa) && !esRucValido(c.empresa)) {
    e.empresa = 'El RUC debe tener 11 dígitos válidos (por ejemplo, 20XXXXXXXXX).';
  }

  if (!c.contacto) {
    e.contacto = 'Déjanos un correo o un teléfono para responderte.';
  } else if (!esCorreo(c.contacto) && !esTelefonoPeruano(c.contacto)) {
    e.contacto = 'Revisa el dato: usa un correo (nombre@empresa.com) o un teléfono de 9 dígitos.';
  }

  if (!c.servicio) e.servicio = 'Elige el servicio que te interesa.';

  if (!c.consentimiento) e.consentimiento = 'Necesitamos tu autorización para usar tus datos y responderte.';

  for (const campo of Object.keys(LIMITES) as (keyof typeof LIMITES)[]) {
    if (c[campo].length > LIMITES[campo] && !e[campo]) {
      e[campo] = `Máximo ${LIMITES[campo]} caracteres.`;
    }
  }

  return e;
}

export type ProductoMensaje = { nombre: string; parte?: string; cantidad: number };

export function armarMensaje(c: Cotizacion, productos: readonly ProductoMensaje[] = []): string {
  const lineasProductos = productos.length
    ? ['Productos:', ...productos.map((p) => `- ${p.cantidad} × ${p.nombre}${p.parte ? ` (N.° de parte ${p.parte})` : ''}`)]
    : [];
  return [
    'Hola CLASTEC, quisiera una cotización.',
    `Nombre: ${c.nombre}`,
    `Empresa / RUC: ${c.empresa}`,
    `Contacto: ${c.contacto}`,
    `Servicio: ${c.servicio}`,
    ...lineasProductos,
    c.mensaje ? `Detalle: ${c.mensaje}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}
