// Use dynamic import for ESM modules
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(async () => {
  // Dynamically import the ESM module
  const tailwindcss = await import('@tailwindcss/vite').then(m => m.default);

  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    server: {
      port: 5173
    }
  };
});