import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Single-file build (one HTML per page, everything inlined) – runs by double-click from a local folder.
const entry = process.env.ENTRY ?? 'index.html'
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist-single/' + entry.replace('.html', ''),
    emptyOutDir: true,
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 5000,
    rollupOptions: { input: entry, output: { inlineDynamicImports: true } },
  },
})
