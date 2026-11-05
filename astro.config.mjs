// @ts-check
import { defineConfig } from 'astro/config';
import process from 'node:process';
import tailwindcss from '@tailwindcss/vite';

// Prototipo: el dominio real se configura con la variable SITE_URL al desplegar.
export default defineConfig({
  site: process.env.SITE_URL ?? 'http://localhost:4321',
  output: 'static',
  trailingSlash: 'ignore',
  // Sin scripts ni estilos en línea: permite una CSP estricta (script-src 'self').
  build: { inlineStylesheets: 'never' },
  vite: {
    plugins: [tailwindcss()],
    build: { assetsInlineLimit: 0 },
  },
});
