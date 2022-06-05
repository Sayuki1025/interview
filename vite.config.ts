import vue from '@vitejs/plugin-vue'
import { resolve } from "path"
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: {
    // 配置别名
    alias: {
      "@": resolve(__dirname, "src")
    },
    extensions: [".js", ".json", ".ts", ".vue"]
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/global.scss";`
      }
    }
  }

})
