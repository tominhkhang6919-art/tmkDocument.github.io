import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Đường dẫn tương đối giúp chạy mượt mà trên cả localhost lẫn GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
