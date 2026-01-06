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

describe('Header Component - Edge Cases', () => {
  it('handles rapid theme toggle clicks', () => {
    const onThemeToggleSpy = cy.spy().as('onThemeToggleSpy')
    cy.mount(<Header theme="light" onThemeToggle={onThemeToggleSpy} />)
    cy.get('.theme-toggle').click()
    cy.get('.theme-toggle').click()
    cy.get('.theme-toggle').click()
    cy.get('@onThemeToggleSpy').should('have.callCount', 3)
  })

  it('maintains structure with different theme values', () => {
    const themes = ['light', 'dark']
    themes.forEach(theme => {
      cy.mount(<Header theme={theme} onThemeToggle={() => {}} />)
      cy.get('.header-with-theme').should('exist')
      cy.get('h1').should('contain', 'Todo App')
      cy.get('.theme-toggle').should('exist')
    })
  })

  it('theme toggle button is focusable', () => {
    cy.mount(<Header theme="light" onThemeToggle={() => {}} />)
    cy.get('.theme-toggle').focus()
    cy.get('.theme-toggle').should('be.focused')
  })

  it('theme toggle works with keyboard (Enter)', () => {
    const onThemeToggleSpy = cy.spy().as('onThemeToggleSpy')
    cy.mount(<Header theme="light" onThemeToggle={onThemeToggleSpy} />)
    cy.get('.theme-toggle').focus().type('{enter}')
    cy.get('@onThemeToggleSpy').should('have.been.calledOnce')
  })

  it('theme toggle works with keyboard (Space)', () => {
    const onThemeToggleSpy = cy.spy().as('onThemeToggleSpy')
    cy.mount(<Header theme="light" onThemeToggle={onThemeToggleSpy} />)
    cy.get('.theme-toggle').focus().type(' ')
    cy.get('@onThemeToggleSpy').should('have.been.calledOnce')
  })

  it('displays correct icon for undefined theme (defaults gracefully)', () => {
    cy.mount(<Header theme={undefined} onThemeToggle={() => {}} />)
    cy.get('.theme-toggle').should('exist')
    // When theme is undefined (not 'light'), sun icon is shown
    cy.get('.theme-toggle').should('contain', '☀️')
  })

  it('displays correct icon for empty string theme', () => {
    cy.mount(<Header theme="" onThemeToggle={() => {}} />)
    cy.get('.theme-toggle').should('exist')
    // When theme is empty string (not 'light'), sun icon is shown
    cy.get('.theme-toggle').should('contain', '☀️')
  })

  it('header maintains layout structure', () => {
    cy.mount(<Header theme="light" onThemeToggle={() => {}} />)
    cy.get('.header-with-theme').within(() => {
      cy.get('h1').should('exist')
      cy.get('.theme-toggle').should('exist')
    })
  })
})
