describe('Todo App - Empty States and Edge Cases', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Empty States', () => {
    it('should show empty message when no todos exist', () => {
      cy.contains('.empty-message', 'No todos yet. Add one to get started!').should('be.visible')
    })

    it('should show empty archive message', () => {
      cy.goToArchive()
      cy.contains('.empty-message', 'No archived todos yet.').should('be.visible')
    })

    it('should show filtered empty message when search has no results', () => {
      cy.addTodo('Test todo')
      cy.get('.search-input').type('nonexistent')
      cy.contains('.empty-message', 'No todos match your search or filters.').should('be.visible')
    })

    it('should show filtered empty message when category filter has no results', () => {
      cy.addTodo('Low priority todo', { priority: 'low' })
      cy.get('#filter-priority').select('high')
      cy.contains('.empty-message', 'No todos match your search or filters.').should('be.visible')
    })

    it('should show correct archive empty message with filters', () => {
      cy.addTodo('Test')
      cy.completeTodo('Test')
      cy.goToArchive()
      cy.get('.search-input').type('nonexistent')
      cy.contains('.empty-message', 'No archived todos match your search or filters.').should('be.visible')
    })

    it('should transition from empty to populated state', () => {
      cy.contains('.empty-message', 'No todos yet').should('be.visible')
      cy.addTodo('First todo')
      cy.contains('.empty-message', 'No todos yet').should('not.exist')
      cy.get('.todo-item').should('have.length', 1)
    })

    it('should transition back to empty state after deleting all', () => {
      cy.addTodo('Only todo')
      cy.get('.todo-item').should('have.length', 1)
      cy.deleteTodo('Only todo')
      cy.contains('.empty-message', 'No todos yet').should('be.visible')
    })
  })

  describe('Todos Without Categories', () => {
    it('should handle filtering todos without categories', () => {
      // Add a todo and verify it has default categories
      cy.addTodo('Todo with defaults')
      cy.get('#filter-priority').select('medium')
      cy.todoShouldExist('Todo with defaults')
    })

    it('should display todos when filter is "all" regardless of categories', () => {
      cy.addTodo('Todo 1', { priority: 'high' })
      cy.addTodo('Todo 2', { priority: 'low' })
      
      cy.get('#filter-priority').select('all')
      cy.get('.todo-item').should('have.length', 2)
    })

    it('should exclude from results when filtered by specific category', () => {
      cy.addTodo('High priority', { priority: 'high' })
      cy.addTodo('Low priority', { priority: 'low' })
      
      cy.get('#filter-priority').select('high')
      cy.get('.todo-item').should('have.length', 1)
      cy.todoShouldExist('High priority')
    })
  })

  describe('Special Characters and Long Text', () => {
    it('should handle todos with special characters', () => {
      const specialText = 'Test @#$%^&*()_+-=[]{}|;:,.<>?'
      cy.addTodo(specialText)
      cy.todoShouldExist(specialText)
    })

    it('should handle todos with emojis', () => {
      const emojiText = 'Buy groceries 🛒 and cook 🍳'
      cy.addTodo(emojiText)
      cy.todoShouldExist(emojiText)
    })

    it('should handle very long todo text', () => {
      const longText = 'This is a very long todo item that contains a lot of text to test how the application handles lengthy content without breaking the layout or causing display issues in the user interface.'
      cy.addTodo(longText)
      cy.todoShouldExist(longText)
    })

    it('should handle todos with quotes', () => {
      const quotedText = 'Read "The Great Gatsby" book'
      cy.addTodo(quotedText)
      cy.todoShouldExist(quotedText)
    })

    it('should handle todos with apostrophes', () => {
      const apostropheText = "Don't forget to call"
      cy.addTodo(apostropheText)
      cy.todoShouldExist(apostropheText)
    })

    it('should search for todos with special characters', () => {
      cy.addTodo('Test @special')
      cy.addTodo('Regular todo')
      
      cy.get('.search-input').type('@special')
      cy.todoShouldExist('Test @special')
      cy.todoShouldNotExist('Regular todo')
    })
  })

  describe('Multiple Filter Combinations', () => {
    beforeEach(() => {
      cy.addTodo('High Today Not Started', { priority: 'high', time: 'today', progress: 'not-started' })
      cy.addTodo('Medium Week In Progress', { priority: 'medium', time: 'this-week', progress: 'in-progress' })
      cy.addTodo('Low Later Blocked', { priority: 'low', time: 'later', progress: 'blocked' })
    })

    it('should filter by single category', () => {
      cy.get('#filter-priority').select('high')
      cy.get('.todo-item').should('have.length', 1)
      cy.todoShouldExist('High Today Not Started')
    })

    it('should filter by two categories', () => {
      cy.get('#filter-priority').select('high')
      cy.get('#filter-time').select('today')
      cy.get('.todo-item').should('have.length', 1)
      cy.todoShouldExist('High Today Not Started')
    })

    it('should filter by all three categories', () => {
      cy.get('#filter-priority').select('medium')
      cy.get('#filter-time').select('this-week')
      cy.get('#filter-progress').select('in-progress')
      cy.get('.todo-item').should('have.length', 1)
      cy.todoShouldExist('Medium Week In Progress')
    })

    it('should combine search with category filters', () => {
      cy.get('.search-input').type('High')
      cy.get('#filter-priority').select('high')
      cy.get('.todo-item').should('have.length', 1)
      cy.todoShouldExist('High Today Not Started')
    })

    it('should show all when filters are reset to "all"', () => {
      cy.get('#filter-priority').select('high')
      cy.get('.todo-item').should('have.length', 1)
      
      cy.get('#filter-priority').select('all')
      cy.get('.todo-item').should('have.length', 3)
    })

    it('should show empty message when filters match nothing', () => {
      cy.get('#filter-priority').select('high')
      cy.get('#filter-time').select('later')
      cy.contains('.empty-message', 'No todos match your search or filters.').should('be.visible')
    })
  })

  describe('Counter Updates', () => {
    it('should show correct count with zero todos', () => {
      cy.contains('.toggle-button', 'Active Todos (0)').should('exist')
      cy.contains('.toggle-button', 'Archive (0)').should('exist')
    })

    it('should update active count when adding todos', () => {
      cy.contains('.toggle-button', 'Active Todos (0)').should('exist')
      cy.addTodo('Todo 1')
      cy.contains('.toggle-button', 'Active Todos (1)').should('exist')
      cy.addTodo('Todo 2')
      cy.contains('.toggle-button', 'Active Todos (2)').should('exist')
    })

    it('should update counts when completing todos', () => {
      cy.addTodo('Todo 1')
      cy.addTodo('Todo 2')
      cy.contains('.toggle-button', 'Active Todos (2)').should('exist')
      cy.contains('.toggle-button', 'Archive (0)').should('exist')
      
      cy.completeTodo('Todo 1')
      cy.contains('.toggle-button', 'Active Todos (1)').should('exist')
      cy.contains('.toggle-button', 'Archive (1)').should('exist')
    })

    it('should update counts when deleting todos', () => {
      cy.addTodo('Todo 1')
      cy.addTodo('Todo 2')
      cy.contains('.toggle-button', 'Active Todos (2)').should('exist')
      
      cy.deleteTodo('Todo 1')
      cy.contains('.toggle-button', 'Active Todos (1)').should('exist')
    })

    it('should update counts when restoring from archive', () => {
      cy.addTodo('Todo')
      cy.completeTodo('Todo')
      cy.contains('.toggle-button', 'Active Todos (0)').should('exist')
      cy.contains('.toggle-button', 'Archive (1)').should('exist')
      
      cy.goToArchive()
      cy.contains('.todo-item', 'Todo').within(() => {
        cy.get('.restore-button').click()
      })
      
      cy.contains('.toggle-button', 'Active Todos (1)').should('exist')
      cy.contains('.toggle-button', 'Archive (0)').should('exist')
    })

    it('should maintain counts during filtering', () => {
      cy.addTodo('High priority', { priority: 'high' })
      cy.addTodo('Low priority', { priority: 'low' })
      cy.contains('.toggle-button', 'Active Todos (2)').should('exist')
      
      cy.get('#filter-priority').select('high')
      // Filter shouldn't affect the counter
      cy.contains('.toggle-button', 'Active Todos (2)').should('exist')
      cy.get('.todo-item').should('have.length', 1)
    })
  })

  describe('Category Badge Display', () => {
    it('should display all category badges', () => {
      cy.addTodo('Full categories', { priority: 'high', time: 'today', progress: 'in-progress' })
      cy.contains('.todo-item', 'Full categories').within(() => {
        cy.get('.category-badge').should('have.length', 3)
        cy.contains('.category-badge', 'High').should('exist')
        cy.contains('.category-badge', 'Today').should('exist')
        cy.contains('.category-badge', 'In Progress').should('exist')
      })
    })

    it('should display correct badge for each priority level', () => {
      const priorities = [
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' }
      ]
      
      priorities.forEach(({ value, label }) => {
        cy.addTodo(`${value} priority`, { priority: value })
        cy.contains('.todo-item', `${value} priority`).within(() => {
          cy.contains('.category-badge', label).should('exist')
        })
      })
    })

    it('should display correct badge for each time category', () => {
      const times = [
        { value: 'today', label: 'Today' },
        { value: 'this-week', label: 'This Week' },
        { value: 'this-month', label: 'This Month' },
        { value: 'later', label: 'Later' }
      ]
      
      times.forEach(({ value, label }) => {
        cy.addTodo(`${value} time`, { time: value })
        cy.contains('.todo-item', `${value} time`).within(() => {
          cy.contains('.category-badge', label).should('exist')
        })
      })
    })

    it('should display correct badge for each progress state', () => {
      const progressStates = [
        { value: 'not-started', label: 'Not Started' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'blocked', label: 'Blocked' }
      ]
      
      progressStates.forEach(({ value, label }) => {
        cy.addTodo(`${value} progress`, { progress: value })
        cy.contains('.todo-item', `${value} progress`).within(() => {
          cy.contains('.category-badge', label).should('exist')
        })
      })
    })
  })

  describe('UI State Consistency', () => {
    it('should maintain UI state when switching views', () => {
      cy.addTodo('Active todo')
      cy.completeTodo('Active todo')
      
      cy.goToArchive()
      cy.todoShouldExist('Active todo')
      
      cy.goToActiveTodos()
      cy.todoShouldNotExist('Active todo')
      cy.contains('.empty-message', 'No todos yet').should('be.visible')
    })

    it('should clear input after adding todo', () => {
      cy.get('.todo-input').type('Test todo')
      cy.get('.submit-button').click()
      cy.get('.todo-input').should('have.value', '')
    })

    it('should reset categories after adding todo', () => {
      cy.get('.todo-input').type('Test')
      cy.get('#priority-select').select('high')
      cy.get('.submit-button').click()
      
      cy.get('#priority-select').should('have.value', 'medium')
      cy.get('#time-select').should('have.value', 'today')
      cy.get('#progress-select').should('have.value', 'not-started')
    })

    it('should persist search text when switching views', () => {
      cy.addTodo('Test todo')
      cy.completeTodo('Test todo')
      
      cy.get('.search-input').type('Test')
      cy.goToArchive()
      cy.get('.search-input').should('have.value', 'Test')
      cy.todoShouldExist('Test todo')
    })

    it('should persist filter settings when switching views', () => {
      cy.addTodo('High priority', { priority: 'high' })
      cy.completeTodo('High priority')
      
      cy.get('#filter-priority').select('high')
      cy.goToArchive()
      cy.get('#filter-priority').should('have.value', 'high')
      cy.todoShouldExist('High priority')
    })
  })
})
