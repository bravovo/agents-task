// Import Cypress code coverage plugin
import '@cypress/code-coverage/support'

// Import React and mount command
import { mount } from 'cypress/react18'
import '../../src/index.css'
import '../../src/App.css'

// Custom mount command
Cypress.Commands.add('mount', mount)

// Prevent Cypress from failing tests on uncaught exceptions
Cypress.on('uncaught:exception', (err) => {
  // Log the error for debugging purposes
  console.error('Uncaught exception:', err.message)
  // Returning false prevents Cypress from failing the test
  return false
})
