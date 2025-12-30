describe('Todo App - Complete and Archive', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should complete a todo and move it to archive', () => {
    cy.addTodo('Todo to complete')
    cy.todoShouldExist('Todo to complete')
    cy.contains('.toggle-button', 'Archive (0)').should('exist')
    
    cy.completeTodo('Todo to complete')
    
    // Should be removed from active view
    cy.todoShouldNotExist('Todo to complete')
    cy.contains('.toggle-button', 'Archive (1)').should('exist')
    cy.contains('.toggle-button', 'Active Todos (0)').should('exist')
    
    // Should appear in archive
    cy.goToArchive()
    cy.todoShouldExist('Todo to complete')
    cy.contains('.todo-item', 'Todo to complete').should('have.class', 'archived')
  })

  it('should show completed todo with strike-through in archive', () => {
    cy.addTodo('Completed task')
    cy.completeTodo('Completed task')
    
    cy.goToArchive()
    cy.contains('.todo-item', 'Completed task').within(() => {
      cy.get('.todo-text').should('have.class', 'completed')
    })
  })

  it('should restore a todo from archive', () => {
    cy.addTodo('Todo to restore')
    cy.completeTodo('Todo to restore')
    
    cy.goToArchive()
    cy.todoShouldExist('Todo to restore')
    
    cy.contains('.todo-item', 'Todo to restore').within(() => {
      cy.get('.restore-button').click()
    })
    
    // Should be removed from archive
    cy.todoShouldNotExist('Todo to restore')
    cy.contains('.toggle-button', 'Archive (0)').should('exist')
    
    // Should appear in active todos
    cy.goToActiveTodos()
    cy.todoShouldExist('Todo to restore')
    cy.contains('.toggle-button', 'Active Todos (1)').should('exist')
  })

  it('should delete a todo from archive', () => {
    cy.addTodo('Todo to archive and delete')
    cy.completeTodo('Todo to archive and delete')
    
    cy.goToArchive()
    cy.todoShouldExist('Todo to archive and delete')
    
    cy.contains('.todo-item', 'Todo to archive and delete').within(() => {
      cy.get('.delete-button').click()
    })
    
    cy.todoShouldNotExist('Todo to archive and delete')
    cy.contains('.empty-message', 'No archived todos yet').should('be.visible')
  })

  it('should preserve todo categories when completing and restoring', () => {
    cy.addTodo('Todo with categories', {
      priority: 'high',
      time: 'this-week',
      progress: 'in-progress'
    })
    
    cy.completeTodo('Todo with categories')
    
    cy.goToArchive()
    cy.contains('.todo-item', 'Todo with categories').within(() => {
      cy.contains('.category-badge', 'High').should('exist')
      cy.contains('.category-badge', 'This Week').should('exist')
      cy.contains('.category-badge', 'In Progress').should('exist')
      cy.get('.restore-button').click()
    })
    
    cy.goToActiveTodos()
    cy.contains('.todo-item', 'Todo with categories').within(() => {
      cy.contains('.category-badge', 'High').should('exist')
      cy.contains('.category-badge', 'This Week').should('exist')
      cy.contains('.category-badge', 'In Progress').should('exist')
    })
  })

  it('should handle multiple todos in archive', () => {
    cy.addTodo('First completed')
    cy.addTodo('Second completed')
    cy.addTodo('Third completed')
    
    cy.completeTodo('First completed')
    cy.completeTodo('Second completed')
    cy.completeTodo('Third completed')
    
    cy.contains('.toggle-button', 'Archive (3)').should('exist')
    cy.goToArchive()
    
    cy.get('.todo-item').should('have.length', 3)
    cy.todoShouldExist('First completed')
    cy.todoShouldExist('Second completed')
    cy.todoShouldExist('Third completed')
  })

  it('should show empty message when no archived todos', () => {
    cy.goToArchive()
    cy.contains('.empty-message', 'No archived todos yet').should('be.visible')
  })
})
