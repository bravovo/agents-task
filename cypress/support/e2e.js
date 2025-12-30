// Import Cypress code coverage plugin
import '@cypress/code-coverage/support'

// Import custom commands
import './commands'

// Custom commands can be added here
// Example: Cypress.Commands.add('login', (email, password) => { ... })

// Prevent Cypress from failing tests on uncaught exceptions
// Note: This is a broad exception handler. In production tests, consider
// being more selective or at least logging exceptions for debugging.
Cypress.on('uncaught:exception', (err) => {
  // Log the error for debugging purposes
  console.error('Uncaught exception:', err.message)
  // Returning false prevents Cypress from failing the test
  // Consider being more selective in production (e.g., ignore only specific errors)
  return false
})
