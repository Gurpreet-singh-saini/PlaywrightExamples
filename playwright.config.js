// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Allure Reporter
  reporter: [
    ['line'],
    ['allure-playwright']
  ],

  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chrome',
      use: {
        browserName: 'chromium',
        headless: false,

        viewport: null, // let browser maximize based on window size

        // Combined launchOptions (correct way)
        launchOptions: {
          args: ['--start-maximized'], // maximize window
          slowMo: 500,                 // slow down actions
        },

        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
  ],
});
