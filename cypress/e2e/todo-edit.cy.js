describe('Todo App - Edit Functionality', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should edit a todo text', () => {
    cy.addTodo('Original text')
    cy.todoShouldExist('Original text')
    
    cy.editTodo('Original text', 'Updated text')
    
    cy.todoShouldNotExist('Original text')
    cy.todoShouldExist('Updated text')
  })

  it('should show edit mode with input and buttons', () => {
    cy.addTodo('Test todo')
    
    cy.contains('.todo-item', 'Test todo').within(() => {
      cy.get('.edit-button').click()
    })
    
    // After clicking edit, check that edit mode is visible
    cy.contains('.todo-item', 'Test todo').within(() => {
      cy.get('.edit-input').should('be.visible')
      cy.get('.save-button').should('be.visible')
      cy.get('.cancel-button').should('be.visible')
    })
  })

  it('should cancel editing without saving changes', () => {
    cy.addTodo('Original todo')
    
    cy.contains('.todo-item', 'Original todo').within(() => {
      cy.get('.edit-button').click()
    })
    
    cy.get('.edit-input').clear().type('Modified text')
    cy.get('.cancel-button').click()
    
    cy.todoShouldExist('Original todo')
    cy.todoShouldNotExist('Modified text')
  })

  it('should edit todo categories', () => {
    cy.addTodo('Todo to edit', {
      priority: 'low',
      time: 'later',
      progress: 'not-started'
    })
    
    cy.contains('.todo-item', 'Todo to edit').within(() => {
      cy.get('.edit-button').click()
    })
    
    cy.get('#edit-priority-select').select('high')
    cy.get('#edit-time-select').select('today')
    cy.get('#edit-progress-select').select('in-progress')
    cy.get('.save-button').click()
    
    cy.contains('.todo-item', 'Todo to edit').within(() => {
      cy.contains('.category-badge', 'High').should('exist')
      cy.contains('.category-badge', 'Today').should('exist')
      cy.contains('.category-badge', 'In Progress').should('exist')
    })
  })

  it('should not save empty todo text when editing', () => {
    cy.addTodo('Valid todo')
    
    cy.contains('.todo-item', 'Valid todo').within(() => {
      cy.get('.edit-button').click()
    })
    
    cy.get('.edit-input').clear()
    cy.get('.save-button').click()
    
    // Should remain in edit mode with empty input
    cy.get('.edit-input').should('be.visible')
    cy.get('.save-button').should('be.visible')
    cy.get('.cancel-button').should('be.visible')
    
    // Cancel to exit edit mode
    cy.get('.cancel-button').click()
    
    // Todo should still exist with original text after canceling
    cy.todoShouldExist('Valid todo')
  })

  it('should edit multiple todos independently', () => {
    cy.addTodo('First todo')
    cy.addTodo('Second todo')
    cy.addTodo('Third todo')
    
    // Edit second todo
    cy.editTodo('Second todo', 'Modified second')
    
    // Verify all todos
    cy.todoShouldExist('First todo')
    cy.todoShouldExist('Modified second')
    cy.todoShouldExist('Third todo')
    cy.todoShouldNotExist('Second todo')
  })
})
