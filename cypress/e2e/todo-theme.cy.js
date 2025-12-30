describe('Todo App - Theme Toggle', () => {
  beforeEach(() => {
    cy.visit('/')
    // Clear localStorage before each test to start with default theme
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('should display theme toggle button', () => {
    cy.get('.theme-toggle').should('be.visible')
    cy.get('.theme-toggle').should('have.attr', 'aria-label', 'Toggle theme')
  })

  it('should start with light theme by default', () => {
    cy.get('.theme-toggle').should('contain', '🌙')
    cy.get('.app').should('have.class', 'light')
  })

  it('should toggle to dark theme', () => {
    cy.get('.theme-toggle').click()
    
    cy.get('.theme-toggle').should('contain', '☀️')
    cy.get('.app').should('have.class', 'dark')
    cy.get('body').should('have.class', 'dark-theme')
  })

  it('should toggle back to light theme', () => {
    // Toggle to dark
    cy.get('.theme-toggle').click()
    cy.get('.app').should('have.class', 'dark')
    
    // Toggle back to light
    cy.get('.theme-toggle').click()
    cy.get('.app').should('have.class', 'light')
    cy.get('body').should('not.have.class', 'dark-theme')
  })

  it('should persist theme preference in localStorage', () => {
    cy.get('.theme-toggle').click()
    
    // Verify localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem('todo-app-theme')).to.equal('dark')
    })
  })

  it('should restore theme preference on page reload', () => {
    // Set dark theme
    cy.get('.theme-toggle').click()
    cy.get('.app').should('have.class', 'dark')
    
    // Reload page
    cy.reload()
    
    // Theme should still be dark
    cy.get('.app').should('have.class', 'dark')
    cy.get('.theme-toggle').should('contain', '☀️')
  })

  it('should maintain theme when adding todos', () => {
    cy.get('.theme-toggle').click()
    cy.get('.app').should('have.class', 'dark')
    
    cy.addTodo('Test todo')
    
    cy.get('.app').should('have.class', 'dark')
    cy.todoShouldExist('Test todo')
  })

  it('should maintain theme when switching between views', () => {
    cy.get('.theme-toggle').click()
    cy.get('.app').should('have.class', 'dark')
    
    cy.goToArchive()
    cy.get('.app').should('have.class', 'dark')
    
    cy.goToActiveTodos()
    cy.get('.app').should('have.class', 'dark')
  })
})
