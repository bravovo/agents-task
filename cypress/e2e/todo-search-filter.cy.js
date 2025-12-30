describe('Todo App - Search and Filter', () => {
  beforeEach(() => {
    cy.visit('/')
    
    // Add test todos with different categories
    cy.addTodo('Buy groceries', {
      priority: 'high',
      time: 'today',
      progress: 'not-started'
    })
    cy.addTodo('Plan vacation', {
      priority: 'low',
      time: 'later',
      progress: 'in-progress'
    })
    cy.addTodo('Fix bug', {
      priority: 'high',
      time: 'today',
      progress: 'blocked'
    })
    cy.addTodo('Write documentation', {
      priority: 'medium',
      time: 'this-week',
      progress: 'not-started'
    })
  })

  it('should search todos by text', () => {
    cy.get('.search-input').type('bug')
    
    cy.todoShouldExist('Fix bug')
    cy.todoShouldNotExist('Buy groceries')
    cy.todoShouldNotExist('Plan vacation')
    cy.todoShouldNotExist('Write documentation')
  })

  it('should search todos case-insensitively', () => {
    cy.get('.search-input').type('BUY')
    
    cy.todoShouldExist('Buy groceries')
    cy.get('.todo-item').should('have.length', 1)
  })

  it('should show all todos when search is cleared', () => {
    cy.get('.search-input').type('bug')
    cy.todoShouldExist('Fix bug')
    cy.get('.todo-item').should('have.length', 1)
    
    cy.get('.search-input').clear()
    cy.get('.todo-item').should('have.length', 4)
  })

  it('should filter by priority', () => {
    cy.get('#filter-priority').select('high')
    
    cy.todoShouldExist('Buy groceries')
    cy.todoShouldExist('Fix bug')
    cy.todoShouldNotExist('Plan vacation')
    cy.todoShouldNotExist('Write documentation')
    cy.get('.todo-item').should('have.length', 2)
  })

  it('should filter by time', () => {
    cy.get('#filter-time').select('today')
    
    cy.todoShouldExist('Buy groceries')
    cy.todoShouldExist('Fix bug')
    cy.todoShouldNotExist('Plan vacation')
    cy.todoShouldNotExist('Write documentation')
    cy.get('.todo-item').should('have.length', 2)
  })

  it('should filter by progress', () => {
    cy.get('#filter-progress').select('not-started')
    
    cy.todoShouldExist('Buy groceries')
    cy.todoShouldExist('Write documentation')
    cy.todoShouldNotExist('Plan vacation')
    cy.todoShouldNotExist('Fix bug')
    cy.get('.todo-item').should('have.length', 2)
  })

  it('should combine multiple filters', () => {
    cy.get('#filter-priority').select('high')
    cy.get('#filter-time').select('today')
    
    cy.todoShouldExist('Buy groceries')
    cy.todoShouldExist('Fix bug')
    cy.get('.todo-item').should('have.length', 2)
  })

  it('should combine search and filters', () => {
    cy.get('.search-input').type('Buy')
    cy.get('#filter-priority').select('high')
    
    cy.todoShouldExist('Buy groceries')
    cy.get('.todo-item').should('have.length', 1)
  })

  it('should show empty message when no todos match filters', () => {
    cy.get('#filter-priority').select('high')
    cy.get('#filter-progress').select('in-progress')
    
    cy.get('.todo-item').should('have.length', 0)
    cy.contains('.empty-message', 'No todos match your search or filters').should('be.visible')
  })

  it('should reset filters to show all todos', () => {
    cy.get('#filter-priority').select('high')
    cy.get('.todo-item').should('have.length', 2)
    
    cy.get('#filter-priority').select('all')
    cy.get('.todo-item').should('have.length', 4)
  })

  it('should filter archived todos', () => {
    // Complete some todos
    cy.completeTodo('Buy groceries')
    cy.completeTodo('Fix bug')
    
    // Go to archive and apply filter
    cy.goToArchive()
    cy.get('#filter-priority').select('high')
    
    cy.todoShouldExist('Buy groceries')
    cy.todoShouldExist('Fix bug')
    cy.get('.todo-item').should('have.length', 2)
  })

  it('should search archived todos', () => {
    cy.completeTodo('Buy groceries')
    cy.completeTodo('Plan vacation')
    
    cy.goToArchive()
    cy.get('.search-input').type('vacation')
    
    cy.todoShouldExist('Plan vacation')
    cy.todoShouldNotExist('Buy groceries')
    cy.get('.todo-item').should('have.length', 1)
  })
})
