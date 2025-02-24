import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            // Disable babel which seems to be causing the issue
            babel: false
        })
    ],
    optimizeDeps: {
        esbuildOptions: {
            // Define global conditions to help avoid conflicts
            define: {
                global: 'globalThis'
            }
        }
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            },
        },
    },
})