import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      axios: '/workspace/dx-reports-client/src/FGDesign/utils/axiosStub.ts',
    },
  },
});
