import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     https: {
//       key: fs.readFileSync('./cert/key.pem'),
//       cert: fs.readFileSync('./cert/cert.pem'),
//     },
//     port: 5173,
//     host: 'localhost',
//   },
// });

// vite.config.ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173, // ou qualquer porta
    // https: { key: fs.readFileSync(...), cert: fs.readFileSync(...) } <- comente isso
  },
});

