import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // 상대 경로로 설정하여 GitHub Pages 및 어떤 호스팅 환경에서도 바로 동작
  server: {
    port: 3000,
    open: false,
  },
});
