import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        tailwindcss(),
        react(),
    ],
    root: '.', // Ensure root is project root
    server: {
        open: true, // Auto open browser
        port: 5173
    }
});
