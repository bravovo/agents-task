// ***********************************************************
// Cypress support file
// This file is processed and loaded automatically before your test files.
// ***********************************************************

// Import code coverage support
import '@cypress/code-coverage/support'

// Import commands.js (currently empty, but can be used for custom commands)
import './commands'

// Clear localStorage before each test
beforeEach(() => {
  cy.window().then((win) => {
    win.localStorage.clear()
  })
})

