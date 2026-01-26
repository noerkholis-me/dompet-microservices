import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      hmr: {
        overlay: false,
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
      },
    },
  };
});
