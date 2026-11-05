/**
 * Lista de cotización (varios productos en una sola solicitud).
 * Se guarda solo en el navegador del usuario (localStorage); no se envía a ningún servidor.
 */

export type ItemLista = { id: number; nombre: string; parte?: string; cantidad: number };

const CLAVE = 'clastec:lista-cotizacion';
export const LISTA_EVENTO = 'clastec:lista-cambio';
const MAX_ITEMS = 50;
const MAX_CANTIDAD = 999;

function esItem(x: unknown): x is ItemLista {
  if (typeof x !== 'object' || x === null) return false;
  const o = x as Record<string, unknown>;
  return typeof o['id'] === 'number' && typeof o['nombre'] === 'string' && typeof o['cantidad'] === 'number';
}

export function leerLista(): ItemLista[] {
  try {
    const datos: unknown = JSON.parse(localStorage.getItem(CLAVE) ?? '[]');
    return Array.isArray(datos) ? datos.filter(esItem).slice(0, MAX_ITEMS) : [];
  } catch {
    return [];
  }
}

function guardar(items: ItemLista[]): void {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch {
    /* almacenamiento lleno o bloqueado: la lista sigue en memoria para esta vista */
  }
  window.dispatchEvent(new CustomEvent(LISTA_EVENTO));
}

export function contarLista(): number {
  return leerLista().reduce((n, i) => n + i.cantidad, 0);
}

export function agregar(item: Omit<ItemLista, 'cantidad'>): void {
  const items = leerLista();
  const existente = items.find((i) => i.id === item.id);
  if (existente) existente.cantidad = Math.min(existente.cantidad + 1, MAX_CANTIDAD);
  else items.push({ ...item, nombre: item.nombre.slice(0, 200), cantidad: 1 });
  guardar(items);
}

export function cambiarCantidad(id: number, cantidad: number): void {
  const n = Math.max(1, Math.min(Math.floor(cantidad) || 1, MAX_CANTIDAD));
  guardar(leerLista().map((i) => (i.id === id ? { ...i, cantidad: n } : i)));
}

export function quitar(id: number): void {
  guardar(leerLista().filter((i) => i.id !== id));
}

export function vaciar(): void {
  guardar([]);
}

export function estaEnLista(id: number): boolean {
  return leerLista().some((i) => i.id === id);
}
