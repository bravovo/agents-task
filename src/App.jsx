import { useState } from 'react'
import TodoList from './components/TodoList'

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
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [selectedCategories, setSelectedCategories] = useState(['medium'])

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

  return (
    <div className="app">
      <div className="container">
        <h1>Todo List</h1>
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
        <TodoList todos={todos} onDelete={handleDelete} />
      </div>
    </div>
  )
}

export default App

