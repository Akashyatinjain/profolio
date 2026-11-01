import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/tuf': {
        target: 'https://backend-go.takeuforward.org',
        changeOrigin: true,
        rewrite: (path) => {
          if (path.includes('endpoint=progress')) {
            return '/api/v1/progress/dsa/Akashyatinjain';
          }
          if (path.includes('endpoint=heatmap')) {
            const yr = new Date().getFullYear();
            return `/api/v1/streak/heatmap/Akashyatinjain?year=${yr}`;
          }
          return path.replace(/^\/api\/tuf/, '/api/v1');
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'https://takeuforward.org');
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
          });
        }
      }
    }
  }
})

