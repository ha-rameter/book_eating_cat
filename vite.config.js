import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/books': 'http://localhost:3000',
      '/api': 'http://localhost:3000',
    },
    // json-server가 db.json을 고칠 때 화면이 새로고침되지 않도록 감시에서 제외
    watch: {
      ignored: ['**/db.json'],
    },
  },
});
