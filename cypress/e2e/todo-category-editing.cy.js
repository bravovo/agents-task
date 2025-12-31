describe('Todo App - Advanced Category Editing', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should edit only priority category while keeping others unchanged', () => {
    cy.addTodo('Test todo', {
      priority: 'low',
      time: 'this-week',
      progress: 'in-progress'
    })
    
    cy.contains('.todo-item', 'Test todo').within(() => {
      cy.get('.edit-button').click()
    })
    
    // Only change priority
    cy.get('#edit-priority-select').select('high')
    cy.get('.save-button').click()
    
    // Verify priority changed, others remained
    cy.contains('.todo-item', 'Test todo').within(() => {
      cy.contains('.category-badge', 'High').should('exist')
      cy.contains('.category-badge', 'This Week').should('exist')
      cy.contains('.category-badge', 'In Progress').should('exist')
    })
  })

  it('should edit only time category while keeping others unchanged', () => {
    cy.addTodo('Test todo', {
      priority: 'high',
      time: 'today',
      progress: 'not-started'
    })
    
    cy.contains('.todo-item', 'Test todo').within(() => {
      cy.get('.edit-button').click()
    })
    
    // Only change time
    cy.get('#edit-time-select').select('later')
    cy.get('.save-button').click()
    
    // Verify time changed, others remained
    cy.contains('.todo-item', 'Test todo').within(() => {
      cy.contains('.category-badge', 'High').should('exist')
      cy.contains('.category-badge', 'Later').should('exist')
      cy.contains('.category-badge', 'Not Started').should('exist')
    })
  })

  it('should edit only progress category while keeping others unchanged', () => {
    cy.addTodo('Test todo', {
      priority: 'medium',
      time: 'this-month',
      progress: 'not-started'
    })
    
    cy.contains('.todo-item', 'Test todo').within(() => {
      cy.get('.edit-button').click()
    })
    
    // Only change progress
    cy.get('#edit-progress-select').select('blocked')
    cy.get('.save-button').click()
    
    // Verify progress changed, others remained
    cy.contains('.todo-item', 'Test todo').within(() => {
      cy.contains('.category-badge', 'Medium').should('exist')
      cy.contains('.category-badge', 'This Month').should('exist')
      cy.contains('.category-badge', 'Blocked').should('exist')
    })
  })

  it('should change all categories at once', () => {
    cy.addTodo('Todo to fully modify', {
      priority: 'low',
      time: 'later',
      progress: 'not-started'
    })
    
    cy.contains('.todo-item', 'Todo to fully modify').within(() => {
      cy.get('.edit-button').click()
    })
    
    // Change all categories
    cy.get('#edit-priority-select').select('high')
    cy.get('#edit-time-select').select('today')
    cy.get('#edit-progress-select').select('in-progress')
    cy.get('.save-button').click()
    
    // Verify all categories changed
    cy.contains('.todo-item', 'Todo to fully modify').within(() => {
      cy.contains('.category-badge', 'High').should('exist')
      cy.contains('.category-badge', 'Today').should('exist')
      cy.contains('.category-badge', 'In Progress').should('exist')
      cy.contains('.category-badge', 'Low').should('not.exist')
      cy.contains('.category-badge', 'Later').should('not.exist')
      cy.contains('.category-badge', 'Not Started').should('not.exist')
    })
  })

  it('should cancel category changes without saving', () => {
    cy.addTodo('Todo with original categories', {
      priority: 'high',
      time: 'today',
      progress: 'in-progress'
    })
    
    cy.contains('.todo-item', 'Todo with original categories').within(() => {
      cy.get('.edit-button').click()
    })
    
    // Change categories but cancel
    cy.get('#edit-priority-select').select('low')
    cy.get('#edit-time-select').select('later')
    cy.get('#edit-progress-select').select('blocked')
    cy.get('.cancel-button').click()
    
    // Verify original categories preserved
    cy.contains('.todo-item', 'Todo with original categories').within(() => {
      cy.contains('.category-badge', 'High').should('exist')
      cy.contains('.category-badge', 'Today').should('exist')
      cy.contains('.category-badge', 'In Progress').should('exist')
    })
  })

  it('should edit text and categories together', () => {
    cy.addTodo('Original text', {
      priority: 'low',
      time: 'later',
      progress: 'not-started'
    })
    
    cy.contains('.todo-item', 'Original text').within(() => {
      cy.get('.edit-button').click()
    })
    
    // Edit both text and categories
    cy.get('.edit-input').clear().type('Modified text')
    cy.get('#edit-priority-select').select('high')
    cy.get('#edit-time-select').select('today')
    cy.get('#edit-progress-select').select('in-progress')
    cy.get('.save-button').click()
    
    // Verify both text and categories changed
    cy.todoShouldExist('Modified text')
    cy.todoShouldNotExist('Original text')
    cy.contains('.todo-item', 'Modified text').within(() => {
      cy.contains('.category-badge', 'High').should('exist')
      cy.contains('.category-badge', 'Today').should('exist')
      cy.contains('.category-badge', 'In Progress').should('exist')
    })
  })

  it('should edit categories for multiple todos independently', () => {
    cy.addTodo('First todo', { priority: 'low' })
    cy.addTodo('Second todo', { priority: 'medium' })
    cy.addTodo('Third todo', { priority: 'low' })
    
    // Edit first todo
    cy.contains('.todo-item', 'First todo').within(() => {
      cy.get('.edit-button').click()
    })
    cy.get('#edit-priority-select').select('high')
    cy.get('.save-button').click()
    
    // Edit third todo
    cy.contains('.todo-item', 'Third todo').within(() => {
      cy.get('.edit-button').click()
    })
    cy.get('#edit-priority-select').select('high')
    cy.get('.save-button').click()
    
    // Verify each todo has correct categories
    cy.contains('.todo-item', 'First todo').within(() => {
      cy.contains('.category-badge', 'High').should('exist')
    })
    cy.contains('.todo-item', 'Second todo').within(() => {
      cy.contains('.category-badge', 'Medium').should('exist')
    })
    cy.contains('.todo-item', 'Third todo').within(() => {
      cy.contains('.category-badge', 'High').should('exist')
    })
  })

  it('should cycle through all priority options', () => {
    cy.addTodo('Priority test', { priority: 'low' })
    
    // Change to medium
    cy.contains('.todo-item', 'Priority test').within(() => {
      cy.get('.edit-button').click()
    })
    cy.get('#edit-priority-select').select('medium')
    cy.get('.save-button').click()
    cy.contains('.todo-item', 'Priority test').within(() => {
      cy.contains('.category-badge', 'Medium').should('exist')
    })
    
    // Change to high
    cy.contains('.todo-item', 'Priority test').within(() => {
      cy.get('.edit-button').click()
    })
    cy.get('#edit-priority-select').select('high')
    cy.get('.save-button').click()
    cy.contains('.todo-item', 'Priority test').within(() => {
      cy.contains('.category-badge', 'High').should('exist')
    })
    
    // Change back to low
    cy.contains('.todo-item', 'Priority test').within(() => {
      cy.get('.edit-button').click()
    })
    cy.get('#edit-priority-select').select('low')
    cy.get('.save-button').click()
    cy.contains('.todo-item', 'Priority test').within(() => {
      cy.contains('.category-badge', 'Low').should('exist')
    })
  })

  it('should cycle through all time options', () => {
    cy.addTodo('Time test', { time: 'today' })
    
    const timeOptions = [
      { value: 'this-week', label: 'This Week' },
      { value: 'this-month', label: 'This Month' },
      { value: 'later', label: 'Later' },
      { value: 'today', label: 'Today' }
    ]
    
    timeOptions.forEach(({ value, label }) => {
      cy.contains('.todo-item', 'Time test').within(() => {
        cy.get('.edit-button').click()
      })
      cy.get('#edit-time-select').select(value)
      cy.get('.save-button').click()
      cy.contains('.todo-item', 'Time test').within(() => {
        cy.contains('.category-badge', label).should('exist')
      })
    })
  })

  it('should cycle through all progress options', () => {
    cy.addTodo('Progress test', { progress: 'not-started' })
    
    const progressOptions = [
      { value: 'in-progress', label: 'In Progress' },
      { value: 'blocked', label: 'Blocked' },
      { value: 'not-started', label: 'Not Started' }
    ]
    
    progressOptions.forEach(({ value, label }) => {
      cy.contains('.todo-item', 'Progress test').within(() => {
        cy.get('.edit-button').click()
      })
      cy.get('#edit-progress-select').select(value)
      cy.get('.save-button').click()
      cy.contains('.todo-item', 'Progress test').within(() => {
        cy.contains('.category-badge', label).should('exist')
      })
    })
  })

  it('should preserve categories when editing fails and is cancelled', () => {
    cy.addTodo('Protected todo', {
      priority: 'high',
      time: 'today',
      progress: 'in-progress'
    })
    
    cy.contains('.todo-item', 'Protected todo').within(() => {
      cy.get('.edit-button').click()
    })
    
    // Try to save with empty text (should fail)
    cy.get('.edit-input').clear()
    cy.get('#edit-priority-select').select('low')
    cy.get('.save-button').click()
    
    // Should remain in edit mode, cancel it
    cy.get('.cancel-button').click()
    
    // Original categories should be preserved
    cy.contains('.todo-item', 'Protected todo').within(() => {
      cy.contains('.category-badge', 'High').should('exist')
      cy.contains('.category-badge', 'Today').should('exist')
      cy.contains('.category-badge', 'In Progress').should('exist')
    })
  })

  it('should maintain category edits across multiple edit sessions', () => {
    cy.addTodo('Incremental edit', {
      priority: 'low',
      time: 'later',
      progress: 'not-started'
    })
    
    // First edit session - change priority
    cy.contains('.todo-item', 'Incremental edit').within(() => {
      cy.get('.edit-button').click()
    })
    cy.get('#edit-priority-select').select('medium')
    cy.get('.save-button').click()
    
    // Second edit session - change time
    cy.contains('.todo-item', 'Incremental edit').within(() => {
      cy.get('.edit-button').click()
    })
    cy.get('#edit-time-select').select('this-week')
    cy.get('.save-button').click()
    
    // Third edit session - change progress
    cy.contains('.todo-item', 'Incremental edit').within(() => {
      cy.get('.edit-button').click()
    })
    cy.get('#edit-progress-select').select('in-progress')
    cy.get('.save-button').click()
    
    // Verify all changes persisted
    cy.contains('.todo-item', 'Incremental edit').within(() => {
      cy.contains('.category-badge', 'Medium').should('exist')
      cy.contains('.category-badge', 'This Week').should('exist')
      cy.contains('.category-badge', 'In Progress').should('exist')
    })
  })

  it('should show correct category dropdowns in edit mode', () => {
    cy.addTodo('Check dropdowns', {
      priority: 'high',
      time: 'today',
      progress: 'blocked'
    })
    
    cy.contains('.todo-item', 'Check dropdowns').within(() => {
      cy.get('.edit-button').click()
    })
    
    // Verify all three category dropdowns are visible
    cy.get('#edit-priority-select').should('be.visible').should('have.value', 'high')
    cy.get('#edit-time-select').should('be.visible').should('have.value', 'today')
    cy.get('#edit-progress-select').should('be.visible').should('have.value', 'blocked')
    
    // Verify dropdown options
    cy.get('#edit-priority-select').find('option').should('have.length', 3)
    cy.get('#edit-time-select').find('option').should('have.length', 4)
    cy.get('#edit-progress-select').find('option').should('have.length', 3)
  })
})
