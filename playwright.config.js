const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'node app.js',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: true,
    timeout: 30000,
  },
});
