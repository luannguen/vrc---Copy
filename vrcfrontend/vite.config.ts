import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {  // Load environment variables based on mode
  const env = loadEnv(mode, process.cwd(), '');
    // Get configuration from environment variables with fallbacks
  // Environment variables used:
  // - VITE_API_URL: Backend base URL (default: http://localhost:3000)
  // - VITE_FRONTEND_PORT: Frontend development server port (default: 8081)
  const apiBaseUrl = env.VITE_API_URL || 'http://localhost:3000';
  const frontendPort = parseInt(env.VITE_FRONTEND_PORT || '8081');
    // Log configuration for debugging
  console.log('🔧 Vite Configuration:');
  console.log(`   Frontend Port: ${frontendPort}`);
  console.log(`   Backend Base URL: ${apiBaseUrl}`);
  console.log(`   Proxy Target: ${apiBaseUrl}`);
  console.log(`   Mode: ${mode}`);
  
  return {
    base: "/", // Use absolute paths from root
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test-setup.js',    },
    server: {
      host: "::",
      port: frontendPort,
      proxy: {
        // Cấu hình proxy cho các API request
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
          configure: (proxy: any, options: any) => {
            proxy.on('error', (err: any, req: any, res: any) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq: any, req: any, res: any) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes: any, req: any, res: any) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
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
