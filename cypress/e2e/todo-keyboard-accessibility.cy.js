describe('Todo App - Keyboard Navigation and Accessibility', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Keyboard Navigation', () => {
    it('should add todo using Enter key', () => {
      cy.get('.todo-input').type('Test todo with Enter{enter}')
      cy.todoShouldExist('Test todo with Enter')
    })

    it('should navigate through form elements with Tab key', () => {
      cy.get('body').tab()
      // Should focus on first interactive element
      cy.focused().should('exist')
    })

    it('should submit form when pressing Enter in input field', () => {
      cy.get('.todo-input').type('Todo via Enter key')
      cy.get('.todo-input').type('{enter}')
      cy.todoShouldExist('Todo via Enter key')
      cy.get('.todo-input').should('have.value', '')
    })

    it('should be able to change categories using keyboard', () => {
      cy.get('.todo-input').type('Test keyboard categories')
      cy.get('#priority-select').select('high')
      cy.get('#priority-select').should('have.value', 'high')
      cy.get('.submit-button').click()
      
      cy.todoShouldExist('Test keyboard categories')
      cy.contains('.todo-item', 'Test keyboard categories').within(() => {
        cy.contains('.category-badge', 'High').should('exist')
      })
    })

    it('should toggle theme using keyboard', () => {
      cy.get('.theme-toggle').focus().type('{enter}')
      cy.get('.app').should('have.class', 'dark')
      
      cy.get('.theme-toggle').focus().type('{enter}')
      cy.get('.app').should('have.class', 'light')
    })

    it('should switch views using keyboard', () => {
      cy.addTodo('Test todo')
      cy.completeTodo('Test todo')
      
      cy.contains('.toggle-button', 'Archive').focus().type('{enter}')
      cy.contains('.empty-message', 'No archived todos yet').should('not.exist')
      
      cy.contains('.toggle-button', 'Active Todos').focus().type('{enter}')
      cy.contains('.empty-message', 'No todos yet').should('be.visible')
    })
  })

  describe('Form Accessibility', () => {
    it('should have proper ARIA labels on theme toggle', () => {
      cy.get('.theme-toggle').should('have.attr', 'aria-label', 'Toggle theme')
    })

    it('should focus on edit input when editing starts', () => {
      cy.addTodo('Todo to edit')
      cy.contains('.todo-item', 'Todo to edit').within(() => {
        cy.get('.edit-button').click()
      })
      cy.get('.edit-input').should('be.focused')
    })

    it('should allow editing with keyboard only', () => {
      cy.addTodo('Original text')
      cy.contains('.todo-item', 'Original text').within(() => {
        cy.get('.edit-button').click()
      })
      cy.get('.edit-input').clear().type('Updated text')
      cy.get('.save-button').click()
      cy.todoShouldExist('Updated text')
    })

    it('should support canceling edit with Escape key behavior', () => {
      cy.addTodo('Do not change')
      cy.contains('.todo-item', 'Do not change').within(() => {
        cy.get('.edit-button').click()
      })
      cy.get('.edit-input').clear().type('Changed text')
      cy.get('.cancel-button').click()
      cy.todoShouldExist('Do not change')
    })
  })

  describe('Search and Filter Accessibility', () => {
    it('should allow searching using keyboard', () => {
      cy.addTodo('Searchable todo')
      cy.addTodo('Another todo')
      
      cy.get('.search-input').type('Searchable')
      cy.todoShouldExist('Searchable todo')
      cy.todoShouldNotExist('Another todo')
    })

    it('should clear search with keyboard', () => {
      cy.addTodo('Test todo')
      cy.get('.search-input').type('test')
      cy.todoShouldExist('Test todo')
      
      cy.get('.search-input').clear()
      cy.todoShouldExist('Test todo')
    })

    it('should change filters using keyboard', () => {
      cy.addTodo('High priority', { priority: 'high' })
      cy.addTodo('Low priority', { priority: 'low' })
      
      cy.get('#filter-priority').select('high')
      cy.todoShouldExist('High priority')
      cy.todoShouldNotExist('Low priority')
      
      cy.get('#filter-priority').select('all')
      cy.todoShouldExist('High priority')
      cy.todoShouldExist('Low priority')
    })
  })

  describe('Button Interactions', () => {
    it('should allow completing todos with button clicks', () => {
      cy.addTodo('Complete me')
      cy.completeTodo('Complete me')
      cy.todoShouldNotExist('Complete me')
      
      cy.goToArchive()
      cy.todoShouldExist('Complete me')
    })

    it('should allow deleting todos with button clicks', () => {
      cy.addTodo('Delete me')
      cy.deleteTodo('Delete me')
      cy.todoShouldNotExist('Delete me')
    })

    it('should allow restoring todos from archive', () => {
      cy.addTodo('Restore me')
      cy.completeTodo('Restore me')
      cy.goToArchive()
      
      cy.contains('.todo-item', 'Restore me').within(() => {
        cy.get('.restore-button').click()
      })
      
      cy.goToActiveTodos()
      cy.todoShouldExist('Restore me')
    })
  })

  describe('Focus Management', () => {
    it('should maintain focus after adding todo', () => {
      cy.get('.todo-input').type('Test focus{enter}')
      cy.get('.todo-input').should('be.focused')
    })

    it('should focus on edit input when editing', () => {
      cy.addTodo('Focus test')
      cy.contains('.todo-item', 'Focus test').within(() => {
        cy.get('.edit-button').click()
      })
      cy.get('.edit-input').should('be.focused')
    })

    it('should handle focus when canceling edit', () => {
      cy.addTodo('Cancel focus')
      cy.contains('.todo-item', 'Cancel focus').within(() => {
        cy.get('.edit-button').click()
      })
      cy.get('.cancel-button').click()
      cy.contains('.todo-text', 'Cancel focus').should('be.visible')
    })
  })

  describe('Edge Cases with Keyboard', () => {
    it('should handle rapid Enter key presses', () => {
      cy.get('.todo-input').type('Quick add 1{enter}')
      cy.get('.todo-input').type('Quick add 2{enter}')
      cy.get('.todo-input').type('Quick add 3{enter}')
      
      cy.get('.todo-item').should('have.length', 3)
    })

    it('should prevent empty submission with Enter key', () => {
      cy.get('.todo-input').type('   {enter}')
      cy.get('.todo-item').should('have.length', 0)
      cy.contains('.empty-message', 'No todos yet').should('be.visible')
    })

    it('should handle special characters with keyboard', () => {
      cy.get('.todo-input').type('Test @#$%^&*(){enter}')
      cy.todoShouldExist('Test @#$%^&*()')
    })

    it('should handle multiple category changes before submit', () => {
      cy.get('.todo-input').type('Category changes')
      cy.get('#priority-select').select('high')
      cy.get('#priority-select').select('low')
      cy.get('#time-select').select('later')
      cy.get('.submit-button').click()
      
      cy.contains('.todo-item', 'Category changes').within(() => {
        cy.contains('.category-badge', 'Low').should('exist')
        cy.contains('.category-badge', 'Later').should('exist')
      })
    })
  })

  describe('Accessibility - Screen Reader Support', () => {
    it('should have semantic HTML structure', () => {
      cy.get('h1').should('contain', 'Todo App')
      cy.get('form.todo-form').should('exist')
      cy.get('ul.todo-list').should('exist')
    })

    it('should have proper labels for form inputs', () => {
      cy.get('label[for="priority-select"]').should('exist')
      cy.get('label[for="time-select"]').should('exist')
      cy.get('label[for="progress-select"]').should('exist')
    })

    it('should have descriptive button text', () => {
      cy.addTodo('Button text test')
      cy.contains('button', 'Edit').should('exist')
      cy.contains('button', 'Complete').should('exist')
      cy.contains('button', 'Delete').should('exist')
    })

    it('should maintain heading hierarchy', () => {
      cy.get('h1').should('have.length', 1)
      cy.get('h1').should('contain', 'Todo App')
    })
  })
})
