import ViewToggle from '../../src/components/ViewToggle'

describe('ViewToggle Component', () => {
  it('renders both toggle buttons', () => {
    cy.mount(
      <ViewToggle 
        showArchive={false} 
        onToggle={() => {}} 
        todosCount={5} 
        archiveCount={3} 
      />
    )
    cy.contains('Active Todos (5)').should('be.visible')
    cy.contains('Archive (3)').should('be.visible')
  })

  it('shows active button as active when showArchive is false', () => {
    cy.mount(
      <ViewToggle 
        showArchive={false} 
        onToggle={() => {}} 
        todosCount={5} 
        archiveCount={3} 
      />
    )
    cy.contains('button', 'Active Todos (5)').should('have.class', 'active')
    cy.contains('button', 'Archive (3)').should('not.have.class', 'active')
  })

  it('shows archive button as active when showArchive is true', () => {
    cy.mount(
      <ViewToggle 
        showArchive={true} 
        onToggle={() => {}} 
        todosCount={5} 
        archiveCount={3} 
      />
    )
    cy.contains('button', 'Active Todos (5)').should('not.have.class', 'active')
    cy.contains('button', 'Archive (3)').should('have.class', 'active')
  })

  it('calls onToggle with false when active button is clicked', () => {
    const onToggleSpy = cy.spy().as('onToggleSpy')
    cy.mount(
      <ViewToggle 
        showArchive={true} 
        onToggle={onToggleSpy} 
        todosCount={5} 
        archiveCount={3} 
      />
    )
    cy.contains('Active Todos (5)').click()
    cy.get('@onToggleSpy').should('have.been.calledWith', false)
  })

  it('calls onToggle with true when archive button is clicked', () => {
    const onToggleSpy = cy.spy().as('onToggleSpy')
    cy.mount(
      <ViewToggle 
        showArchive={false} 
        onToggle={onToggleSpy} 
        todosCount={5} 
        archiveCount={3} 
      />
    )
    cy.contains('Archive (3)').click()
    cy.get('@onToggleSpy').should('have.been.calledWith', true)
  })

  it('displays correct counts', () => {
    cy.mount(
      <ViewToggle 
        showArchive={false} 
        onToggle={() => {}} 
        todosCount={10} 
        archiveCount={7} 
      />
    )
    cy.contains('Active Todos (10)').should('be.visible')
    cy.contains('Archive (7)').should('be.visible')
  })

  it('handles zero counts', () => {
    cy.mount(
      <ViewToggle 
        showArchive={false} 
        onToggle={() => {}} 
        todosCount={0} 
        archiveCount={0} 
      />
    )
    cy.contains('Active Todos (0)').should('be.visible')
    cy.contains('Archive (0)').should('be.visible')
  })
})

describe('ViewToggle Component - Edge Cases', () => {
  it('handles large todo counts', () => {
    cy.mount(
      <ViewToggle 
        showArchive={false} 
        onToggle={() => {}} 
        todosCount={999} 
        archiveCount={888} 
      />
    )
    cy.contains('Active Todos (999)').should('be.visible')
    cy.contains('Archive (888)').should('be.visible')
  })

  it('handles clicking already active button', () => {
    const onToggleSpy = cy.spy().as('onToggleSpy')
    cy.mount(
      <ViewToggle 
        showArchive={false} 
        onToggle={onToggleSpy} 
        todosCount={5} 
        archiveCount={3} 
      />
    )
    // Click the already active button
    cy.contains('Active Todos (5)').click()
    cy.get('@onToggleSpy').should('have.been.calledWith', false)
  })

  it('handles rapid toggle clicks', () => {
    const onToggleSpy = cy.spy().as('onToggleSpy')
    cy.mount(
      <ViewToggle 
        showArchive={false} 
        onToggle={onToggleSpy} 
        todosCount={5} 
        archiveCount={3} 
      />
    )
    cy.contains('Archive (3)').click()
    cy.contains('Active Todos (5)').click()
    cy.contains('Archive (3)').click()
    cy.get('@onToggleSpy').should('have.callCount', 3)
  })

  it('buttons are keyboard accessible', () => {
    cy.mount(
      <ViewToggle 
        showArchive={false} 
        onToggle={() => {}} 
        todosCount={5} 
        archiveCount={3} 
      />
    )
    cy.contains('Active Todos (5)').focus()
    cy.contains('Active Todos (5)').should('be.focused')
  })

  it('maintains correct active state during count updates', () => {
    cy.mount(
      <ViewToggle 
        showArchive={false} 
        onToggle={() => {}} 
        todosCount={5} 
        archiveCount={3} 
      />
    )
    cy.contains('button', 'Active Todos (5)').should('have.class', 'active')
    
    // Remount with different counts but same active state
    cy.mount(
      <ViewToggle 
        showArchive={false} 
        onToggle={() => {}} 
        todosCount={10} 
        archiveCount={8} 
      />
    )
    cy.contains('button', 'Active Todos (10)').should('have.class', 'active')
  })

  it('handles counts with different magnitudes', () => {
    const scenarios = [
      { todos: 0, archive: 100 },
      { todos: 50, archive: 0 },
      { todos: 1, archive: 1 },
      { todos: 1000, archive: 2000 }
    ]

    scenarios.forEach(({ todos, archive }) => {
      cy.mount(
        <ViewToggle 
          showArchive={false} 
          onToggle={() => {}} 
          todosCount={todos} 
          archiveCount={archive} 
        />
      )
      cy.contains(`Active Todos (${todos})`).should('exist')
      cy.contains(`Archive (${archive})`).should('exist')
    })
  })

  it('renders with correct CSS classes', () => {
    cy.mount(
      <ViewToggle 
        showArchive={false} 
        onToggle={() => {}} 
        todosCount={5} 
        archiveCount={3} 
      />
    )
    cy.get('.view-toggle').should('exist')
    cy.get('.toggle-button').should('have.length', 2)
  })

  it('toggle buttons work with keyboard navigation (Tab)', () => {
    cy.mount(
      <ViewToggle 
        showArchive={false} 
        onToggle={() => {}} 
        todosCount={5} 
        archiveCount={3} 
      />
    )
    cy.get('body').tab()
    cy.focused().should('contain', 'Active Todos (5)')
    cy.focused().tab()
    cy.focused().should('contain', 'Archive (3)')
  })

  it('toggle buttons work with keyboard activation (Enter)', () => {
    const onToggleSpy = cy.spy().as('onToggleSpy')
    cy.mount(
      <ViewToggle 
        showArchive={false} 
        onToggle={onToggleSpy} 
        todosCount={5} 
        archiveCount={3} 
      />
    )
    cy.contains('Archive (3)').focus().type('{enter}')
    cy.get('@onToggleSpy').should('have.been.calledWith', true)
  })
})
