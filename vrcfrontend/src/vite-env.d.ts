/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_PUBLIC_API_KEY: string;
  // Thêm các biến môi trường khác nếu cần
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
