import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // The codebase authors JSX inside .js files (Next.js style). Tell esbuild to
  // parse every .js under src as JSX, for both dev and production build.
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: false,
    // Allow the Emergent preview proxy host (and any host) to reach the dev server.
    allowedHosts: true,
    // HMR websocket travels through the https preview proxy on 443.
    hmr: {
      clientPort: 443,
      protocol: 'wss',
    },
    proxy: {
      // In dev, proxy API calls to the FastAPI backend.
      '/api': {
        target: process.env.VITE_API_TARGET || 'http://localhost:8009',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'build',
  },
})
