import TodoItem from '../../src/components/TodoItem'

describe('TodoItem Component - View Mode', () => {
  const sampleTodo = {
    id: '1',
    text: 'Test todo item',
    categories: {
      priority: 'high',
      time: 'today',
      progress: 'in-progress'
    }
  }

  it('renders todo text in view mode', () => {
    cy.mount(
      <TodoItem
        todo={sampleTodo}
        isEditing={false}
        editValue=""
        editCategories={{}}
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
    cy.contains('Test todo item').should('be.visible')
  })

  it('displays category badges', () => {
    cy.mount(
      <TodoItem
        todo={sampleTodo}
        isEditing={false}
        editValue=""
        editCategories={{}}
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
    cy.get('.category-badge').should('have.length', 3)
    cy.contains('High').should('be.visible')
    cy.contains('Today').should('be.visible')
    cy.contains('In Progress').should('be.visible')
  })

  it('shows Edit, Complete, and Delete buttons for active todos', () => {
    cy.mount(
      <TodoItem
        todo={sampleTodo}
        isEditing={false}
        editValue=""
        editCategories={{}}
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
    cy.get('.edit-button').should('be.visible')
    cy.get('.complete-button').should('be.visible')
    cy.get('.delete-button').should('be.visible')
  })

  it('calls onEdit with correct parameters when Edit button is clicked', () => {
    const onEditSpy = cy.spy().as('onEditSpy')
    cy.mount(
      <TodoItem
        todo={sampleTodo}
        isEditing={false}
        editValue=""
        editCategories={{}}
        isArchived={false}
        onEdit={onEditSpy}
        onSave={() => {}}
        onCancel={() => {}}
        onEditValueChange={() => {}}
        onEditCategoryChange={() => {}}
        onComplete={() => {}}
        onDelete={() => {}}
        onRestore={() => {}}
      />
    )
    cy.get('.edit-button').click()
    cy.get('@onEditSpy').should('have.been.calledWith', '1', 'Test todo item', sampleTodo.categories)
  })

  it('calls onComplete when Complete button is clicked', () => {
    const onCompleteSpy = cy.spy().as('onCompleteSpy')
    cy.mount(
      <TodoItem
        todo={sampleTodo}
        isEditing={false}
        editValue=""
        editCategories={{}}
        isArchived={false}
        onEdit={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
        onEditValueChange={() => {}}
        onEditCategoryChange={() => {}}
        onComplete={onCompleteSpy}
        onDelete={() => {}}
        onRestore={() => {}}
      />
    )
    cy.get('.complete-button').click()
    cy.get('@onCompleteSpy').should('have.been.calledWith', '1')
  })

  it('calls onDelete when Delete button is clicked', () => {
    const onDeleteSpy = cy.spy().as('onDeleteSpy')
    cy.mount(
      <TodoItem
        todo={sampleTodo}
        isEditing={false}
        editValue=""
        editCategories={{}}
        isArchived={false}
        onEdit={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
        onEditValueChange={() => {}}
        onEditCategoryChange={() => {}}
        onComplete={() => {}}
        onDelete={onDeleteSpy}
        onRestore={() => {}}
      />
    )
    cy.get('.delete-button').click()
    cy.get('@onDeleteSpy').should('have.been.calledWith', '1')
  })
})

describe('TodoItem Component - Archived Mode', () => {
  const archivedTodo = {
    id: '2',
    text: 'Archived todo',
    categories: {
      priority: 'low',
      time: 'later',
      progress: 'not-started'
    }
  }

  it('shows Restore and Delete buttons for archived todos', () => {
    cy.mount(
      <TodoItem
        todo={archivedTodo}
        isEditing={false}
        editValue=""
        editCategories={{}}
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
    cy.get('.restore-button').should('be.visible')
    cy.get('.delete-button').should('be.visible')
    cy.get('.edit-button').should('not.exist')
    cy.get('.complete-button').should('not.exist')
  })

  it('applies archived and completed classes to archived items', () => {
    cy.mount(
      <TodoItem
        todo={archivedTodo}
        isEditing={false}
        editValue=""
        editCategories={{}}
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
    cy.get('.todo-item').should('have.class', 'archived')
    cy.get('.todo-text').should('have.class', 'completed')
  })

  it('calls onRestore when Restore button is clicked', () => {
    const onRestoreSpy = cy.spy().as('onRestoreSpy')
    cy.mount(
      <TodoItem
        todo={archivedTodo}
        isEditing={false}
        editValue=""
        editCategories={{}}
        isArchived={true}
        onEdit={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
        onEditValueChange={() => {}}
        onEditCategoryChange={() => {}}
        onComplete={() => {}}
        onDelete={() => {}}
        onRestore={onRestoreSpy}
      />
    )
    cy.get('.restore-button').click()
    cy.get('@onRestoreSpy').should('have.been.calledWith', '2')
  })
})

describe('TodoItem Component - Edit Mode', () => {
  const todoToEdit = {
    id: '3',
    text: 'Todo to edit',
    categories: {
      priority: 'medium',
      time: 'today',
      progress: 'not-started'
    }
  }

  const editCategories = {
    priority: 'high',
    time: 'this-week',
    progress: 'in-progress'
  }

  it('renders edit input with current value', () => {
    cy.mount(
      <TodoItem
        todo={todoToEdit}
        isEditing={true}
        editValue="Editing this todo"
        editCategories={editCategories}
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
    cy.get('.edit-input').should('have.value', 'Editing this todo')
  })

  it('shows category selects in edit mode', () => {
    cy.mount(
      <TodoItem
        todo={todoToEdit}
        isEditing={true}
        editValue="Editing this todo"
        editCategories={editCategories}
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
    cy.get('#edit-priority-select').should('exist')
    cy.get('#edit-time-select').should('exist')
    cy.get('#edit-progress-select').should('exist')
  })

  it('displays correct category values in edit mode', () => {
    cy.mount(
      <TodoItem
        todo={todoToEdit}
        isEditing={true}
        editValue="Editing this todo"
        editCategories={editCategories}
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
    cy.get('#edit-priority-select').should('have.value', 'high')
    cy.get('#edit-time-select').should('have.value', 'this-week')
    cy.get('#edit-progress-select').should('have.value', 'in-progress')
  })

  it('shows Save and Cancel buttons in edit mode', () => {
    cy.mount(
      <TodoItem
        todo={todoToEdit}
        isEditing={true}
        editValue="Editing this todo"
        editCategories={editCategories}
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
    cy.get('.save-button').should('be.visible')
    cy.get('.cancel-button').should('be.visible')
  })

  it('calls onEditValueChange when typing in edit input', () => {
    const onEditValueChangeSpy = cy.spy().as('onEditValueChangeSpy')
    cy.mount(
      <TodoItem
        todo={todoToEdit}
        isEditing={true}
        editValue=""
        editCategories={editCategories}
        isArchived={false}
        onEdit={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
        onEditValueChange={onEditValueChangeSpy}
        onEditCategoryChange={() => {}}
        onComplete={() => {}}
        onDelete={() => {}}
        onRestore={() => {}}
      />
    )
    cy.get('.edit-input').type('test')
    cy.get('@onEditValueChangeSpy').should('have.been.called')
  })

  it('calls onEditCategoryChange when changing categories', () => {
    const onEditCategoryChangeSpy = cy.spy().as('onEditCategoryChangeSpy')
    cy.mount(
      <TodoItem
        todo={todoToEdit}
        isEditing={true}
        editValue="Test"
        editCategories={editCategories}
        isArchived={false}
        onEdit={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
        onEditValueChange={() => {}}
        onEditCategoryChange={onEditCategoryChangeSpy}
        onComplete={() => {}}
        onDelete={() => {}}
        onRestore={() => {}}
      />
    )
    cy.get('#edit-priority-select').select('low')
    cy.get('@onEditCategoryChangeSpy').should('have.been.calledWith', 'priority', 'low')
  })

  it('calls onSave with todo id when Save button is clicked', () => {
    const onSaveSpy = cy.spy().as('onSaveSpy')
    cy.mount(
      <TodoItem
        todo={todoToEdit}
        isEditing={true}
        editValue="Updated todo"
        editCategories={editCategories}
        isArchived={false}
        onEdit={() => {}}
        onSave={onSaveSpy}
        onCancel={() => {}}
        onEditValueChange={() => {}}
        onEditCategoryChange={() => {}}
        onComplete={() => {}}
        onDelete={() => {}}
        onRestore={() => {}}
      />
    )
    cy.get('.save-button').click()
    cy.get('@onSaveSpy').should('have.been.calledWith', '3')
  })

  it('calls onCancel when Cancel button is clicked', () => {
    const onCancelSpy = cy.spy().as('onCancelSpy')
    cy.mount(
      <TodoItem
        todo={todoToEdit}
        isEditing={true}
        editValue="Updated todo"
        editCategories={editCategories}
        isArchived={false}
        onEdit={() => {}}
        onSave={() => {}}
        onCancel={onCancelSpy}
        onEditValueChange={() => {}}
        onEditCategoryChange={() => {}}
        onComplete={() => {}}
        onDelete={() => {}}
        onRestore={() => {}}
      />
    )
    cy.get('.cancel-button').click()
    cy.get('@onCancelSpy').should('have.been.calledOnce')
  })

  it('edit input should have autofocus', () => {
    cy.mount(
      <TodoItem
        todo={todoToEdit}
        isEditing={true}
        editValue="Test"
        editCategories={editCategories}
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
    cy.get('.edit-input').should('be.focused')
  })
})
