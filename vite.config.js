import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    https: false,
    // 是否自动在浏览器打开
    open: true,
    cors: true,
    proxy: {
      '/sonarcloud': {
        target: 'https://sonarcloud.io',    // 接口域名,接口服务器地止
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/sonarcloud/, '')
      },
      '/openai': {
        target: 'https://mapi.fduer.com/api/v1/',    // 接口域名,接口服务器地止
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/openai/, '')
      },
    }
  }
})