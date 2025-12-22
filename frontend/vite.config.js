import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({ mode }) => {
  // 👇 load .env from one folder above the frontend directory
  const env = loadEnv(mode, path.resolve(__dirname, '../'), '')

  return {
    plugins: [react(), tailwindcss()],
    css: { lightningcss: false },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      // optional: expose environment variables if needed
      'process.env': env
    }
  }
})
