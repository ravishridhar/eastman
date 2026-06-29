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
        leadership: resolve(__dirname, 'leadership.html'),
        governance: resolve(__dirname, 'corporate-governance.html'),
        policies: resolve(__dirname, 'policies.html'),
        disclosures: resolve(__dirname, 'disclosures.html'),
      },
    },
  },
  server: {
    port: 5173,
  },
});
