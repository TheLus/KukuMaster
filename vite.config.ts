import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vike from 'vike/plugin';
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), vike({prerender: true})],
  base: '/KukuMaster/dist/client/',
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, "./src") }]
  }
});
