import TodoList from '../../src/components/TodoList'

describe('TodoList Component', () => {
  const sampleTodos = [
    {
      id: '1',
      text: 'First todo',
      categories: { priority: 'high', time: 'today', progress: 'in-progress' }
    },
    {
      id: '2',
      text: 'Second todo',
      categories: { priority: 'medium', time: 'this-week', progress: 'not-started' }
    },
    {
      id: '3',
      text: 'Third todo',
      categories: { priority: 'low', time: 'later', progress: 'blocked' }
    }
  ]

  const defaultEditCategories = {
    priority: 'medium',
    time: 'today',
    progress: 'not-started'
  }

  it('renders all todos in the list', () => {
    cy.mount(
      <TodoList
        todos={sampleTodos}
        editingId={null}
        editValue=""
        editCategories={defaultEditCategories}
        isArchived={false}
        onEdit={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
        onEditValueChange={() => {}}
        onEditCategoryChange={() => {}}
        onComplete={() => {}}
        onDelete={() => {}}
        onRestore={() => {}}
      />
    )
    cy.get('.todo-list .todo-item').should('have.length', 3)
    cy.contains('First todo').should('be.visible')
    cy.contains('Second todo').should('be.visible')
    cy.contains('Third todo').should('be.visible')
  })

  it('displays correct count text for incomplete todos (singular)', () => {
    cy.mount(
      <TodoList
        todos={[sampleTodos[0]]}
        editingId={null}
        editValue=""
        editCategories={defaultEditCategories}
        isArchived={false}
        onEdit={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
        onEditValueChange={() => {}}
        onEditCategoryChange={() => {}}
        onComplete={() => {}}
        onDelete={() => {}}
        onRestore={() => {}}
      />
    )
    cy.get('.todo-count').should('contain', '1 incomplete todo')
  })

  it('displays correct count text for incomplete todos (plural)', () => {
    cy.mount(
      <TodoList
        todos={sampleTodos}
        editingId={null}
        editValue=""
        editCategories={defaultEditCategories}
        isArchived={false}
        onEdit={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
        onEditValueChange={() => {}}
        onEditCategoryChange={() => {}}
        onComplete={() => {}}
        onDelete={() => {}}
        onRestore={() => {}}
      />
    )
    cy.get('.todo-count').should('contain', '3 incomplete todos')
  })

  it('displays correct count text for archived todos (singular)', () => {
    cy.mount(
      <TodoList
        todos={[sampleTodos[0]]}
        editingId={null}
        editValue=""
        editCategories={defaultEditCategories}
        isArchived={true}
        onEdit={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
        onEditValueChange={() => {}}
        onEditCategoryChange={() => {}}
        onComplete={() => {}}
        onDelete={() => {}}
        onRestore={() => {}}
      />
    )
    cy.get('.todo-count').should('contain', '1 completed todo')
  })

  it('displays correct count text for archived todos (plural)', () => {
    cy.mount(
      <TodoList
        todos={sampleTodos}
        editingId={null}
        editValue=""
        editCategories={defaultEditCategories}
        isArchived={true}
        onEdit={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
        onEditValueChange={() => {}}
        onEditCategoryChange={() => {}}
        onComplete={() => {}}
        onDelete={() => {}}
        onRestore={() => {}}
      />
    )
    cy.get('.todo-count').should('contain', '3 completed todos')
  })

  it('renders empty list when no todos', () => {
    cy.mount(
      <TodoList
        todos={[]}
        editingId={null}
        editValue=""
        editCategories={defaultEditCategories}
        isArchived={false}
        onEdit={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
        onEditValueChange={() => {}}
        onEditCategoryChange={() => {}}
        onComplete={() => {}}
        onDelete={() => {}}
        onRestore={() => {}}
      />
    )
    cy.get('.todo-count').should('contain', '0 incomplete todos')
    cy.get('.todo-list .todo-item').should('have.length', 0)
  })

  it('passes correct isEditing prop to specific todo item', () => {
    cy.mount(
      <TodoList
        todos={sampleTodos}
        editingId="2"
        editValue="Editing second todo"
        editCategories={defaultEditCategories}
        isArchived={false}
        onEdit={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
        onEditValueChange={() => {}}
        onEditCategoryChange={() => {}}
        onComplete={() => {}}
        onDelete={() => {}}
        onRestore={() => {}}
      />
    )
    // Should have edit input visible for the second todo
    cy.get('.edit-input').should('exist')
    cy.get('.edit-input').should('have.value', 'Editing second todo')
  })

  it('renders archived todos with proper archived status', () => {
    cy.mount(
      <TodoList
        todos={sampleTodos}
        editingId={null}
        editValue=""
        editCategories={defaultEditCategories}
        isArchived={true}
        onEdit={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
        onEditValueChange={() => {}}
        onEditCategoryChange={() => {}}
        onComplete={() => {}}
        onDelete={() => {}}
        onRestore={() => {}}
      />
    )
    cy.get('.todo-item').each(($item) => {
      cy.wrap($item).should('have.class', 'archived')
    })
  })

  it('passes all handlers correctly to todo items', () => {
    const handlers = {
      onEdit: cy.spy().as('onEdit'),
      onSave: cy.spy().as('onSave'),
      onCancel: cy.spy().as('onCancel'),
      onEditValueChange: cy.spy().as('onEditValueChange'),
      onEditCategoryChange: cy.spy().as('onEditCategoryChange'),
      onComplete: cy.spy().as('onComplete'),
      onDelete: cy.spy().as('onDelete'),
      onRestore: cy.spy().as('onRestore')
    }

    cy.mount(
      <TodoList
        todos={sampleTodos}
        editingId={null}
        editValue=""
        editCategories={defaultEditCategories}
        isArchived={false}
        {...handlers}
      />
    )

    // Test that handlers are called
    cy.get('.todo-item').first().find('.edit-button').click()
    cy.get('@onEdit').should('have.been.called')
  })

  it('renders correct number of todo items with unique keys', () => {
    cy.mount(
      <TodoList
        todos={sampleTodos}
        editingId={null}
        editValue=""
        editCategories={defaultEditCategories}
        isArchived={false}
        onEdit={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
        onEditValueChange={() => {}}
        onEditCategoryChange={() => {}}
        onComplete={() => {}}
        onDelete={() => {}}
        onRestore={() => {}}
      />
    )
    // Each todo should have unique content
    cy.contains('First todo').should('exist')
    cy.contains('Second todo').should('exist')
    cy.contains('Third todo').should('exist')
  })
})

describe('TodoList Component - Edge Cases', () => {
  const defaultEditCategories = {
    priority: 'medium',
    time: 'today',
    progress: 'not-started'
  }

  it('handles todos without categories', () => {
    const todosWithoutCategories = [
      { id: '1', text: 'Todo without categories', categories: null },
      { id: '2', text: 'Another todo', categories: {} }
    ]

    cy.mount(
      <TodoList
        todos={todosWithoutCategories}
        editingId={null}
        editValue=""
        editCategories={defaultEditCategories}
        isArchived={false}
        onEdit={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
        onEditValueChange={() => {}}
        onEditCategoryChange={() => {}}
        onComplete={() => {}}
        onDelete={() => {}}
        onRestore={() => {}}
      />
    )
    cy.get('.todo-item').should('have.length', 2)
    cy.contains('Todo without categories').should('be.visible')
    cy.contains('Another todo').should('be.visible')
  })

  it('handles mix of archived and category states', () => {
    const mixedTodos = [
      { id: '1', text: 'Normal todo', categories: { priority: 'high' } },
      { id: '2', text: 'No categories', categories: null },
      { id: '3', text: 'Empty categories', categories: {} }
    ]

    cy.mount(
      <TodoList
        todos={mixedTodos}
        editingId={null}
        editValue=""
        editCategories={defaultEditCategories}
        isArchived={true}
        onEdit={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
        onEditValueChange={() => {}}
        onEditCategoryChange={() => {}}
        onComplete={() => {}}
        onDelete={() => {}}
        onRestore={() => {}}
      />
    )
    cy.get('.todo-item').should('have.length', 3)
    cy.get('.todo-item.archived').should('have.length', 3)
  })

  it('handles zero todos with inactive state', () => {
    cy.mount(
      <TodoList
        todos={[]}
        editingId={null}
        editValue=""
        editCategories={defaultEditCategories}
        isArchived={false}
        onEdit={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
        onEditValueChange={() => {}}
        onEditCategoryChange={() => {}}
        onComplete={() => {}}
        onDelete={() => {}}
        onRestore={() => {}}
      />
    )
    cy.get('.todo-count').should('contain', '0 incomplete todos')
  })

  it('handles zero todos with archived state', () => {
    cy.mount(
      <TodoList
        todos={[]}
        editingId={null}
        editValue=""
        editCategories={defaultEditCategories}
        isArchived={true}
        onEdit={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
        onEditValueChange={() => {}}
        onEditCategoryChange={() => {}}
        onComplete={() => {}}
        onDelete={() => {}}
        onRestore={() => {}}
      />
    )
    cy.get('.todo-count').should('contain', '0 completed todos')
  })

  it('handles large number of todos', () => {
    const manyTodos = Array.from({ length: 50 }, (_, i) => ({
      id: `${i + 1}`,
      text: `Todo ${i + 1}`,
      categories: { priority: 'medium' }
    }))

    cy.mount(
      <TodoList
        todos={manyTodos}
        editingId={null}
        editValue=""
        editCategories={defaultEditCategories}
        isArchived={false}
        onEdit={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
        onEditValueChange={() => {}}
        onEditCategoryChange={() => {}}
        onComplete={() => {}}
        onDelete={() => {}}
        onRestore={() => {}}
      />
    )
    cy.get('.todo-count').should('contain', '50 incomplete todos')
    cy.get('.todo-item').should('have.length', 50)
  })

  it('maintains editing state correctly across multiple todos', () => {
    const todos = [
      { id: '1', text: 'First', categories: {} },
      { id: '2', text: 'Second', categories: {} },
      { id: '3', text: 'Third', categories: {} }
    ]

    cy.mount(
      <TodoList
        todos={todos}
        editingId="2"
        editValue="Editing second"
        editCategories={defaultEditCategories}
        isArchived={false}
        onEdit={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
        onEditValueChange={() => {}}
        onEditCategoryChange={() => {}}
        onComplete={() => {}}
        onDelete={() => {}}
        onRestore={() => {}}
      />
    )
    // Only one edit input should be visible
    cy.get('.edit-input').should('have.length', 1)
    cy.get('.edit-input').should('have.value', 'Editing second')
    // Other todos should show normal view
    cy.contains('.todo-text', 'First').should('exist')
    cy.contains('.todo-text', 'Third').should('exist')
  })
})
