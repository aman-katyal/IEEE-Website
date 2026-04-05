import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'studio/**/*.{test,spec}.{ts,tsx}', 'src/*.test.ts'],
  },
  server: {
    fs: {
      allow: ['C:/Users/aman', 'C:/Users/Aman Katyal', '..']
    }
  }
});
