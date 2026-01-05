import Header from '../../src/components/Header'

describe('Header Component', () => {
  it('renders the title correctly', () => {
    cy.mount(<Header theme="light" onThemeToggle={() => {}} />)
    cy.contains('Todo App').should('be.visible')
  })

  it('displays light theme icon (moon) when theme is light', () => {
    cy.mount(<Header theme="light" onThemeToggle={() => {}} />)
    cy.get('.theme-toggle').should('contain', '🌙')
  })

  it('displays dark theme icon (sun) when theme is dark', () => {
    cy.mount(<Header theme="dark" onThemeToggle={() => {}} />)
    cy.get('.theme-toggle').should('contain', '☀️')
  })

  it('calls onThemeToggle when theme button is clicked', () => {
    const onThemeToggleSpy = cy.spy().as('onThemeToggleSpy')
    cy.mount(<Header theme="light" onThemeToggle={onThemeToggleSpy} />)
    cy.get('.theme-toggle').click()
    cy.get('@onThemeToggleSpy').should('have.been.calledOnce')
  })

  it('has correct aria-label on theme toggle button', () => {
    cy.mount(<Header theme="light" onThemeToggle={() => {}} />)
    cy.get('.theme-toggle').should('have.attr', 'aria-label', 'Toggle theme')
  })
})
