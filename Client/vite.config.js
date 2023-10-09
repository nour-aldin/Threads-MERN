import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // HANDEL CORS ERRORS
    proxy: {
      "/api": {
        target: "https://threads-server.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
