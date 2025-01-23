import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  optimizeDeps: {
    include: ['lucide-react'],
  },
  server: {
    headers: {
      'Content-Security-Policy': `
        default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: blob: https:;
        connect-src 'self' https: wss:;
      `.replace(/\s+/g, ' ').trim()
    }
  },
});
