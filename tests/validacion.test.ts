import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  armarMensaje,
  esCorreo,
  esRucValido,
  esTelefonoPeruano,
  limpiar,
  validarCotizacion,
  type Cotizacion,
} from '../src/lib/validacion.ts';

const valida: Cotizacion = {
  nombre: 'Ana Pérez',
  empresa: 'Empresa S.A.C.',
  contacto: 'ana@empresa.com',
  servicio: 'Mantenimiento',
  mensaje: '',
  consentimiento: true,
};

test('RUC: acepta un RUC con dígito verificador correcto', () => {
  assert.equal(esRucValido('20508161418'), true);
});

test('RUC: rechaza longitud, prefijo o verificador incorrectos', () => {
  assert.equal(esRucValido('2050816141'), false);
  assert.equal(esRucValido('30508161418'), false);
  assert.equal(esRucValido('20508161419'), false);
});

test('teléfono: acepta celular y fijo peruanos', () => {
  for (const t of ['987654321', '+51 987 654 321', '(01) 4251234', '4251234']) {
    assert.equal(esTelefonoPeruano(t), true, t);
  }
  for (const t of ['12345', '887654321', '98765432']) {
    assert.equal(esTelefonoPeruano(t), false, t);
  }
});

test('correo: formato básico', () => {
  assert.equal(esCorreo('ventas@clastec.com'), true);
  assert.equal(esCorreo('ventas@clastec'), false);
});

test('formulario vacío no pasa la validación', () => {
  const e = validarCotizacion({ nombre: '', empresa: '', contacto: '', servicio: '', mensaje: '', consentimiento: false });
  assert.deepEqual(Object.keys(e).sort(), ['consentimiento', 'contacto', 'empresa', 'nombre', 'servicio']);
});

test('formulario válido no tiene errores', () => {
  assert.deepEqual(validarCotizacion(valida), {});
});

test('consentimiento es obligatorio', () => {
  assert.ok(validarCotizacion({ ...valida, consentimiento: false }).consentimiento);
});

test('si la empresa es numérica, se valida como RUC', () => {
  assert.ok(validarCotizacion({ ...valida, empresa: '12345678901' }).empresa);
  assert.equal(validarCotizacion({ ...valida, empresa: '20508161418' }).empresa, undefined);
});

test('respeta los límites de longitud', () => {
  assert.ok(validarCotizacion({ ...valida, mensaje: 'x'.repeat(1001) }).mensaje);
});

test('limpiar elimina caracteres de control y espacios extra', () => {
  assert.equal(limpiar('  hola\u0000\n  mundo '), 'hola mundo');
});

test('el mensaje omite el detalle si está vacío', () => {
  assert.doesNotMatch(armarMensaje(valida), /Detalle/);
  assert.match(armarMensaje({ ...valida, mensaje: 'Urgente' }), /Detalle: Urgente/);
});
