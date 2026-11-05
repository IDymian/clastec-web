import type { APIRoute } from 'astro';
import { CATEGORIAS, indice, fechaCaptura } from '../../lib/catalogo';

/** Índice estático del catálogo para la búsqueda en el navegador. */
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      capturado: fechaCaptura,
      categorias: CATEGORIAS.map((c) => c.nombre),
      productos: indice(),
    }),
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } },
  );
