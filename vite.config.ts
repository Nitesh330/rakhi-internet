import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('pdf-lib') || id.includes('jspdf') || id.includes('cryptpdf')) {
                return 'pdf-utils';
              }
              if (id.includes('xlsx') || id.includes('mammoth') || id.includes('pptxgenjs')) {
                return 'office-utils';
              }
              if (id.includes('@imgly/background-removal') || id.includes('onnxruntime')) {
                return 'img-utils';
              }
              if (id.includes('lucide-react')) {
                return 'icons';
              }
              return 'vendor';
            }
          }
        }
      }
    },
    server: {
      hmr: false,
      watch: null,
      allowedHosts: true,
    },
  };
});
