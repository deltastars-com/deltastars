import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // النقطة والسلاش تضمن أن المتصفح يجد ملفات الـ CSS والـ JS في أي بيئة استضافة
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // تحسين البناء لتقليل حجم الملفات وزيادة السرعة
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
