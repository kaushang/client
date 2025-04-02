import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    // tailwindcss(),
  ],
  server: {
    proxy: {
      // '/api': 'https://server-71hv.onrender.com'
      '/api': 'http://localhost:3000/'
    },
  },
})
