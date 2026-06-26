const { defineConfig } = require('vite');
const tailwindcss = require('@tailwindcss/vite').default;
const { resolve } = require('path');

module.exports = defineConfig({
  base: '/eastman/',
  plugins: [tailwindcss()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        numbers: resolve(__dirname, 'eapl-in-numbers.html'),
        history: resolve(__dirname, 'corporate-history.html'),
      },
    },
  },
  server: {
    port: 5173,
  },
});
