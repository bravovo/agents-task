import { useState } from 'react'
import './App.css'

const categoryTypes = {
  priority: {
    label: 'Priority',
    options: {
      high: 'High',
      medium: 'Medium',
      low: 'Low'
    }
  },
  time: {
    label: 'Time',
    options: {
      today: 'Today',
      'this-week': 'This Week',
      'this-month': 'This Month',
      later: 'Later'
    }
  },
  progress: {
    label: 'Progress',
    options: {
      'not-started': 'Not Started',
      'in-progress': 'In Progress',
      blocked: 'Blocked'
    }
  }
}

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [selectedCategories, setSelectedCategories] = useState({
    priority: 'medium',
    time: 'today',
    progress: 'not-started'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmedValue = inputValue.trim()
    if (trimmedValue) {
      setTodos([...todos, { 
        id: crypto.randomUUID(), 
        text: trimmedValue, 
        categories: { ...selectedCategories }
      }])
      setInputValue('')
      setSelectedCategories({
        priority: 'medium',
        time: 'today',
        progress: 'not-started'
      })
    }
  }

  const handleCategoryChange = (type, value) => {
    setSelectedCategories({
      ...selectedCategories,
      [type]: value
    })
  }

  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <div className="app">
      <h1>Todo App</h1>
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a new todo..."
          className="todo-input"
        />
        {Object.entries(categoryTypes).map(([type, config]) => (
          <div key={type} className="category-group">
            <label htmlFor={`${type}-select`} className="category-label">
              {config.label}:
            </label>
            <select
              id={`${type}-select`}
              value={selectedCategories[type]}
              onChange={(e) => handleCategoryChange(type, e.target.value)}
              className="category-select"
            >
              {Object.entries(config.options).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button type="submit" className="submit-button">
          Add Todo
        </button>
      </form>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className="todo-item">
            <span className="todo-text">{todo.text}</span>
            <div className="category-badges">
              {todo.categories && Object.entries(todo.categories).map(([type, value]) => {
                const typeConfig = categoryTypes[type]
                if (!typeConfig) return null
                const label = typeConfig.options[value] || value
                return (
                  <span 
                    key={`${todo.id}-${type}`} 
                    className={`category-badge category-${type}-${value}`}
                  >
                    {label}
                  </span>
                )
              })}
            </div>
            <button
              onClick={() => handleDelete(todo.id)}
              className="delete-button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && (
        <p className="empty-message">No todos yet. Add one to get started!</p>
      )}
    </div>
  )
}

export default App
