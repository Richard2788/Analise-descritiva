import { defineConfig } from 'vite';

/**
 * Vite config — Node 24 + GitHub Pages
 *
 * Se o site for publicado em https://USER.github.io/REPO/
 * defina base: '/REPO/'
 * Se for em https://USER.github.io/ (root), use base: '/'
 */
export default defineConfig({
  // Altere para '/nome-do-repositorio/' se o Pages não estiver na raiz
  base: './',
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    target: 'es2022',
  },
  server: {
    port: 5173,
    open: false,
  },
});
