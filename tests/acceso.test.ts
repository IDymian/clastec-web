import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verificarAcceso } from '../middleware.ts';

const USUARIO = 'clastec';
const CLAVE = 'una-clave-de-prueba-larga';
const basic = (u: string, c: string) => `Basic ${btoa(`${u}:${c}`)}`;

test('acceso: credenciales correctas permiten entrar', () => {
  assert.equal(verificarAcceso(basic(USUARIO, CLAVE), USUARIO, CLAVE), 'permitido');
});

test('acceso: credenciales incorrectas o ausentes se rechazan', () => {
  assert.equal(verificarAcceso(basic(USUARIO, 'otra'), USUARIO, CLAVE), 'denegado');
  assert.equal(verificarAcceso(basic('otro', CLAVE), USUARIO, CLAVE), 'denegado');
  assert.equal(verificarAcceso(null, USUARIO, CLAVE), 'denegado');
  assert.equal(verificarAcceso('Bearer abc', USUARIO, CLAVE), 'denegado');
  assert.equal(verificarAcceso('Basic %%%no-base64', USUARIO, CLAVE), 'denegado');
  assert.equal(verificarAcceso(`Basic ${btoa('sin-dos-puntos')}`, USUARIO, CLAVE), 'denegado');
});

test('acceso: falla cerrado si no hay configuración o la clave es corta', () => {
  assert.equal(verificarAcceso(basic(USUARIO, CLAVE), undefined, undefined), 'sin-configurar');
  assert.equal(verificarAcceso(basic(USUARIO, 'corta'), USUARIO, 'corta'), 'sin-configurar');
});

test('acceso: la contraseña puede contener dos puntos', () => {
  const clave = 'clave:con:dos:puntos';
  assert.equal(verificarAcceso(basic(USUARIO, clave), USUARIO, clave), 'permitido');
});
