function TodoList({ 
  todos, 
  onDelete, 
  onComplete, 
  onIncomplete, 
  onEdit,
  onStartEdit,
  onCancelEdit,
  editingId,
  editText,
  editCategories,
  setEditText,
  setEditCategories,
  handleCategoryChange,
  getCategoryType,
  getCategoryValuesByType,
  CATEGORIES,
  isArchive = false 
}) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <p>{isArchive ? 'No archived todos yet.' : 'No todos yet. Add one above!'}</p>
      </div>
    )
  }

  const handleEditCategoryChange = (categoryValue) => {
    setEditCategories(prev => {
      const categoryType = getCategoryType(categoryValue)
      if (!categoryType) return prev

      if (prev.includes(categoryValue)) {
        // If unchecking, remove it but ensure at least one priority category remains
        const filtered = prev.filter(cat => cat !== categoryValue)
        // If removing a priority category, ensure at least one priority remains
        if (categoryType === 'priority') {
          const hasPriority = filtered.some(cat => getCategoryType(cat) === 'priority')
          if (!hasPriority) {
            return ['medium'] // Default to medium if removing the last priority
          }
        }
        return filtered
      } else {
        // If checking, remove any other category of the same type first
        const otherCategoriesOfSameType = getCategoryValuesByType(categoryType)
        const filtered = prev.filter(cat => !otherCategoriesOfSameType.includes(cat))
        return [...filtered, categoryValue]
      }
    })
  }

  const handleEditSubmit = (e, todoId) => {
    e.preventDefault()
    if (editText.trim() !== '' && editCategories.length > 0) {
      onEdit(todoId, editText, editCategories)
    }
  }

  return (
    <ul className="todo-list">
      {todos.map(todo => {
        // Support both old format (category) and new format (categories)
        const categories = todo.categories || (todo.category ? [todo.category] : ['medium'])
        const isEditing = editingId === todo.id && !isArchive
        
        return (
          <li key={todo.id} className={`todo-item ${isArchive ? 'archived' : ''}`}>
            {isEditing ? (
              <form onSubmit={(e) => handleEditSubmit(e, todo.id)} className="todo-edit-form">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Edit todo..."
                  className="todo-input"
                  autoFocus
                />
                <div className="category-selection">
                  <div className="category-group">
                    <label className="category-group-label">Priority:</label>
                    <div className="category-checkboxes">
                      {CATEGORIES.priority.map(cat => (
                        <label key={cat.value} className="category-checkbox-label">
                          <input
                            type="checkbox"
                            checked={editCategories.includes(cat.value)}
                            onChange={() => handleEditCategoryChange(cat.value)}
                            className="category-checkbox"
                          />
                          <span>{cat.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="category-group">
                    <label className="category-group-label">Time:</label>
                    <div className="category-checkboxes">
                      {CATEGORIES.time.map(cat => (
                        <label key={cat.value} className="category-checkbox-label">
                          <input
                            type="checkbox"
                            checked={editCategories.includes(cat.value)}
                            onChange={() => handleEditCategoryChange(cat.value)}
                            className="category-checkbox"
                          />
                          <span>{cat.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="category-group">
                    <label className="category-group-label">Progress:</label>
                    <div className="category-checkboxes">
                      {CATEGORIES.progress.map(cat => (
                        <label key={cat.value} className="category-checkbox-label">
                          <input
                            type="checkbox"
                            checked={editCategories.includes(cat.value)}
                            onChange={() => handleEditCategoryChange(cat.value)}
                            className="category-checkbox"
                          />
                          <span>{cat.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="edit-actions">
                  <button type="submit" className="save-button">
                    Save
                  </button>
                  <button 
                    type="button" 
                    onClick={onCancelEdit}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="todo-content">
                  <span className={`todo-text ${isArchive ? 'completed' : ''}`}>{todo.text}</span>
                  <div className="category-badges">
                    {categories.map((category, index) => (
                      <span 
                        key={index} 
                        className={`category-badge category-${category}`}
                      >
                        {category.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="todo-actions">
                  {isArchive ? (
                    <>
                      {onIncomplete && (
                        <button
                          onClick={() => onIncomplete(todo.id)}
                          className="incomplete-button"
                          aria-label="Mark as incomplete"
                        >
                          Mark Incomplete
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(todo.id)}
                        className="delete-button"
                        aria-label="Delete todo"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      {onStartEdit && (
                        <button
                          onClick={() => onStartEdit(todo)}
                          className="edit-button"
                          aria-label="Edit todo"
                        >
                          Edit
                        </button>
                      )}
                      {onComplete && (
                        <button
                          onClick={() => onComplete(todo.id)}
                          className="complete-button"
                          aria-label="Mark as complete"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(todo.id)}
                        className="delete-button"
                        aria-label="Delete todo"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default TodoList

