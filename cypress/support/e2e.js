// Import Cypress code coverage plugin
import '@cypress/code-coverage/support'

// Import custom commands
import './commands'

// Custom commands can be added here
// Example: Cypress.Commands.add('login', (email, password) => { ... })

// Prevent Cypress from failing tests on uncaught exceptions
Cypress.on('uncaught:exception', () => {
  // returning false here prevents Cypress from failing the test
  return false
})
