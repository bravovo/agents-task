describe('Todo App - End-to-End Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Main E2E Scenario: Complete Todo Lifecycle', () => {
    it('should complete full lifecycle: create => edit => complete => search in archive => uncomplete => delete', () => {
      // Step 1: Create a todo
      cy.get('input[placeholder="Add a new todo..."]').type('My important task')
      cy.contains('button', 'Add Todo').click()

      // Verify todo was created
      cy.contains('My important task').should('be.visible')
      cy.contains('1 uncompleted todo tasks').should('be.visible')

      // Step 2: Edit todo with new category
      cy.get('button[aria-label="Edit todo"]').click()

      // Change the text
      cy.get('input[placeholder="Edit todo..."]').clear().type('My updated important task')

      // Change priority category from medium to high
      cy.get('.todo-edit-form').within(() => {
        cy.get('label').contains('High').click()
      })

      // Add a time category
      cy.get('.todo-edit-form').within(() => {
        cy.get('label').contains('Urgent').click()
      })

      // Save the edit
      cy.contains('button', /^save$/i).click()

      // Verify todo was updated
      cy.contains('My updated important task').should('be.visible')
      cy.contains('high').should('be.visible')
      cy.contains('urgent').should('be.visible')

      // Step 3: Complete the todo
      cy.get('button[aria-label="Mark as complete"]').click()

      // Verify todo moved to archive
      cy.contains('My updated important task').should('not.exist')
      cy.contains('0 uncompleted todo tasks').should('be.visible')

      // Step 4: Switch to archive view and search for the todo
      cy.contains('button', /^Archive/i).click()

      // Verify archive view
      cy.contains('1 completed todo tasks').should('be.visible')
      cy.contains('My updated important task').should('be.visible')

      // Search for the todo in archive
      cy.get('input[placeholder="Search by text..."]').type('updated important')

      // Verify search results
      cy.contains('My updated important task').should('be.visible')
      cy.contains('1 of 1 completed todo tasks').should('be.visible')

      // Step 5: Uncomplete the todo (restore to active)
      // First clear the search
      cy.contains('button', 'Clear Search').click()

      cy.get('button[aria-label="Mark as incomplete"]').click()

      // Switch back to active view
      cy.contains('button', /^Active Todos/i).click()

      // Verify todo is back in active list
      cy.contains('My updated important task').should('be.visible')
      cy.contains('1 uncompleted todo tasks').should('be.visible')

      // Step 6: Delete the todo from active list
      cy.get('button[aria-label="Delete todo"]').first().click()

      // Verify todo was deleted
      cy.contains('My updated important task').should('not.exist')
      cy.contains('0 uncompleted todo tasks').should('be.visible')
    })
  })

  describe('E2E Scenario: Multiple Todos Workflow', () => {
    it('should handle multiple todos: create multiple => complete some => search and filter => delete multiple', () => {
      // Create multiple todos with different categories
      // Todo 1: High priority, urgent
      cy.get('.todo-form').within(() => {
        cy.get('label').contains('High').click()
        cy.get('label').contains('Urgent').click()
      })
      cy.get('input[placeholder="Add a new todo..."]').type('Urgent task')
      cy.contains('button', 'Add Todo').click()

      // Todo 2: Medium priority, today
      cy.contains('Urgent task').should('be.visible')
      cy.get('.todo-form').within(() => {
        cy.get('label').contains('Today').click()
      })
      cy.get('input[placeholder="Add a new todo..."]').type('Today task')
      cy.contains('button', 'Add Todo').click()

      // Todo 3: Low priority, later
      cy.contains('Today task').should('be.visible')
      cy.get('.todo-form').within(() => {
        cy.get('label').contains('Low').click()
        cy.get('label').contains('Later').click()
      })
      cy.get('input[placeholder="Add a new todo..."]').type('Later task')
      cy.contains('button', 'Add Todo').click()

      // Verify all todos are created
      cy.contains('3 uncompleted todo tasks').should('be.visible')
      cy.contains('Urgent task').should('be.visible')
      cy.contains('Today task').should('be.visible')
      cy.contains('Later task').should('be.visible')

      // Complete the urgent task
      cy.get('button[aria-label="Mark as complete"]').first().click()

      // Complete the today task
      cy.contains('2 uncompleted todo tasks').should('be.visible')
      cy.get('button[aria-label="Mark as complete"]').first().click()

      // Verify only one active todo remains
      cy.contains('1 uncompleted todo tasks').should('be.visible')
      cy.contains('Later task').should('be.visible')
      cy.contains('Urgent task').should('not.exist')
      cy.contains('Today task').should('not.exist')

      // Switch to archive and verify completed todos
      cy.contains('button', /^Archive/i).click()

      cy.contains('2 completed todo tasks').should('be.visible')
      cy.contains('Urgent task').should('be.visible')
      cy.contains('Today task').should('be.visible')

      // Search by category in archive
      cy.get('.search-category-selection').within(() => {
        cy.get('label').contains('High').click()
      })

      // Verify filtered results
      cy.contains('Urgent task').should('be.visible')
      cy.contains('Today task').should('not.exist')
      cy.contains('1 of 2 completed todo tasks').should('be.visible')

      // Clear search
      cy.contains('button', 'Clear Search').click()

      // Delete one todo from archive
      cy.get('button[aria-label="Delete todo"]').first().click()

      cy.contains('1 completed todo tasks').should('be.visible')

      // Switch back to active and delete remaining todo
      cy.contains('button', /^Active Todos/i).click()

      cy.get('button[aria-label="Delete todo"]').click()

      cy.contains('0 uncompleted todo tasks').should('be.visible')
      cy.contains('Later task').should('not.exist')
    })
  })

  describe('E2E Scenario: Search and Filter Workflow', () => {
    it('should search and filter todos across active and archive views', () => {
      // Create todos with different categories
      cy.get('.todo-form').within(() => {
        cy.get('label').contains('High').click()
      })
      cy.get('input[placeholder="Add a new todo..."]').type('High priority task')
      cy.contains('button', 'Add Todo').click()

      cy.contains('High priority task').should('be.visible')

      cy.get('.todo-form').within(() => {
        cy.get('label').contains('Medium').click()
        cy.get('label').contains('Urgent').click()
      })
      cy.get('input[placeholder="Add a new todo..."]').type('Medium urgent task')
      cy.contains('button', 'Add Todo').click()

      cy.contains('Medium urgent task').should('be.visible')

      // Search by text
      cy.get('input[placeholder="Search by text..."]').type('High')

      cy.contains('High priority task').should('be.visible')
      cy.contains('Medium urgent task').should('not.exist')
      cy.contains('1 of 2 uncompleted todo tasks').should('be.visible')

      // Clear text search and filter by category
      cy.get('input[placeholder="Search by text..."]').clear()
      cy.get('.search-category-selection').within(() => {
        cy.get('label').contains('High').click()
      })

      cy.contains('High priority task').should('be.visible')
      cy.contains('Medium urgent task').should('not.exist')

      // Complete the high priority task
      cy.get('button[aria-label="Mark as complete"]').click()

      // Clear search to see all
      cy.contains('button', 'Clear Search').click()

      // Switch to archive
      cy.contains('button', /^Archive/i).click()

      cy.contains('High priority task').should('be.visible')
      cy.contains('1 completed todo tasks').should('be.visible')

      // Search in archive
      cy.get('input[placeholder="Search by text..."]').type('High')

      cy.contains('High priority task').should('be.visible')
      cy.contains('1 of 1 completed todo tasks').should('be.visible')
    })
  })

  describe('E2E Scenario: Category Management Workflow', () => {
    it('should handle category changes during edit and maintain category constraints', () => {
      // Create todo with medium priority
      cy.get('input[placeholder="Add a new todo..."]').type('Category test task')
      cy.contains('button', 'Add Todo').click()

      cy.contains('Category test task').should('be.visible')
      cy.contains('medium').should('be.visible')

      // Edit and change priority
      cy.get('button[aria-label="Edit todo"]').click()

      // Change to critical priority
      cy.get('.todo-edit-form').within(() => {
        cy.get('label').contains('Critical').click()
      })

      // Add progress category
      cy.get('.todo-edit-form').within(() => {
        cy.get('label').contains('In Progress').click()
      })

      // Save
      cy.contains('button', /^save$/i).click()

      // Verify categories changed
      cy.contains('Category test task').should('be.visible')
      cy.contains('critical').should('be.visible')
      cy.contains('in progress').should('be.visible')
      cy.contains('medium').should('not.exist')

      // Edit again and change time category
      cy.get('button[aria-label="Edit todo"]').click()

      // Change to this-week
      cy.get('.todo-edit-form').within(() => {
        cy.get('label').contains('This Week').click()
      })

      // Save
      cy.contains('button', /^save$/i).click()

      // Verify time category added
      cy.contains('this week').should('be.visible')
    })
  })

  describe('E2E Scenario: Edit Cancellation Workflow', () => {
    it('should cancel edit without saving changes', () => {
      cy.get('input[placeholder="Add a new todo..."]').type('Original task')
      cy.contains('button', 'Add Todo').click()

      cy.contains('Original task').should('be.visible')

      // Start editing
      cy.get('button[aria-label="Edit todo"]').click()

      cy.get('input[placeholder="Edit todo..."]').clear().type('Modified task')

      // Cancel edit
      cy.contains('button', /cancel/i).click()

      // Verify original task is still there
      cy.contains('Original task').should('be.visible')
      cy.contains('Modified task').should('not.exist')
    })
  })

  describe('E2E Scenario: Archive to Active and Back', () => {
    it('should move todo between active and archive multiple times', () => {
      cy.get('input[placeholder="Add a new todo..."]').type('Back and forth task')
      cy.contains('button', 'Add Todo').click()

      cy.contains('Back and forth task').should('be.visible')

      // Complete
      cy.get('button[aria-label="Mark as complete"]').click()

      cy.contains('Back and forth task').should('not.exist')

      // Go to archive
      cy.contains('button', /^Archive/i).click()

      cy.contains('Back and forth task').should('be.visible')

      // Uncomplete
      cy.get('button[aria-label="Mark as incomplete"]').click()

      // Back to active
      cy.contains('button', /^Active Todos/i).click()

      cy.contains('Back and forth task').should('be.visible')

      // Complete again
      cy.get('button[aria-label="Mark as complete"]').click()

      // Back to archive
      cy.contains('button', /^Archive/i).click()

      cy.contains('Back and forth task').should('be.visible')
      cy.contains('1 completed todo tasks').should('be.visible')
    })
  })

  describe('E2E Scenario: Empty States and Edge Cases', () => {
    it('should handle empty states correctly when todos are deleted', () => {
      // Verify empty state
      cy.contains('No todos yet. Add one above!').should('be.visible')

      // Create and delete a todo
      cy.get('input[placeholder="Add a new todo..."]').type('Temporary task')
      cy.contains('button', 'Add Todo').click()

      cy.contains('Temporary task').should('be.visible')

      // Delete it
      cy.get('button[aria-label="Delete todo"]').click()

      // Verify empty state again
      cy.contains('No todos yet. Add one above!').should('be.visible')
      cy.contains('0 uncompleted todo tasks').should('be.visible')

      // Create, complete, then delete from archive
      cy.get('input[placeholder="Add a new todo..."]').type('Archive task')
      cy.contains('button', 'Add Todo').click()

      cy.contains('Archive task').should('be.visible')

      cy.get('button[aria-label="Mark as complete"]').click()

      cy.contains('button', /^Archive/i).click()

      cy.contains('Archive task').should('be.visible')

      cy.get('button[aria-label="Delete todo"]').click()

      // Verify archive empty state
      cy.contains('No archived todos yet.').should('be.visible')
      cy.contains('0 completed todo tasks').should('be.visible')
    })

    it('should handle search with no results', () => {
      cy.get('input[placeholder="Add a new todo..."]').type('Test task')
      cy.contains('button', 'Add Todo').click()

      cy.contains('Test task').should('be.visible')

      // Search for something that doesn't exist
      cy.get('input[placeholder="Search by text..."]').type('NonExistentTask')

      cy.contains('No todos match your search criteria.').should('be.visible')
      cy.contains('0 of 1 uncompleted todo tasks').should('be.visible')

      // Clear search
      cy.contains('button', 'Clear Search').click()

      cy.contains('Test task').should('be.visible')
      cy.contains('1 uncompleted todo tasks').should('be.visible')
    })
  })

  describe('E2E Scenario: Theme Toggle Functionality', () => {
    it('should toggle theme from light to dark and persist in localStorage', () => {
      // Verify initial theme is light (default) by checking button
      // When theme is light, button shows moon icon and says "Switch to dark theme"
      cy.get('button[aria-label="Switch to dark theme"]').should('be.visible')
      cy.get('button[aria-label="Switch to dark theme"]').should('contain', '🌙')
      // Also verify data-theme as secondary check
      cy.get('html').should('have.attr', 'data-theme', 'light')

      // Toggle to dark theme
      cy.get('button[aria-label="Switch to dark theme"]').click()

      // Verify theme changed to dark by checking button
      // When theme is dark, button shows sun icon and says "Switch to light theme"
      cy.get('button[aria-label="Switch to light theme"]').should('be.visible')
      cy.get('button[aria-label="Switch to light theme"]').should('contain', '☀️')
      // Also verify data-theme as secondary check
      cy.get('html').should('have.attr', 'data-theme', 'dark')

      // Verify theme is saved to localStorage
      cy.window().then((win) => {
        expect(win.localStorage.getItem('theme')).to.equal('"dark"')
      })
    })

    it('should toggle theme from dark to light', () => {
      // Visit the page first
      cy.visit('/')
      
      // Set dark theme in localStorage after page loads
      cy.window().then((win) => {
        win.localStorage.setItem('theme', JSON.stringify('dark'))
      })
      
      // Reload the page so React picks up the localStorage value
      cy.reload()

      // Verify initial theme is dark by checking button (more reliable than data-theme)
      // When theme is dark, button shows sun icon and says "Switch to light theme"
      cy.get('button[aria-label="Switch to light theme"]').should('be.visible')
      cy.get('button[aria-label="Switch to light theme"]').should('contain', '☀️')
      // Also verify data-theme as secondary check
      cy.get('html').should('have.attr', 'data-theme', 'dark')

      // Toggle to light theme
      cy.get('button[aria-label="Switch to light theme"]').click()

      // Verify theme changed to light by checking button
      // When theme is light, button shows moon icon and says "Switch to dark theme"
      cy.get('button[aria-label="Switch to dark theme"]').should('be.visible')
      cy.get('button[aria-label="Switch to dark theme"]').should('contain', '🌙')
      // Also verify data-theme as secondary check
      cy.get('html').should('have.attr', 'data-theme', 'light')

      // Verify theme is saved to localStorage
      cy.window().then((win) => {
        expect(win.localStorage.getItem('theme')).to.equal('"light"')
      })
    })

    it('should persist theme preference across app re-renders', () => {
      cy.visit('/')

      // Toggle to dark theme
      cy.get('button[aria-label="Switch to dark theme"]').click()

      // Wait for theme to be applied and saved - verify by button state
      cy.get('button[aria-label="Switch to light theme"]').should('be.visible')
      cy.get('button[aria-label="Switch to light theme"]').should('contain', '☀️')
      cy.window().then((win) => {
        expect(win.localStorage.getItem('theme')).to.equal('"dark"')
      })

      // Reload page to simulate app re-render
      cy.reload()

      // Verify theme persists after reload by checking button
      cy.get('button[aria-label="Switch to light theme"]').should('be.visible')
      cy.get('button[aria-label="Switch to light theme"]').should('contain', '☀️')
      // Also verify data-theme as secondary check
      cy.get('html').should('have.attr', 'data-theme', 'dark')
    })

    it('should maintain theme while performing todo operations', () => {
      cy.visit('/')

      // Switch to dark theme
      cy.get('button[aria-label="Switch to dark theme"]').click()

      // Verify theme is dark by checking button
      cy.get('button[aria-label="Switch to light theme"]').should('be.visible')

      // Perform todo operations while in dark theme
      cy.get('input[placeholder="Add a new todo..."]').type('Dark theme todo')
      cy.contains('button', 'Add Todo').click()

      // Verify todo was created and theme is still dark
      cy.contains('Dark theme todo').should('be.visible')
      cy.get('button[aria-label="Switch to light theme"]').should('be.visible')

      // Complete the todo
      cy.get('button[aria-label="Mark as complete"]').click()

      // Verify theme persists after completing todo
      cy.get('button[aria-label="Switch to light theme"]').should('be.visible')

      // Switch to archive view
      cy.contains('button', /^Archive/i).click()

      // Verify theme persists in archive view
      cy.get('button[aria-label="Switch to light theme"]').should('be.visible')
      cy.contains('Dark theme todo').should('be.visible')

      // Toggle back to light theme while in archive
      cy.get('button[aria-label="Switch to light theme"]').click()

      // Verify theme changed and archive still works
      cy.get('button[aria-label="Switch to dark theme"]').should('be.visible')
      cy.contains('Dark theme todo').should('be.visible')
    })

    it('should toggle theme multiple times and maintain state', () => {
      cy.visit('/')

      // Verify initial light theme by checking button
      cy.get('button[aria-label="Switch to dark theme"]').should('be.visible')
      cy.get('button[aria-label="Switch to dark theme"]').should('contain', '🌙')

      // Toggle to dark
      cy.get('button[aria-label="Switch to dark theme"]').click()

      // Verify dark theme by checking button
      cy.get('button[aria-label="Switch to light theme"]').should('be.visible')
      cy.get('button[aria-label="Switch to light theme"]').should('contain', '☀️')

      // Toggle back to light
      cy.get('button[aria-label="Switch to light theme"]').click()

      // Verify light theme by checking button
      cy.get('button[aria-label="Switch to dark theme"]').should('be.visible')
      cy.get('button[aria-label="Switch to dark theme"]').should('contain', '🌙')

      // Toggle to dark again
      cy.get('button[aria-label="Switch to dark theme"]').click()

      // Verify dark theme by checking button
      cy.get('button[aria-label="Switch to light theme"]').should('be.visible')
      cy.get('button[aria-label="Switch to light theme"]').should('contain', '☀️')

      // Verify final state
      cy.get('button[aria-label="Switch to light theme"]').should('be.visible')
    })

    it('should load saved theme preference on initial render', () => {
      // Visit the page first
      cy.visit('/')
      
      // Set dark theme in localStorage after page loads
      cy.window().then((win) => {
        win.localStorage.setItem('theme', JSON.stringify('dark'))
      })
      
      // Reload the page so React picks up the localStorage value
      cy.reload()

      // Wait for React to initialize and verify theme by checking button
      // When theme is dark, button should show sun icon and say "Switch to light theme"
      cy.get('button[aria-label="Switch to light theme"]').should('be.visible')
      cy.get('button[aria-label="Switch to light theme"]').should('contain', '☀️')
      // Also verify data-theme as secondary check
      cy.get('html').should('have.attr', 'data-theme', 'dark')
    })
  })
})

