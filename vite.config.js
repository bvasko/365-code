import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/365-code/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        agentSkills: resolve(__dirname, 'agent-skills.html'),
      },
    },
  },
})
