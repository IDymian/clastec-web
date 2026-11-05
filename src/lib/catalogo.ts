/**
 * Catálogo (tiempo de build): lee data/snapshot/catalogo.json y genera un índice compacto
 * para la búsqueda en el navegador. Sin precios ni carrito: todo termina en una cotización.
 */
import snapshot from '../../data/snapshot/catalogo.json';

type ProductoSnapshot = {
  id: number;
  nombre: string;
  slug: string;
  categoria: string;
  sku?: string;
  marca?: string;
  modelo?: string;
  familia?: string;
  color?: string;
  funcion?: string;
  caracteristicas: string[];
  imagen?: string;
};

/** Nombres que entiende un jefe de compras (el sitio actual usa "Laptops/Notebooks/Portátiles"). */
export const CATEGORIAS = [
  { slug: 'multifuncionales-impresoras', nombre: 'Impresoras y multifuncionales', grupo: 'Equipos' },
  { slug: 'laptops-notebooks-portatiles', nombre: 'Laptops', grupo: 'Equipos' },
  { slug: 'escaneres', nombre: 'Escáneres', grupo: 'Equipos' },
  { slug: 'impresoras-de-etiquetas', nombre: 'Impresoras de etiquetas', grupo: 'Equipos' },
  { slug: 'suministros', nombre: 'Suministros (tóner, drum, developer)', grupo: 'Repuestos y suministros' },
  { slug: 'repuestos', nombre: 'Repuestos', grupo: 'Repuestos y suministros' },
] as const;

/** Elemento del índice. Claves cortas para reducir el tamaño del JSON. */
export type ItemIndice = {
  i: number; // id
  n: string; // nombre
  c: number; // índice de categoría en CATEGORIAS
  m?: string; // marca
  p?: string; // número de parte
  f?: string[]; // características (solo equipos)
  img?: string; // ruta de imagen relativa a /wp-content/uploads/
};

const productos = (snapshot as { productos: ProductoSnapshot[] }).productos;
export const fechaCaptura = (snapshot as { capturado: string }).capturado;

const MARCAS: Record<string, string> = { Fujitzu: 'Fujitsu', Macbook: 'Apple' };

function numeroParte(p: ProductoSnapshot): string | undefined {
  const desdeCaracteristica = p.caracteristicas
    .find((c) => /^n[uú]mero de parte:/i.test(c))
    ?.split(':')[1]
    ?.trim();
  return p.sku || desdeCaracteristica || undefined;
}

/** Para repuestos y suministros el nombre trae "para las impresoras modelos: …"; lo acortamos. */
function nombreCorto(p: ProductoSnapshot): string {
  const corte = p.nombre.split(/ para (las|los|la|el) (impresoras?|equipos?) modelos?:/i)[0] ?? p.nombre;
  return corte.length > 120 ? `${corte.slice(0, 117)}…` : corte;
}

export function indice(): ItemIndice[] {
  return productos
    .map((p): ItemIndice | null => {
      const c = CATEGORIAS.findIndex((cat) => cat.slug === p.categoria);
      if (c < 0) return null;
      const esEquipo = CATEGORIAS[c]?.grupo === 'Equipos';
      const item: ItemIndice = { i: p.id, n: nombreCorto(p), c };
      const marca = p.marca ? (MARCAS[p.marca] ?? p.marca) : undefined;
      if (marca) item.m = marca;
      const parte = numeroParte(p);
      if (parte) item.p = parte;
      if (esEquipo) {
        const f = p.caracteristicas.filter((x) => !/^(tipo|condici[oó]n|marca de la impresora):/i.test(x)).slice(0, 4);
        if (f.length) item.f = f;
      } else if (p.modelo) {
        item.f = [`Compatible: ${p.modelo.length > 90 ? `${p.modelo.slice(0, 87)}…` : p.modelo}`];
      }
      const img = p.imagen?.split('/wp-content/uploads/')[1];
      if (img) item.img = img;
      return item;
    })
    .filter((x): x is ItemIndice => x !== null)
    .sort((a, b) => a.c - b.c || a.n.localeCompare(b.n, 'es'));
}

export function conteoPorCategoria(): { slug: string; nombre: string; grupo: string; cantidad: number }[] {
  const idx = indice();
  return CATEGORIAS.map((cat, c) => ({ ...cat, cantidad: idx.filter((p) => p.c === c).length }));
}

export function marcas(): string[] {
  return [...new Set(indice().map((p) => p.m).filter((m): m is string => Boolean(m)))].sort((a, b) => a.localeCompare(b, 'es'));
}

export function destacados(limite = 8): ItemIndice[] {
  return indice()
    .filter((p) => p.c <= 1 && p.img && p.m && ['Xerox', 'HP', 'Lenovo', 'Epson'].includes(p.m))
    .slice(0, limite);
}
