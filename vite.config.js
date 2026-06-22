const { defineConfig } = require('vite');
const tailwindcss = require('@tailwindcss/vite').default;

module.exports = defineConfig({
  plugins: [tailwindcss()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
});
