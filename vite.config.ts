import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function customResolver() {
  const root = path.resolve(__dirname, '.');
  const possiblePaths = [
    
    'components/',
    'contexts/',
    'hooks/',
    'lib/',
    'services/',
    'components/lib/contexts/',
    ''
  ];

  return {
    name: 'custom-resolver',
    enforce: 'pre',
    resolveId(source, importer) {
      if (source.startsWith('.') && importer && !importer.includes('node_modules')) {
        const basename = path.basename(source);
        for (const p of possiblePaths) {
          const tryTsx = path.resolve(root, p + basename + '.tsx');
          if (fs.existsSync(tryTsx)) return tryTsx;
          const tryTs = path.resolve(root, p + basename + '.ts');
          if (fs.existsSync(tryTs)) return tryTs;
          const tryIndex = path.resolve(root, p + basename + '/index.tsx');
          if (fs.existsSync(tryIndex)) return tryIndex;
        }
      }
      return null;
    }
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const timestamp = Date.now();
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        watch: {
          usePolling: true,
        },
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
        }
      },
      plugins: [
        customResolver(),
        react(),
        tailwindcss(),
      ],
      esbuild: {
        jsx: 'automatic',
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        '__VITE_TIMESTAMP__': JSON.stringify(timestamp),
      },
      resolve: {
        alias: [
          { find: '@', replacement: path.resolve(__dirname, '.') },
        ],
        dedupe: ['react', 'react-dom'],
      }
    };
});
