import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry'
  }
});
