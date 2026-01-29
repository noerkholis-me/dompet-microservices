import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      watch: {
        usePolling: true,
      },
      hmr: {
        overlay: false,
        clientPort: 8080,
      },
      proxy: {
        '/api': {
          target: 'http://api-gateway:3000/api',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@contracts': path.resolve(__dirname, '../../libs/contracts/src'),
        'nestjs-zod': path.resolve(__dirname, './src/shims-nestjs.ts'),
        zod: path.resolve(__dirname, './node_modules/zod'),
      },
      dedupe: ['zod'],
    },
  };
});
