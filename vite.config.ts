import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: 'https://volohavlad.github.io/class-component-task/',
  plugins: [react(), tailwindcss()],
});
