import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import relay from "vite-plugin-relay";

export default defineConfig({
  plugins: [react(), relay],
  test: {
    environment: 'jsdom',
    setupFiles: 'src/__tests__/setup-relay-for-vitest.ts',
    include: ['src/__tests__/**/*.test.{ts,tsx}', 'src/__tests__/selenium/*.test.{ts,tsx}'],
    // Not needed anymore, since we are logging in with Chrome headless thus site definitely renders 
    // - possibly could just drop - didn't want to delete, if I'm missing something about it?
    exclude: ['src/__tests__/App.test.{ts,tsx}',
              'src/__tests__/selenium/auth.test.{ts,tsx}', 
              // Turned off / excluded are not ready
              'src/__tests__/**/area.test.{ts,tsx}',
              'src/__tests__/**/auth.test.{ts,tsx}',
              'src/__tests__/**/city.test.{ts,tsx}',
              'src/__tests__/**/individual.test.{ts,tsx}',
              'src/__tests__/**/position.test.{ts,tsx}',
              'src/__tests__/**/sightings.test.{ts,tsx}',
             ],
    globals: true,
    testTimeout: 120000,
    hookTimeout:120000,
  },
})
