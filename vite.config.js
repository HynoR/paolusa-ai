import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router'],
          'lodash': ['lodash-es'],
        }
      }
    },
    chunkSizeWarningLimit: 1600,
  },

  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "element-plus/theme-chalk/src/index.scss" as *;`
      }
    }
  }
})
