import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['lucide-react'],
  },
  server: {
    headers: {
      'Content-Security-Policy': `
        default-src 'self' http://localhost:* https://localhost:*;
        script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* https://localhost:*;
        style-src 'self' 'unsafe-inline' http://localhost:* https://localhost:*;
        img-src 'self' data: blob: http://localhost:* https://localhost:*;
        font-src 'self' data: http://localhost:* https://localhost:*;
        connect-src 'self' http://localhost:* https://localhost:*;
        media-src 'self' http://localhost:* https://localhost:*;
        worker-src 'self' blob: http://localhost:* https://localhost:*;
        frame-src 'self' http://localhost:* https://localhost:*;
        object-src 'none';
      `.replace(/\s+/g, ' ').trim(),
      'X-Content-Security-Policy': 'sandbox allow-scripts allow-same-origin allow-forms',
      'X-Frame-Options': 'SAMEORIGIN',
      // Chrome-specific headers
      'X-Chrome-Extension-Policy': 'block',
      'X-Webkit-CSP': 'default-src * \'unsafe-inline\' \'unsafe-eval\'; script-src * \'unsafe-inline\' \'unsafe-eval\'; object-src \'none\';'
    }
  },
});
