describe('Todo App - Basic CRUD Operations', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display the app title and initial UI', () => {
    cy.contains('h1', 'Todo App').should('be.visible')
    cy.get('.todo-input').should('be.visible')
    cy.get('.submit-button').should('contain', 'Add Todo')
    cy.contains('.empty-message', 'No todos yet').should('be.visible')
  })

  it('should add a new todo with default categories', () => {
    const todoText = 'Buy groceries'
    
    cy.addTodo(todoText)
    cy.todoShouldExist(todoText)
    
    // Verify default categories are displayed
    cy.contains('.todo-item', todoText).within(() => {
      cy.contains('.category-badge', 'Medium').should('exist')
      cy.contains('.category-badge', 'Today').should('exist')
      cy.contains('.category-badge', 'Not Started').should('exist')
    })
  })

  it('should add a todo with custom categories', () => {
    const todoText = 'Important meeting'
    
    cy.addTodo(todoText, {
      priority: 'high',
      time: 'this-week',
      progress: 'in-progress'
    })
    
    cy.todoShouldExist(todoText)
    cy.contains('.todo-item', todoText).within(() => {
      cy.contains('.category-badge', 'High').should('exist')
      cy.contains('.category-badge', 'This Week').should('exist')
      cy.contains('.category-badge', 'In Progress').should('exist')
    })
  })

  it('should add multiple todos', () => {
    cy.addTodo('First todo')
    cy.addTodo('Second todo')
    cy.addTodo('Third todo')
    
    cy.get('.todo-item').should('have.length', 3)
    cy.todoShouldExist('First todo')
    cy.todoShouldExist('Second todo')
    cy.todoShouldExist('Third todo')
  })

  it('should not add empty todos', () => {
    cy.get('.todo-input').type('   ')
    cy.get('.submit-button').click()
    
    cy.get('.todo-item').should('have.length', 0)
    cy.contains('.empty-message', 'No todos yet').should('be.visible')
  })

  it('should trim whitespace from todo text', () => {
    cy.get('.todo-input').type('   Todo with spaces   ')
    cy.get('.submit-button').click()
    
    cy.get('.todo-text').should('contain', 'Todo with spaces')
    cy.get('.todo-text').should('not.contain', '   Todo with spaces   ')
  })

  it('should delete a todo', () => {
    cy.addTodo('Todo to delete')
    cy.todoShouldExist('Todo to delete')
    
    cy.deleteTodo('Todo to delete')
    cy.todoShouldNotExist('Todo to delete')
    cy.contains('.empty-message', 'No todos yet').should('be.visible')
  })

  it('should update the todo count in the view toggle', () => {
    cy.contains('.toggle-button', 'Active Todos (0)').should('exist')
    
    cy.addTodo('First todo')
    cy.contains('.toggle-button', 'Active Todos (1)').should('exist')
    
    cy.addTodo('Second todo')
    cy.contains('.toggle-button', 'Active Todos (2)').should('exist')
  })
})
