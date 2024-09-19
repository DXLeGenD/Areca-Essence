import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://areca-essence-back-end.vercel.app/",
        changeOrigin: true
      }
    }
  }
})
