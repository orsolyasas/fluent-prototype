import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/fluent-prototype/',
  plugins: [react()],
  server: {
    allowedHosts: true,
    host: true,
  },
})
