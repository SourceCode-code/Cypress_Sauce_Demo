// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
///<reference types="cypress"/>
//handle alert 
Cypress.on('window:alert', (alertText) => {
  Cypress.log({
    name: 'window:alert',
    message: alertText
  });
});

const grep = Cypress.env('grep'); // get --env grep value

before(function() {
  if (grep) {
    cy.log(`Filtering tests by tag: ${grep}`);
  }
});

beforeEach(function() {
  if (grep) {
    const testTitle = Cypress.currentTest.title;
    if (!testTitle.includes(grep)) {
      this.skip();
    }
  }
});

