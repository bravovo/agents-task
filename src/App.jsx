import { useState, useEffect } from 'react'
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
  const [archive, setArchive] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [selectedCategories, setSelectedCategories] = useState({
    priority: 'medium',
    time: 'today',
    progress: 'not-started'
  })
  const [showArchive, setShowArchive] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [editCategories, setEditCategories] = useState({
    priority: 'medium',
    time: 'today',
    progress: 'not-started'
  })
  const [searchText, setSearchText] = useState('')
  const [filterCategories, setFilterCategories] = useState({
    priority: 'all',
    time: 'all',
    progress: 'all'
  })
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('todo-app-theme')
    return savedTheme || 'light'
  })

  // Persist theme preference and update body class
  useEffect(() => {
    localStorage.setItem('todo-app-theme', theme)
    document.body.className = theme === 'dark' ? 'dark-theme' : ''
  }, [theme])

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

  const handleComplete = (id) => {
    const todoToComplete = todos.find(todo => todo.id === id)
    if (todoToComplete) {
      setArchive([...archive, { ...todoToComplete, completedAt: new Date().toISOString() }])
      setTodos(todos.filter(todo => todo.id !== id))
    }
  }

  const handleDeleteFromArchive = (id) => {
    setArchive(archive.filter(todo => todo.id !== id))
  }

  const handleRestore = (id) => {
    const todoToRestore = archive.find(todo => todo.id === id)
    if (todoToRestore) {
      const { completedAt: _completedAt, ...restoredTodo } = todoToRestore
      setTodos([...todos, restoredTodo])
      setArchive(archive.filter(todo => todo.id !== id))
    }
  }

  const handleEdit = (id, text, categories) => {
    setEditingId(id)
    setEditValue(text)
    setEditCategories({ ...categories })
  }

  const handleSave = (id) => {
    const trimmedValue = editValue.trim()
    if (trimmedValue) {
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, text: trimmedValue, categories: { ...editCategories } } : todo
      ))
      setEditingId(null)
      setEditValue('')
      setEditCategories({
        priority: 'medium',
        time: 'today',
        progress: 'not-started'
      })
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditValue('')
    setEditCategories({
      priority: 'medium',
      time: 'today',
      progress: 'not-started'
    })
  }

  const handleEditCategoryChange = (type, value) => {
    setEditCategories({
      ...editCategories,
      [type]: value
    })
  }

  const handleFilterCategoryChange = (type, value) => {
    setFilterCategories({
      ...filterCategories,
      [type]: value
    })
  }

  const filterTodos = (todoList) => {
    const searchLower = searchText.toLowerCase().trim()
    
    return todoList.filter(todo => {
      // Text search filter
      const matchesSearch = searchLower === '' || 
        todo.text.toLowerCase().includes(searchLower)
      
      // Category filters
      const matchesFilters = Object.entries(filterCategories).every(([type, value]) => {
        if (value === 'all') return true
        // Include todos without categories when filtering (they won't match specific values)
        if (!todo.categories) return false
        return todo.categories[type] === value
      })
      
      return matchesSearch && matchesFilters
    })
  }

  const filteredTodos = filterTodos(todos)
  const filteredArchive = filterTodos(archive)

  return (
    <div className={`app ${theme}`}>
      <div className="header-with-theme">
        <h1>Todo App</h1>
        <button 
          className="theme-toggle"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
      <div className="view-toggle">
        <button 
          className={`toggle-button ${!showArchive ? 'active' : ''}`}
          onClick={() => setShowArchive(false)}
        >
          Active Todos ({todos.length})
        </button>
        <button 
          className={`toggle-button ${showArchive ? 'active' : ''}`}
          onClick={() => setShowArchive(true)}
        >
          Archive ({archive.length})
        </button>
      </div>
      <div className="search-filter-section">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search todos..."
          className="search-input"
        />
        <div className="filter-controls">
          {Object.entries(categoryTypes).map(([type, config]) => (
            <div key={type} className="filter-group">
              <label htmlFor={`filter-${type}`} className="filter-label">
                {config.label}:
              </label>
              <select
                id={`filter-${type}`}
                value={filterCategories[type]}
                onChange={(e) => handleFilterCategoryChange(type, e.target.value)}
                className="filter-select"
              >
                <option value="all">All</option>
                {Object.entries(config.options).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
      {!showArchive ? (
        <>
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
            {filteredTodos.map(todo => (
              <li key={todo.id} className="todo-item">
                {editingId === todo.id ? (
                  <>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="edit-input"
                      autoFocus
                    />
                    <div className="edit-categories">
                      {Object.entries(categoryTypes).map(([type, config]) => (
                        <div key={type} className="category-group">
                          <label htmlFor={`edit-${type}-select`} className="category-label">
                            {config.label}:
                          </label>
                          <select
                            id={`edit-${type}-select`}
                            value={editCategories[type]}
                            onChange={(e) => handleEditCategoryChange(type, e.target.value)}
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
                    </div>
                    <div className="button-group">
                      <button
                        onClick={() => handleSave(todo.id)}
                        className="save-button"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
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
                    <div className="button-group">
                      <button
                        onClick={() => handleEdit(todo.id, todo.text, todo.categories)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleComplete(todo.id)}
                        className="complete-button"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
          {filteredTodos.length === 0 && todos.length > 0 && (
            <p className="empty-message">No todos match your search or filters.</p>
          )}
          {todos.length === 0 && (
            <p className="empty-message">No todos yet. Add one to get started!</p>
          )}
        </>
      ) : (
        <>
          <ul className="todo-list">
            {filteredArchive.map(todo => (
              <li key={todo.id} className="todo-item archived">
                <span className="todo-text completed">{todo.text}</span>
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
                <div className="button-group">
                  <button
                    onClick={() => handleRestore(todo.id)}
                    className="restore-button"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handleDeleteFromArchive(todo.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {filteredArchive.length === 0 && archive.length > 0 && (
            <p className="empty-message">No archived todos match your search or filters.</p>
          )}
          {archive.length === 0 && (
            <p className="empty-message">No archived todos yet.</p>
          )}
        </>
      )}
    </div>
  )
}

export default App
