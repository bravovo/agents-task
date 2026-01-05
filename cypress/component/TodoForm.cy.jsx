import TodoForm from '../../src/components/TodoForm'

describe('TodoForm Component', () => {
  const defaultCategories = {
    priority: 'medium',
    time: 'today',
    progress: 'not-started'
  }

  it('renders input field with correct placeholder', () => {
    cy.mount(
      <TodoForm
        inputValue=""
        onInputChange={() => {}}
        selectedCategories={defaultCategories}
        onCategoryChange={() => {}}
        onSubmit={() => {}}
      />
    )
    cy.get('.todo-input').should('have.attr', 'placeholder', 'Enter a new todo...')
  })

  it('displays input value correctly', () => {
    cy.mount(
      <TodoForm
        inputValue="Test todo"
        onInputChange={() => {}}
        selectedCategories={defaultCategories}
        onCategoryChange={() => {}}
        onSubmit={() => {}}
      />
    )
    cy.get('.todo-input').should('have.value', 'Test todo')
  })

  it('calls onInputChange when typing in input field', () => {
    const onInputChangeSpy = cy.spy().as('onInputChangeSpy')
    cy.mount(
      <TodoForm
        inputValue=""
        onInputChange={onInputChangeSpy}
        selectedCategories={defaultCategories}
        onCategoryChange={() => {}}
        onSubmit={() => {}}
      />
    )
    cy.get('.todo-input').type('New todo')
    cy.get('@onInputChangeSpy').should('have.been.called')
  })

  it('renders all three category selects', () => {
    cy.mount(
      <TodoForm
        inputValue=""
        onInputChange={() => {}}
        selectedCategories={defaultCategories}
        onCategoryChange={() => {}}
        onSubmit={() => {}}
      />
    )
    cy.get('#priority-select').should('exist')
    cy.get('#time-select').should('exist')
    cy.get('#progress-select').should('exist')
  })

  it('displays selected category values', () => {
    cy.mount(
      <TodoForm
        inputValue=""
        onInputChange={() => {}}
        selectedCategories={{
          priority: 'high',
          time: 'this-week',
          progress: 'in-progress'
        }}
        onCategoryChange={() => {}}
        onSubmit={() => {}}
      />
    )
    cy.get('#priority-select').should('have.value', 'high')
    cy.get('#time-select').should('have.value', 'this-week')
    cy.get('#progress-select').should('have.value', 'in-progress')
  })

  it('calls onCategoryChange when changing priority', () => {
    const onCategoryChangeSpy = cy.spy().as('onCategoryChangeSpy')
    cy.mount(
      <TodoForm
        inputValue=""
        onInputChange={() => {}}
        selectedCategories={defaultCategories}
        onCategoryChange={onCategoryChangeSpy}
        onSubmit={() => {}}
      />
    )
    cy.get('#priority-select').select('low')
    cy.get('@onCategoryChangeSpy').should('have.been.calledWith', 'priority', 'low')
  })

  it('calls onCategoryChange when changing time', () => {
    const onCategoryChangeSpy = cy.spy().as('onCategoryChangeSpy')
    cy.mount(
      <TodoForm
        inputValue=""
        onInputChange={() => {}}
        selectedCategories={defaultCategories}
        onCategoryChange={onCategoryChangeSpy}
        onSubmit={() => {}}
      />
    )
    cy.get('#time-select').select('later')
    cy.get('@onCategoryChangeSpy').should('have.been.calledWith', 'time', 'later')
  })

  it('calls onCategoryChange when changing progress', () => {
    const onCategoryChangeSpy = cy.spy().as('onCategoryChangeSpy')
    cy.mount(
      <TodoForm
        inputValue=""
        onInputChange={() => {}}
        selectedCategories={defaultCategories}
        onCategoryChange={onCategoryChangeSpy}
        onSubmit={() => {}}
      />
    )
    cy.get('#progress-select').select('blocked')
    cy.get('@onCategoryChangeSpy').should('have.been.calledWith', 'progress', 'blocked')
  })

  it('renders submit button with correct text', () => {
    cy.mount(
      <TodoForm
        inputValue=""
        onInputChange={() => {}}
        selectedCategories={defaultCategories}
        onCategoryChange={() => {}}
        onSubmit={() => {}}
      />
    )
    cy.get('.submit-button').should('contain', 'Add Todo')
  })

  it('calls onSubmit when form is submitted', () => {
    const onSubmitSpy = cy.spy().as('onSubmitSpy')
    cy.mount(
      <TodoForm
        inputValue="Test todo"
        onInputChange={() => {}}
        selectedCategories={defaultCategories}
        onCategoryChange={() => {}}
        onSubmit={onSubmitSpy}
      />
    )
    cy.get('.todo-form').submit()
    cy.get('@onSubmitSpy').should('have.been.called')
  })

  it('calls onSubmit when submit button is clicked', () => {
    const onSubmitSpy = cy.spy().as('onSubmitSpy')
    cy.mount(
      <TodoForm
        inputValue="Test todo"
        onInputChange={() => {}}
        selectedCategories={defaultCategories}
        onCategoryChange={() => {}}
        onSubmit={onSubmitSpy}
      />
    )
    cy.get('.submit-button').click()
    cy.get('@onSubmitSpy').should('have.been.called')
  })

  it('has correct form structure', () => {
    cy.mount(
      <TodoForm
        inputValue=""
        onInputChange={() => {}}
        selectedCategories={defaultCategories}
        onCategoryChange={() => {}}
        onSubmit={() => {}}
      />
    )
    cy.get('.todo-form').should('exist')
    cy.get('.todo-form input[type="text"]').should('exist')
    cy.get('.todo-form button[type="submit"]').should('exist')
  })
})
