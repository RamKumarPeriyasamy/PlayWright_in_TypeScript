import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  use: {
    baseURL: 'http://185.100.212.76:9940',
    headless: !!process.env.CI, // Headless only in CI
    screenshot: 'only-on-failure',
    trace: 'on-first-retry'
  }
});
