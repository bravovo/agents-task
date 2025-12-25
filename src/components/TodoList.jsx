function TodoList({ todos, onDelete }) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <p>No todos yet. Add one above!</p>
      </div>
    )
  }

  return (
    <ul className="todo-list">
      {todos.map(todo => {
        // Support both old format (category) and new format (categories)
        const categories = todo.categories || (todo.category ? [todo.category] : ['medium'])
        
        return (
          <li key={todo.id} className="todo-item">
            <div className="todo-content">
              <span className="todo-text">{todo.text}</span>
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
            <button
              onClick={() => onDelete(todo.id)}
              className="delete-button"
              aria-label="Delete todo"
            >
              Delete
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default TodoList

