import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/movie-browser/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../public/movie-browser',
    emptyOutDir: true,
    manifest: 'manifest.json',
    rollupOptions: { input: 'src/main.jsx' },
  },
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
});
