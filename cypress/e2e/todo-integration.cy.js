describe('Todo App - Integration Workflow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should complete a full todo workflow', () => {
    // Add a todo
    cy.addTodo('Complete project milestone', {
      priority: 'high',
      time: 'today',
      progress: 'not-started'
    })
    
    cy.todoShouldExist('Complete project milestone')
    
    // Edit the todo
    cy.editTodo('Complete project milestone', 'Complete project milestone v1.0')
    cy.todoShouldExist('Complete project milestone v1.0')
    
    // Update progress
    cy.contains('.todo-item', 'Complete project milestone v1.0').within(() => {
      cy.get('.edit-button').click()
    })
    cy.get('#edit-progress-select').select('in-progress')
    cy.get('.save-button').click()
    
    // Complete the todo
    cy.completeTodo('Complete project milestone v1.0')
    
    // Verify in archive
    cy.goToArchive()
    cy.todoShouldExist('Complete project milestone v1.0')
    
    // Restore and verify
    cy.contains('.todo-item', 'Complete project milestone v1.0').within(() => {
      cy.get('.restore-button').click()
    })
    
    cy.goToActiveTodos()
    cy.todoShouldExist('Complete project milestone v1.0')
  })

  it('should manage multiple todos with different workflows', () => {
    // Add multiple todos
    cy.addTodo('Task 1 - High priority', { priority: 'high' })
    cy.addTodo('Task 2 - Medium priority', { priority: 'medium' })
    cy.addTodo('Task 3 - Low priority', { priority: 'low' })
    
    // Complete one
    cy.completeTodo('Task 2 - Medium priority')
    
    // Delete one
    cy.deleteTodo('Task 3 - Low priority')
    
    // Edit remaining
    cy.editTodo('Task 1 - High priority', 'Task 1 - Updated')
    
    // Verify state
    cy.get('.todo-item').should('have.length', 1)
    cy.todoShouldExist('Task 1 - Updated')
    
    cy.goToArchive()
    cy.get('.todo-item').should('have.length', 1)
    cy.todoShouldExist('Task 2 - Medium priority')
  })

  it('should handle search and filter with active operations', () => {
    // Add todos
    cy.addTodo('Development task', { priority: 'high', progress: 'in-progress' })
    cy.addTodo('Testing task', { priority: 'medium', progress: 'not-started' })
    cy.addTodo('Documentation task', { priority: 'low', progress: 'blocked' })
    
    // Filter by priority
    cy.get('#filter-priority').select('high')
    cy.get('.todo-item').should('have.length', 1)
    
    // Edit while filtered
    cy.editTodo('Development task', 'Dev task updated')
    
    // Clear filter and verify
    cy.get('#filter-priority').select('all')
    cy.get('.todo-item').should('have.length', 3)
    cy.todoShouldExist('Dev task updated')
    
    // Search and complete
    cy.get('.search-input').type('Testing')
    cy.completeTodo('Testing task')
    
    // Verify search results updated
    cy.get('.todo-item').should('have.length', 0)
  })

  it('should maintain data integrity across view switches', () => {
    // Add and complete todos
    cy.addTodo('Active todo 1')
    cy.addTodo('Active todo 2')
    cy.addTodo('To be completed')
    
    cy.completeTodo('To be completed')
    
    // Verify active view
    cy.get('.todo-item').should('have.length', 2)
    cy.contains('.toggle-button', 'Active Todos (2)').should('exist')
    cy.contains('.toggle-button', 'Archive (1)').should('exist')
    
    // Switch to archive
    cy.goToArchive()
    cy.get('.todo-item').should('have.length', 1)
    cy.todoShouldExist('To be completed')
    
    // Switch back to active
    cy.goToActiveTodos()
    cy.get('.todo-item').should('have.length', 2)
    cy.todoShouldExist('Active todo 1')
    cy.todoShouldExist('Active todo 2')
  })

  it('should handle rapid successive operations', () => {
    // Rapidly add multiple todos
    cy.addTodo('Todo 1')
    cy.addTodo('Todo 2')
    cy.addTodo('Todo 3')
    cy.addTodo('Todo 4')
    cy.addTodo('Todo 5')
    
    cy.get('.todo-item').should('have.length', 5)
    
    // Rapidly complete some todos
    cy.completeTodo('Todo 1')
    cy.completeTodo('Todo 3')
    cy.completeTodo('Todo 5')
    
    cy.get('.todo-item').should('have.length', 2)
    cy.contains('.toggle-button', 'Archive (3)').should('exist')
    
    // Verify all completed todos in archive
    cy.goToArchive()
    cy.get('.todo-item').should('have.length', 3)
    cy.todoShouldExist('Todo 1')
    cy.todoShouldExist('Todo 3')
    cy.todoShouldExist('Todo 5')
  })

  it('should persist operations after theme toggle', () => {
    cy.addTodo('Test todo')
    
    // Toggle theme
    cy.get('.theme-toggle').click()
    cy.get('.app').should('have.class', 'dark')
    
    // Add more todos in dark mode
    cy.addTodo('Dark mode todo')
    cy.get('.todo-item').should('have.length', 2)
    
    // Complete in dark mode
    cy.completeTodo('Test todo')
    
    // Toggle back to light
    cy.get('.theme-toggle').click()
    cy.get('.app').should('have.class', 'light')
    
    // Verify data persisted
    cy.get('.todo-item').should('have.length', 1)
    cy.todoShouldExist('Dark mode todo')
    
    cy.goToArchive()
    cy.todoShouldExist('Test todo')
  })
})
