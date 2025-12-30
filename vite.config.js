import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import istanbul from 'vite-plugin-istanbul'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    istanbul({
      include: 'src/**/*.{js,jsx}',
      exclude: ['node_modules', 'cypress', 'coverage', '**/*.test.jsx', '**/*.test.js', '**/*.e2e.test.jsx', 'src/main.jsx', 'src/setupTests.js'],
      extension: ['.js', '.jsx'],
      requireEnv: false,
    }),
  ],
  build: {
    sourcemap: true,
  },
})

