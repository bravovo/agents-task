import { useState, useEffect } from 'react'
import TodoList from './components/TodoList'

// LocalStorage keys
const STORAGE_KEYS = {
  TODOS: 'todos',
  ARCHIVED_TODOS: 'archivedTodos'
}

// Helper function to load from localStorage
const loadFromStorage = (key, defaultValue = []) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error)
    return defaultValue
  }
}

// Helper function to save to localStorage
const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

// Category definitions organized by type
const CATEGORIES = {
  priority: [
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ],
  time: [
    { value: 'urgent', label: 'Urgent' },
    { value: 'today', label: 'Today' },
    { value: 'this-week', label: 'This Week' },
    { value: 'later', label: 'Later' }
  ],
  progress: [
    { value: 'not-started', label: 'Not Started' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'blocked', label: 'Blocked' }
  ]
}

function App() {
  // Initialize state from localStorage
  const [todos, setTodos] = useState(() => loadFromStorage(STORAGE_KEYS.TODOS))
  const [archivedTodos, setArchivedTodos] = useState(() => loadFromStorage(STORAGE_KEYS.ARCHIVED_TODOS))
  const [activeView, setActiveView] = useState('active') // 'active' or 'archive'
  const [inputValue, setInputValue] = useState('')
  const [selectedCategories, setSelectedCategories] = useState(['medium'])
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [editCategories, setEditCategories] = useState(['medium'])

  // Save todos to localStorage whenever they change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TODOS, todos)
  }, [todos])

  // Save archivedTodos to localStorage whenever they change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ARCHIVED_TODOS, archivedTodos)
  }, [archivedTodos])

  // Helper function to get the category type for a given category value
  const getCategoryType = (categoryValue) => {
    if (CATEGORIES.priority.some(cat => cat.value === categoryValue)) return 'priority'
    if (CATEGORIES.time.some(cat => cat.value === categoryValue)) return 'time'
    if (CATEGORIES.progress.some(cat => cat.value === categoryValue)) return 'progress'
    return null
  }

  // Helper function to get all category values of a specific type
  const getCategoryValuesByType = (type) => {
    return CATEGORIES[type].map(cat => cat.value)
  }

  const handleCategoryChange = (categoryValue) => {
    setSelectedCategories(prev => {
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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim() !== '' && selectedCategories.length > 0) {
      const newTodo = {
        id: Date.now(),
        text: inputValue.trim(),
        categories: [...selectedCategories]
      }
      setTodos([...todos, newTodo])
      setInputValue('')
      setSelectedCategories(['medium'])
    }
  }

  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const handleComplete = (id) => {
    const todoToComplete = todos.find(todo => todo.id === id)
    if (todoToComplete) {
      setArchivedTodos([...archivedTodos, { ...todoToComplete, completedAt: Date.now() }])
      setTodos(todos.filter(todo => todo.id !== id))
    }
  }

  const handleIncomplete = (id) => {
    const todoToRestore = archivedTodos.find(todo => todo.id === id)
    if (todoToRestore) {
      const { completedAt, ...todoWithoutCompletedAt } = todoToRestore
      setTodos([...todos, todoWithoutCompletedAt])
      setArchivedTodos(archivedTodos.filter(todo => todo.id !== id))
    }
  }

  const handleDeleteFromArchive = (id) => {
    setArchivedTodos(archivedTodos.filter(todo => todo.id !== id))
  }

  const handleEdit = (id, newText, newCategories) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, text: newText.trim(), categories: newCategories }
        : todo
    ))
    setEditingId(null)
    setEditText('')
    setEditCategories(['medium'])
  }

  const handleStartEdit = (todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
    setEditCategories(todo.categories || (todo.category ? [todo.category] : ['medium']))
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditText('')
    setEditCategories(['medium'])
  }

  return (
    <div className="app">
      <div className="container">
        <h1>Todo List</h1>
        <div className="view-switcher">
          <button
            onClick={() => setActiveView('active')}
            className={`view-button ${activeView === 'active' ? 'active' : ''}`}
          >
            Active Todos ({todos.length})
          </button>
          <button
            onClick={() => setActiveView('archive')}
            className={`view-button ${activeView === 'archive' ? 'active' : ''}`}
          >
            Archive ({archivedTodos.length})
          </button>
        </div>
        {activeView === 'active' && (
          <form onSubmit={handleSubmit} className="todo-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new todo..."
            className="todo-input"
          />
          <div className="category-selection">
            <div className="category-group">
              <label className="category-group-label">Priority:</label>
              <div className="category-checkboxes">
                {CATEGORIES.priority.map(cat => (
                  <label key={cat.value} className="category-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.value)}
                      onChange={() => handleCategoryChange(cat.value)}
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
                      checked={selectedCategories.includes(cat.value)}
                      onChange={() => handleCategoryChange(cat.value)}
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
                      checked={selectedCategories.includes(cat.value)}
                      onChange={() => handleCategoryChange(cat.value)}
                      className="category-checkbox"
                    />
                    <span>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <button type="submit" className="submit-button">
            Add Todo
          </button>
        </form>
        )}
        <div className="todo-count">
          {activeView === 'active' ? (
            <p>{todos.length} uncompleted todo tasks</p>
          ) : (
            <p>{archivedTodos.length} completed todo tasks</p>
          )}
        </div>
        {activeView === 'active' ? (
          <TodoList 
            todos={todos} 
            onDelete={handleDelete}
            onComplete={handleComplete}
            onEdit={handleEdit}
            onStartEdit={handleStartEdit}
            onCancelEdit={handleCancelEdit}
            editingId={editingId}
            editText={editText}
            editCategories={editCategories}
            setEditText={setEditText}
            setEditCategories={setEditCategories}
            handleCategoryChange={handleCategoryChange}
            getCategoryType={getCategoryType}
            getCategoryValuesByType={getCategoryValuesByType}
            CATEGORIES={CATEGORIES}
            isArchive={false}
          />
        ) : (
          <TodoList 
            todos={archivedTodos} 
            onDelete={handleDeleteFromArchive}
            onIncomplete={handleIncomplete}
            isArchive={true}
          />
        )}
      </div>
    </div>
  )
}

export default App

