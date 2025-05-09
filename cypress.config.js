const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: "mochawesome",
  pageLoadTimeout: 40000,
  defaultCommandTimeout: 20000,
  execTimeout: 20000,
  viewportHeight: 1080,
  viewportWidth: 1920,
  waitForAnimations: true,
  redirectionLimit: 40,
  video: false,
  reporterOptions: {
    reportDir: "./cypress/results",
    reportFilename: "[status]_[datetime]-[name]",
    overwrite: true,
    html: false,
    json: true
  },
  chromeWebSecurity: false,
  env: {
    baseURL: "https://www.saucedemo.com/",
  },
  retries: {
    // Configure retry attempts for `cypress run`
    // Default is 0
    runMode: 1,
    // Configure retry attempts for `cypress open`
    // Default is 0
    openMode: 0,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      on('task', {})
    },
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },

});