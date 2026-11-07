import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the build also works from any sub-path / static hosting.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      input: { main: 'index.html', masterplan: 'masterplan.html' },
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
})
