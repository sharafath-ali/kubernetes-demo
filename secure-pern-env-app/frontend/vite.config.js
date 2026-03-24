import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'log-external-port',
      configureServer(server) {
        server.httpServer?.once('listening', () => {
          if (process.env.FRONTEND_EXTERNAL_PORT) {
            setTimeout(() => {
              console.log(`\n  ➜  External (Browser): \x1b[36mhttp://localhost:${process.env.FRONTEND_EXTERNAL_PORT}/\x1b[0m\n`);
            }, 50);
          }
        });
      }
    }
  ],
})
