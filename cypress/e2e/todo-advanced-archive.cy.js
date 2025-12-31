describe('Todo App - Advanced Archive Operations', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should archive todo while search filter is active', () => {
    cy.addTodo('First task')
    cy.addTodo('Second task')
    cy.addTodo('Third task')
    
    // Apply search filter
    cy.get('.search-input').type('Second')
    cy.get('.todo-item').should('have.length', 1)
    
    // Complete the filtered todo
    cy.completeTodo('Second task')
    
    // Clear search and verify
    cy.get('.search-input').clear()
    cy.get('.todo-item').should('have.length', 2)
    cy.todoShouldExist('First task')
    cy.todoShouldExist('Third task')
    
    // Check archive
    cy.goToArchive()
    cy.todoShouldExist('Second task')
  })

  it('should archive todo while category filter is active', () => {
    cy.addTodo('High priority task', { priority: 'high' })
    cy.addTodo('Low priority task', { priority: 'low' })
    cy.addTodo('Medium priority task', { priority: 'medium' })
    
    // Apply priority filter
    cy.get('#filter-priority').select('high')
    cy.get('.todo-item').should('have.length', 1)
    
    // Complete the filtered todo
    cy.completeTodo('High priority task')
    
    // Clear filter and verify
    cy.get('#filter-priority').select('all')
    cy.get('.todo-item').should('have.length', 2)
    
    // Check archive
    cy.goToArchive()
    cy.todoShouldExist('High priority task')
  })

  it('should archive multiple todos with different categories', () => {
    const todosToArchive = [
      { text: 'High priority today', priority: 'high', time: 'today', progress: 'not-started' },
      { text: 'Medium priority week', priority: 'medium', time: 'this-week', progress: 'in-progress' },
      { text: 'Low priority later', priority: 'low', time: 'later', progress: 'blocked' }
    ]
    
    // Add todos
    todosToArchive.forEach(todo => {
      cy.addTodo(todo.text, {
        priority: todo.priority,
        time: todo.time,
        progress: todo.progress
      })
    })
    
    // Complete all
    todosToArchive.forEach(todo => {
      cy.completeTodo(todo.text)
    })
    
    // Verify all in archive with correct categories
    cy.goToArchive()
    cy.get('.todo-item').should('have.length', 3)
    
    cy.contains('.todo-item', 'High priority today').within(() => {
      cy.contains('.category-badge', 'High').should('exist')
      cy.contains('.category-badge', 'Today').should('exist')
      cy.contains('.category-badge', 'Not Started').should('exist')
    })
    
    cy.contains('.todo-item', 'Medium priority week').within(() => {
      cy.contains('.category-badge', 'Medium').should('exist')
      cy.contains('.category-badge', 'This Week').should('exist')
      cy.contains('.category-badge', 'In Progress').should('exist')
    })
    
    cy.contains('.todo-item', 'Low priority later').within(() => {
      cy.contains('.category-badge', 'Low').should('exist')
      cy.contains('.category-badge', 'Later').should('exist')
      cy.contains('.category-badge', 'Blocked').should('exist')
    })
  })

  it('should search archived todos by text', () => {
    cy.addTodo('Important meeting notes')
    cy.addTodo('Buy groceries for party')
    cy.addTodo('Review pull request')
    
    // Complete all
    cy.completeTodo('Important meeting notes')
    cy.completeTodo('Buy groceries for party')
    cy.completeTodo('Review pull request')
    
    // Go to archive and search
    cy.goToArchive()
    cy.get('.search-input').type('meeting')
    
    cy.get('.todo-item').should('have.length', 1)
    cy.todoShouldExist('Important meeting notes')
    cy.todoShouldNotExist('Buy groceries for party')
  })

  it('should filter archived todos by multiple categories', () => {
    cy.addTodo('High today task', { priority: 'high', time: 'today' })
    cy.addTodo('High week task', { priority: 'high', time: 'this-week' })
    cy.addTodo('Low today task', { priority: 'low', time: 'today' })
    
    // Complete all
    cy.completeTodo('High today task')
    cy.completeTodo('High week task')
    cy.completeTodo('Low today task')
    
    // Go to archive and apply filters
    cy.goToArchive()
    cy.get('#filter-priority').select('high')
    cy.get('#filter-time').select('today')
    
    cy.get('.todo-item').should('have.length', 1)
    cy.todoShouldExist('High today task')
  })

  it('should restore multiple todos from archive', () => {
    cy.addTodo('Task 1')
    cy.addTodo('Task 2')
    cy.addTodo('Task 3')
    
    // Complete all
    cy.completeTodo('Task 1')
    cy.completeTodo('Task 2')
    cy.completeTodo('Task 3')
    
    cy.goToArchive()
    cy.get('.todo-item').should('have.length', 3)
    
    // Restore two tasks
    cy.contains('.todo-item', 'Task 1').within(() => {
      cy.get('.restore-button').click()
    })
    cy.contains('.todo-item', 'Task 3').within(() => {
      cy.get('.restore-button').click()
    })
    
    // Verify archive has one remaining
    cy.get('.todo-item').should('have.length', 1)
    cy.todoShouldExist('Task 2')
    
    // Verify active todos has two
    cy.goToActiveTodos()
    cy.get('.todo-item').should('have.length', 2)
    cy.todoShouldExist('Task 1')
    cy.todoShouldExist('Task 3')
  })

  it('should delete multiple todos from archive', () => {
    cy.addTodo('Delete me 1')
    cy.addTodo('Delete me 2')
    cy.addTodo('Delete me 3')
    
    // Complete all
    cy.completeTodo('Delete me 1')
    cy.completeTodo('Delete me 2')
    cy.completeTodo('Delete me 3')
    
    cy.goToArchive()
    cy.get('.todo-item').should('have.length', 3)
    
    // Delete two from archive
    cy.contains('.todo-item', 'Delete me 1').within(() => {
      cy.get('.delete-button').click()
    })
    cy.contains('.todo-item', 'Delete me 2').within(() => {
      cy.get('.delete-button').click()
    })
    
    // Verify only one remains
    cy.get('.todo-item').should('have.length', 1)
    cy.todoShouldExist('Delete me 3')
    cy.contains('.toggle-button', 'Archive (1)').should('exist')
  })

  it('should handle archive and restore with search active', () => {
    cy.addTodo('Search task alpha')
    cy.addTodo('Search task beta')
    cy.addTodo('Other task')
    
    // Apply search
    cy.get('.search-input').type('Search')
    cy.get('.todo-item').should('have.length', 2)
    
    // Complete filtered todo
    cy.completeTodo('Search task alpha')
    
    // Verify it's removed from filtered view
    cy.get('.todo-item').should('have.length', 1)
    cy.todoShouldExist('Search task beta')
    
    // Go to archive and restore with search still active
    cy.goToArchive()
    cy.todoShouldExist('Search task alpha')
    cy.contains('.todo-item', 'Search task alpha').within(() => {
      cy.get('.restore-button').click()
    })
    
    // Go back to active todos
    cy.goToActiveTodos()
    cy.get('.todo-item').should('have.length', 2)
    cy.todoShouldExist('Search task alpha')
    cy.todoShouldExist('Search task beta')
  })

  it('should maintain archive count accurately during operations', () => {
    cy.contains('.toggle-button', 'Archive (0)').should('exist')
    
    // Add and complete one todo
    cy.addTodo('First')
    cy.completeTodo('First')
    cy.contains('.toggle-button', 'Archive (1)').should('exist')
    
    // Add and complete another
    cy.addTodo('Second')
    cy.completeTodo('Second')
    cy.contains('.toggle-button', 'Archive (2)').should('exist')
    
    // Restore one
    cy.goToArchive()
    cy.contains('.todo-item', 'First').within(() => {
      cy.get('.restore-button').click()
    })
    cy.contains('.toggle-button', 'Archive (1)').should('exist')
    
    // Delete one from archive
    cy.contains('.todo-item', 'Second').within(() => {
      cy.get('.delete-button').click()
    })
    cy.contains('.toggle-button', 'Archive (0)').should('exist')
  })

  it('should show empty message appropriately in archive view', () => {
    // Start with no archived todos
    cy.goToArchive()
    cy.contains('.empty-message', 'No archived todos yet').should('be.visible')
    
    // Add and complete a todo
    cy.goToActiveTodos()
    cy.addTodo('Test')
    cy.completeTodo('Test')
    
    // Archive should have content
    cy.goToArchive()
    cy.get('.empty-message').should('not.exist')
    cy.todoShouldExist('Test')
    
    // Delete from archive
    cy.contains('.todo-item', 'Test').within(() => {
      cy.get('.delete-button').click()
    })
    
    // Empty message should reappear
    cy.contains('.empty-message', 'No archived todos yet').should('be.visible')
  })

  it('should archive todo with all category combinations', () => {
    const priorities = ['high', 'medium', 'low']
    const times = ['today', 'this-week', 'this-month', 'later']
    const progress = ['not-started', 'in-progress', 'blocked']
    
    let counter = 0
    priorities.forEach(priority => {
      times.slice(0, 2).forEach(time => {
        progress.slice(0, 2).forEach(prog => {
          counter++
          cy.addTodo(`Todo ${counter}`, {
            priority: priority,
            time: time,
            progress: prog
          })
          cy.completeTodo(`Todo ${counter}`)
        })
      })
    })
    
    // Verify all are archived
    cy.goToArchive()
    cy.get('.todo-item').should('have.length', counter)
  })

  it('should restore and re-archive same todo', () => {
    cy.addTodo('Cycle todo', {
      priority: 'high',
      time: 'today',
      progress: 'in-progress'
    })
    
    // Complete it
    cy.completeTodo('Cycle todo')
    cy.contains('.toggle-button', 'Archive (1)').should('exist')
    
    // Restore it
    cy.goToArchive()
    cy.contains('.todo-item', 'Cycle todo').within(() => {
      cy.get('.restore-button').click()
    })
    cy.contains('.toggle-button', 'Archive (0)').should('exist')
    
    // Complete it again
    cy.goToActiveTodos()
    cy.completeTodo('Cycle todo')
    cy.contains('.toggle-button', 'Archive (1)').should('exist')
    
    // Verify categories preserved
    cy.goToArchive()
    cy.contains('.todo-item', 'Cycle todo').within(() => {
      cy.contains('.category-badge', 'High').should('exist')
      cy.contains('.category-badge', 'Today').should('exist')
      cy.contains('.category-badge', 'In Progress').should('exist')
    })
  })

  it('should handle archiving todos added with different category defaults', () => {
    // Add todos with default categories
    cy.addTodo('Default todo')
    
    // Verify default categories
    cy.contains('.todo-item', 'Default todo').within(() => {
      cy.contains('.category-badge', 'Medium').should('exist')
      cy.contains('.category-badge', 'Today').should('exist')
      cy.contains('.category-badge', 'Not Started').should('exist')
    })
    
    // Complete and verify in archive
    cy.completeTodo('Default todo')
    cy.goToArchive()
    
    cy.contains('.todo-item', 'Default todo').within(() => {
      cy.contains('.category-badge', 'Medium').should('exist')
      cy.contains('.category-badge', 'Today').should('exist')
      cy.contains('.category-badge', 'Not Started').should('exist')
    })
  })

  it('should maintain completed styling in archive', () => {
    cy.addTodo('Styled task')
    cy.completeTodo('Styled task')
    
    cy.goToArchive()
    cy.contains('.todo-item', 'Styled task').should('have.class', 'archived')
    cy.contains('.todo-item', 'Styled task').within(() => {
      cy.get('.todo-text').should('have.class', 'completed')
    })
  })

  it('should not allow editing archived todos', () => {
    cy.addTodo('No edit in archive')
    cy.completeTodo('No edit in archive')
    
    cy.goToArchive()
    cy.contains('.todo-item', 'No edit in archive').within(() => {
      cy.get('.edit-button').should('not.exist')
      cy.get('.complete-button').should('not.exist')
    })
  })

  it('should quickly archive and unarchive multiple todos', () => {
    // Add 5 todos
    for (let i = 1; i <= 5; i++) {
      cy.addTodo(`Quick task ${i}`)
    }
    
    // Archive all quickly
    for (let i = 1; i <= 5; i++) {
      cy.completeTodo(`Quick task ${i}`)
    }
    
    cy.contains('.toggle-button', 'Archive (5)').should('exist')
    cy.contains('.toggle-button', 'Active Todos (0)').should('exist')
    
    // Restore all quickly
    cy.goToArchive()
    for (let i = 1; i <= 5; i++) {
      cy.contains('.todo-item', `Quick task ${i}`).within(() => {
        cy.get('.restore-button').click()
      })
    }
    
    cy.contains('.toggle-button', 'Archive (0)').should('exist')
    cy.goToActiveTodos()
    cy.contains('.toggle-button', 'Active Todos (5)').should('exist')
  })
})
