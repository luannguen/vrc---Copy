import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const apiUrl = process.env.VITE_API_URL || 'http://localhost:3000/api';
  const apiBaseUrl = apiUrl.replace('/api', ''); // Remove /api suffix for proxy target
  
  return {
    base: "/", // Use absolute paths from root
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test-setup.js',
    },
    server: {
      host: "::",
      port: 8080,      proxy: {
        // Cấu hình proxy cho các API request sử dụng biến môi trường
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) => path
        }
      },
      hmr: {
        overlay: true,
      },
    },
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false,
      minify: true,
      chunkSizeWarningLimit: 1500,
    },
  };
});
