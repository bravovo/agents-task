import CategorySelect from '../../src/components/CategorySelect'
import { categoryTypes } from '../../src/constants'

describe('CategorySelect Component', () => {
  const priorityConfig = categoryTypes.priority
  const timeConfig = categoryTypes.time
  const progressConfig = categoryTypes.progress

  it('renders label and select with correct ID', () => {
    cy.mount(
      <CategorySelect
        id="test-select"
        type="priority"
        config={priorityConfig}
        value="medium"
        onChange={() => {}}
      />
    )
    cy.contains('Priority:').should('be.visible')
    cy.get('#test-select').should('exist')
  })

  it('displays all priority options', () => {
    cy.mount(
      <CategorySelect
        id="priority-select"
        type="priority"
        config={priorityConfig}
        value="medium"
        onChange={() => {}}
      />
    )
    cy.get('#priority-select option').should('have.length', 3)
    cy.get('#priority-select option[value="high"]').should('contain', 'High')
    cy.get('#priority-select option[value="medium"]').should('contain', 'Medium')
    cy.get('#priority-select option[value="low"]').should('contain', 'Low')
  })

  it('displays all time options', () => {
    cy.mount(
      <CategorySelect
        id="time-select"
        type="time"
        config={timeConfig}
        value="today"
        onChange={() => {}}
      />
    )
    cy.get('#time-select option').should('have.length', 4)
    cy.get('#time-select option[value="today"]').should('contain', 'Today')
    cy.get('#time-select option[value="this-week"]').should('contain', 'This Week')
    cy.get('#time-select option[value="this-month"]').should('contain', 'This Month')
    cy.get('#time-select option[value="later"]').should('contain', 'Later')
  })

  it('displays all progress options', () => {
    cy.mount(
      <CategorySelect
        id="progress-select"
        type="progress"
        config={progressConfig}
        value="not-started"
        onChange={() => {}}
      />
    )
    cy.get('#progress-select option').should('have.length', 3)
    cy.get('#progress-select option[value="not-started"]').should('contain', 'Not Started')
    cy.get('#progress-select option[value="in-progress"]').should('contain', 'In Progress')
    cy.get('#progress-select option[value="blocked"]').should('contain', 'Blocked')
  })

  it('shows selected value correctly', () => {
    cy.mount(
      <CategorySelect
        id="priority-select"
        type="priority"
        config={priorityConfig}
        value="high"
        onChange={() => {}}
      />
    )
    cy.get('#priority-select').should('have.value', 'high')
  })

  it('calls onChange with type and value when selection changes', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy')
    cy.mount(
      <CategorySelect
        id="priority-select"
        type="priority"
        config={priorityConfig}
        value="medium"
        onChange={onChangeSpy}
      />
    )
    cy.get('#priority-select').select('high')
    cy.get('@onChangeSpy').should('have.been.calledWith', 'priority', 'high')
  })

  it('applies custom className when provided', () => {
    cy.mount(
      <CategorySelect
        id="priority-select"
        type="priority"
        config={priorityConfig}
        value="medium"
        onChange={() => {}}
        className="custom-select-class"
      />
    )
    cy.get('#priority-select').should('have.class', 'custom-select-class')
  })

  it('applies default className when not provided', () => {
    cy.mount(
      <CategorySelect
        id="priority-select"
        type="priority"
        config={priorityConfig}
        value="medium"
        onChange={() => {}}
      />
    )
    cy.get('#priority-select').should('have.class', 'category-select')
  })
})
