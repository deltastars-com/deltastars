import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // جرب تغيير هذه القيمة إلى '/' إذا لم تنجح './'
  base: '/', 
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    emptyOutDir: true,
  },
});
