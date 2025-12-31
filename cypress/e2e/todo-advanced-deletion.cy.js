describe('Todo App - Advanced Deletion Scenarios', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should delete todo while search is active', () => {
    cy.addTodo('Keep this task')
    cy.addTodo('Delete this task')
    cy.addTodo('Another task to keep')
    
    // Search for the todo to delete
    cy.get('.search-input').type('Delete')
    cy.get('.todo-item').should('have.length', 1)
    
    // Delete it
    cy.deleteTodo('Delete this task')
    
    // Clear search and verify
    cy.get('.search-input').clear()
    cy.get('.todo-item').should('have.length', 2)
    cy.todoShouldExist('Keep this task')
    cy.todoShouldExist('Another task to keep')
    cy.todoShouldNotExist('Delete this task')
  })

  it('should delete todo while category filter is active', () => {
    cy.addTodo('High priority task', { priority: 'high' })
    cy.addTodo('Medium priority task', { priority: 'medium' })
    cy.addTodo('Another high priority', { priority: 'high' })
    
    // Filter by high priority
    cy.get('#filter-priority').select('high')
    cy.get('.todo-item').should('have.length', 2)
    
    // Delete one high priority task
    cy.deleteTodo('High priority task')
    
    // Should see one high priority task remaining
    cy.get('.todo-item').should('have.length', 1)
    cy.todoShouldExist('Another high priority')
    
    // Clear filter and verify total
    cy.get('#filter-priority').select('all')
    cy.get('.todo-item').should('have.length', 2)
  })

  it('should delete multiple todos in sequence', () => {
    cy.addTodo('First')
    cy.addTodo('Second')
    cy.addTodo('Third')
    cy.addTodo('Fourth')
    cy.addTodo('Fifth')
    
    cy.get('.todo-item').should('have.length', 5)
    
    // Delete three todos in sequence
    cy.deleteTodo('Second')
    cy.get('.todo-item').should('have.length', 4)
    
    cy.deleteTodo('Fourth')
    cy.get('.todo-item').should('have.length', 3)
    
    cy.deleteTodo('First')
    cy.get('.todo-item').should('have.length', 2)
    
    // Verify remaining todos
    cy.todoShouldExist('Third')
    cy.todoShouldExist('Fifth')
  })

  it('should delete last remaining todo', () => {
    cy.addTodo('Only todo')
    cy.get('.todo-item').should('have.length', 1)
    
    cy.deleteTodo('Only todo')
    
    cy.get('.todo-item').should('have.length', 0)
    cy.contains('.empty-message', 'No todos yet').should('be.visible')
    cy.contains('.toggle-button', 'Active Todos (0)').should('exist')
  })

  it('should delete all todos one by one', () => {
    const todos = ['Todo 1', 'Todo 2', 'Todo 3', 'Todo 4']
    
    todos.forEach(todo => cy.addTodo(todo))
    cy.get('.todo-item').should('have.length', todos.length)
    
    // Delete all
    todos.forEach((todo, index) => {
      cy.deleteTodo(todo)
      cy.get('.todo-item').should('have.length', todos.length - index - 1)
    })
    
    cy.contains('.empty-message', 'No todos yet').should('be.visible')
  })

  it('should delete from archive view', () => {
    cy.addTodo('Archive and delete')
    cy.completeTodo('Archive and delete')
    
    cy.goToArchive()
    cy.get('.todo-item').should('have.length', 1)
    
    cy.contains('.todo-item', 'Archive and delete').within(() => {
      cy.get('.delete-button').click()
    })
    
    cy.get('.todo-item').should('have.length', 0)
    cy.contains('.empty-message', 'No archived todos yet').should('be.visible')
  })

  it('should delete multiple todos from archive', () => {
    cy.addTodo('Archive 1')
    cy.addTodo('Archive 2')
    cy.addTodo('Archive 3')
    
    cy.completeTodo('Archive 1')
    cy.completeTodo('Archive 2')
    cy.completeTodo('Archive 3')
    
    cy.goToArchive()
    cy.get('.todo-item').should('have.length', 3)
    
    // Delete two from archive
    cy.contains('.todo-item', 'Archive 1').within(() => {
      cy.get('.delete-button').click()
    })
    cy.contains('.todo-item', 'Archive 3').within(() => {
      cy.get('.delete-button').click()
    })
    
    cy.get('.todo-item').should('have.length', 1)
    cy.todoShouldExist('Archive 2')
  })

  it('should delete todos with different categories', () => {
    cy.addTodo('High priority', { priority: 'high', time: 'today' })
    cy.addTodo('Medium priority', { priority: 'medium', time: 'this-week' })
    cy.addTodo('Low priority', { priority: 'low', time: 'later' })
    
    // Delete each type
    cy.deleteTodo('High priority')
    cy.todoShouldNotExist('High priority')
    cy.get('.todo-item').should('have.length', 2)
    
    cy.deleteTodo('Low priority')
    cy.todoShouldNotExist('Low priority')
    cy.get('.todo-item').should('have.length', 1)
    
    cy.deleteTodo('Medium priority')
    cy.todoShouldNotExist('Medium priority')
    cy.contains('.empty-message', 'No todos yet').should('be.visible')
  })

  it('should update todo count after deletion', () => {
    cy.addTodo('Count test 1')
    cy.addTodo('Count test 2')
    cy.addTodo('Count test 3')
    
    cy.contains('.toggle-button', 'Active Todos (3)').should('exist')
    
    cy.deleteTodo('Count test 1')
    cy.contains('.toggle-button', 'Active Todos (2)').should('exist')
    
    cy.deleteTodo('Count test 2')
    cy.contains('.toggle-button', 'Active Todos (1)').should('exist')
    
    cy.deleteTodo('Count test 3')
    cy.contains('.toggle-button', 'Active Todos (0)').should('exist')
  })

  it('should show empty message when deleting filtered results', () => {
    cy.addTodo('High task', { priority: 'high' })
    cy.addTodo('Low task', { priority: 'low' })
    
    // Filter to show only high priority
    cy.get('#filter-priority').select('high')
    cy.get('.todo-item').should('have.length', 1)
    
    // Delete the filtered todo
    cy.deleteTodo('High task')
    
    // Should show empty message for filtered view
    cy.contains('.empty-message', 'No todos match your search or filters').should('be.visible')
    
    // Clear filter
    cy.get('#filter-priority').select('all')
    cy.get('.todo-item').should('have.length', 1)
    cy.todoShouldExist('Low task')
  })

  it('should delete todos after editing', () => {
    cy.addTodo('Edit then delete')
    
    // Edit the todo
    cy.editTodo('Edit then delete', 'Edited text')
    cy.todoShouldExist('Edited text')
    
    // Now delete it
    cy.deleteTodo('Edited text')
    cy.todoShouldNotExist('Edited text')
    cy.contains('.empty-message', 'No todos yet').should('be.visible')
  })

  it('should delete todo that was previously archived and restored', () => {
    cy.addTodo('Cycle delete test')
    
    // Complete and archive
    cy.completeTodo('Cycle delete test')
    
    // Restore from archive
    cy.goToArchive()
    cy.contains('.todo-item', 'Cycle delete test').within(() => {
      cy.get('.restore-button').click()
    })
    
    // Go back to active and delete
    cy.goToActiveTodos()
    cy.deleteTodo('Cycle delete test')
    cy.todoShouldNotExist('Cycle delete test')
    cy.contains('.empty-message', 'No todos yet').should('be.visible')
  })

  it('should handle deletion of todos with search and filter combined', () => {
    cy.addTodo('Buy groceries high', { priority: 'high' })
    cy.addTodo('Buy clothes low', { priority: 'low' })
    cy.addTodo('Buy books high', { priority: 'high' })
    
    // Apply search and filter
    cy.get('.search-input').type('Buy')
    cy.get('#filter-priority').select('high')
    cy.get('.todo-item').should('have.length', 2)
    
    // Delete one
    cy.deleteTodo('Buy groceries high')
    cy.get('.todo-item').should('have.length', 1)
    cy.todoShouldExist('Buy books high')
    
    // Clear filters
    cy.get('.search-input').clear()
    cy.get('#filter-priority').select('all')
    cy.get('.todo-item').should('have.length', 2)
  })

  it('should delete first todo in list', () => {
    cy.addTodo('First position')
    cy.addTodo('Second position')
    cy.addTodo('Third position')
    
    cy.deleteTodo('First position')
    
    cy.get('.todo-item').should('have.length', 2)
    cy.todoShouldExist('Second position')
    cy.todoShouldExist('Third position')
  })

  it('should delete middle todo in list', () => {
    cy.addTodo('First')
    cy.addTodo('Middle')
    cy.addTodo('Last')
    
    cy.deleteTodo('Middle')
    
    cy.get('.todo-item').should('have.length', 2)
    cy.todoShouldExist('First')
    cy.todoShouldExist('Last')
  })

  it('should delete last todo in list', () => {
    cy.addTodo('First')
    cy.addTodo('Second')
    cy.addTodo('Last position')
    
    cy.deleteTodo('Last position')
    
    cy.get('.todo-item').should('have.length', 2)
    cy.todoShouldExist('First')
    cy.todoShouldExist('Second')
  })

  it('should maintain data integrity after rapid deletions', () => {
    // Add 10 todos
    for (let i = 1; i <= 10; i++) {
      cy.addTodo(`Rapid ${i}`)
    }
    
    cy.get('.todo-item').should('have.length', 10)
    
    // Rapidly delete every other todo
    cy.deleteTodo('Rapid 1')
    cy.deleteTodo('Rapid 3')
    cy.deleteTodo('Rapid 5')
    cy.deleteTodo('Rapid 7')
    cy.deleteTodo('Rapid 9')
    
    cy.get('.todo-item').should('have.length', 5)
    
    // Verify correct todos remain
    cy.todoShouldExist('Rapid 2')
    cy.todoShouldExist('Rapid 4')
    cy.todoShouldExist('Rapid 6')
    cy.todoShouldExist('Rapid 8')
    cy.todoShouldExist('Rapid 10')
  })

  it('should allow adding new todo after deleting all', () => {
    cy.addTodo('Delete me')
    cy.deleteTodo('Delete me')
    
    cy.contains('.empty-message', 'No todos yet').should('be.visible')
    
    // Add new todo
    cy.addTodo('New todo after deletion')
    cy.todoShouldExist('New todo after deletion')
    cy.get('.todo-item').should('have.length', 1)
  })

  it('should delete todo with long text', () => {
    const longText = 'This is a very long todo text that contains multiple words and should test the deletion functionality with longer content to ensure it works properly'
    
    cy.addTodo(longText)
    cy.todoShouldExist(longText)
    
    cy.deleteTodo(longText)
    cy.todoShouldNotExist(longText)
    cy.contains('.empty-message', 'No todos yet').should('be.visible')
  })

  it('should delete todos with special characters', () => {
    const specialTodos = [
      'Todo with @#$ special chars',
      'Todo with émojis 🎉🎊',
      'Todo with "quotes" and \'apostrophes\''
    ]
    
    specialTodos.forEach(todo => cy.addTodo(todo))
    cy.get('.todo-item').should('have.length', specialTodos.length)
    
    // Delete each one
    specialTodos.forEach(todo => {
      cy.deleteTodo(todo)
    })
    
    cy.contains('.empty-message', 'No todos yet').should('be.visible')
  })

  it('should preserve other todos categories when deleting one', () => {
    cy.addTodo('Keep high', { priority: 'high', time: 'today' })
    cy.addTodo('Delete medium', { priority: 'medium', time: 'this-week' })
    cy.addTodo('Keep low', { priority: 'low', time: 'later' })
    
    cy.deleteTodo('Delete medium')
    
    // Verify remaining todos have correct categories
    cy.contains('.todo-item', 'Keep high').within(() => {
      cy.contains('.category-badge', 'High').should('exist')
      cy.contains('.category-badge', 'Today').should('exist')
    })
    
    cy.contains('.todo-item', 'Keep low').within(() => {
      cy.contains('.category-badge', 'Low').should('exist')
      cy.contains('.category-badge', 'Later').should('exist')
    })
  })

  it('should handle deletion from both active and archive views in sequence', () => {
    cy.addTodo('Active delete')
    cy.addTodo('Archive delete')
    
    // Delete from active
    cy.deleteTodo('Active delete')
    cy.get('.todo-item').should('have.length', 1)
    
    // Move remaining to archive
    cy.completeTodo('Archive delete')
    
    // Delete from archive
    cy.goToArchive()
    cy.contains('.todo-item', 'Archive delete').within(() => {
      cy.get('.delete-button').click()
    })
    
    cy.contains('.empty-message', 'No archived todos yet').should('be.visible')
    
    // Verify active is also empty
    cy.goToActiveTodos()
    cy.contains('.empty-message', 'No todos yet').should('be.visible')
  })
})
