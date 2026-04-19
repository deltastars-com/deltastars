import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // النقطة والسلاش تضمن أن المتجر يفتح في أي بيئة دون صفحات بيضاء
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // استخدام esbuild بدلاً من terser لضمان نجاح البناء من الهاتف وتجنب نقص المكتبات
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
