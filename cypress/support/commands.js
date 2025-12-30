// Custom Cypress commands for Todo app

/**
 * Add a new todo with specified text and categories
 */
Cypress.Commands.add('addTodo', (text, categories = {}) => {
  cy.get('.todo-input').type(text)
  
  if (categories.priority) {
    cy.get('#priority-select').select(categories.priority)
  }
  if (categories.time) {
    cy.get('#time-select').select(categories.time)
  }
  if (categories.progress) {
    cy.get('#progress-select').select(categories.progress)
  }
  
  cy.get('.submit-button').click()
})

/**
 * Check if a todo with specified text exists
 */
Cypress.Commands.add('todoShouldExist', (text) => {
  cy.contains('.todo-text', text).should('exist')
})

/**
 * Check if a todo with specified text does not exist
 */
Cypress.Commands.add('todoShouldNotExist', (text) => {
  cy.contains('.todo-text', text).should('not.exist')
})

/**
 * Complete a todo by its text
 */
Cypress.Commands.add('completeTodo', (text) => {
  cy.contains('.todo-item', text).within(() => {
    cy.get('.complete-button').click()
  })
})

/**
 * Delete a todo by its text
 */
Cypress.Commands.add('deleteTodo', (text) => {
  cy.contains('.todo-item', text).within(() => {
    cy.get('.delete-button').click()
  })
})

/**
 * Edit a todo by its text
 */
Cypress.Commands.add('editTodo', (oldText, newText) => {
  cy.contains('.todo-item', oldText).within(() => {
    cy.get('.edit-button').click()
  })
  cy.get('.edit-input').clear().type(newText)
  cy.get('.save-button').click()
})

/**
 * Switch to archive view
 */
Cypress.Commands.add('goToArchive', () => {
  cy.contains('.toggle-button', 'Archive').click()
})

/**
 * Switch to active todos view
 */
Cypress.Commands.add('goToActiveTodos', () => {
  cy.contains('.toggle-button', 'Active Todos').click()
})
