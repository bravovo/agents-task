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
    cy.contains('Active Todos (5)').parent().should('have.class', 'active')
    cy.contains('Archive (3)').parent().should('not.have.class', 'active')
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
    cy.contains('Active Todos (5)').parent().should('not.have.class', 'active')
    cy.contains('Archive (3)').parent().should('have.class', 'active')
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
