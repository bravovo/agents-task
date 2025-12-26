function TodoList({ todos, onDelete, onComplete, onIncomplete, isArchive = false }) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <p>{isArchive ? 'No archived todos yet.' : 'No todos yet. Add one above!'}</p>
      </div>
    )
  }

  return (
    <ul className="todo-list">
      {todos.map(todo => {
        // Support both old format (category) and new format (categories)
        const categories = todo.categories || (todo.category ? [todo.category] : ['medium'])
        
        return (
          <li key={todo.id} className={`todo-item ${isArchive ? 'archived' : ''}`}>
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
          </li>
        )
      })}
    </ul>
  )
}

export default TodoList

