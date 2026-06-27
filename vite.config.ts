import { reactRouter } from '@react-router/dev/vite'
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [reactRouter(), svgr()],
})
