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
      {todos.map(todo => (
        <li key={todo.id} className="todo-item">
          <div className="todo-content">
            <span className="todo-text">{todo.text}</span>
            <span className={`category-badge category-${todo.category || 'medium'}`}>
              {todo.category || 'medium'}
            </span>
          </div>
          <button
            onClick={() => onDelete(todo.id)}
            className="delete-button"
            aria-label="Delete todo"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}

export default TodoList

