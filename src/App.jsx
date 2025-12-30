import { useState, useEffect } from 'react'
import TodoList from './components/TodoList'
import ThemeToggle from './components/ThemeToggle'
import ViewSwitcher from './components/ViewSwitcher'
import TodoForm from './components/TodoForm'
import SearchSection from './components/SearchSection'
import TodoCount from './components/TodoCount'
import { STORAGE_KEYS } from './constants'
import { loadFromStorage, saveToStorage } from './utils/storage'
import { getCategoryType, getCategoryValuesByType } from './utils/categories'

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
  const [searchText, setSearchText] = useState('')
  const [searchCategories, setSearchCategories] = useState([])
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME)
    if (!savedTheme) return false
    try {
      // Parse JSON since saveToStorage uses JSON.stringify
      const parsed = JSON.parse(savedTheme)
      return parsed === 'dark'
    } catch {
      // Fallback for non-JSON values (backward compatibility)
      return savedTheme === 'dark'
    }
  })

  // Save todos to localStorage whenever they change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TODOS, todos)
  }, [todos])

  // Save archivedTodos to localStorage whenever they change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ARCHIVED_TODOS, archivedTodos)
  }, [archivedTodos])

  // Save theme preference to localStorage and apply to document
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.THEME, isDarkTheme ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light')
  }, [isDarkTheme])

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light')
  }, [])

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

  const handleSubmit = (text, categories) => {
    const newTodo = {
      id: Date.now(),
      text,
      categories: [...categories]
    }
    setTodos([...todos, newTodo])
    setInputValue('')
    setSelectedCategories(['medium'])
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

  // Filter todos based on search criteria
  const filterTodos = (todoList) => {
    return todoList.filter(todo => {
      // Text search filter
      const matchesText = searchText === '' || 
        todo.text.toLowerCase().includes(searchText.toLowerCase())
      
      // Category filter
      const matchesCategory = searchCategories.length === 0 || 
        (todo.categories || (todo.category ? [todo.category] : [])).some(
          cat => searchCategories.includes(cat)
        )
      
      return matchesText && matchesCategory
    })
  }

  const handleSearchCategoryChange = (categoryValue) => {
    setSearchCategories(prev => {
      if (prev.includes(categoryValue)) {
        return prev.filter(cat => cat !== categoryValue)
      } else {
        return [...prev, categoryValue]
      }
    })
  }

  const handleClearSearch = () => {
    setSearchText('')
    setSearchCategories([])
  }

  // Get filtered todos for current view
  const filteredTodos = activeView === 'active' 
    ? filterTodos(todos)
    : filterTodos(archivedTodos)

  return (
    <div className="app">
      <div className="container">
        <div className="header-with-theme">
          <h1>Todo List</h1>
          <ThemeToggle 
            isDarkTheme={isDarkTheme} 
            onToggle={() => setIsDarkTheme(!isDarkTheme)} 
          />
        </div>
        <ViewSwitcher
          activeView={activeView}
          onViewChange={setActiveView}
          activeCount={todos.length}
          archiveCount={archivedTodos.length}
        />
        <SearchSection
          searchText={searchText}
          onSearchTextChange={setSearchText}
          searchCategories={searchCategories}
          onSearchCategoryChange={handleSearchCategoryChange}
          onClearSearch={handleClearSearch}
        />
        {activeView === 'active' && (
          <TodoForm
            inputValue={inputValue}
            onInputChange={setInputValue}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            onSubmit={handleSubmit}
          />
        )}
        <TodoCount
          activeView={activeView}
          todosCount={todos.length}
          archivedCount={archivedTodos.length}
          filteredCount={filteredTodos.length}
          hasActiveSearch={searchText !== '' || searchCategories.length > 0}
        />
        {activeView === 'active' ? (
          <TodoList 
            todos={filteredTodos} 
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
            isArchive={false}
            hasActiveSearch={searchText !== '' || searchCategories.length > 0}
          />
        ) : (
          <TodoList 
            todos={filteredTodos} 
            onDelete={handleDeleteFromArchive}
            onIncomplete={handleIncomplete}
            isArchive={true}
            hasActiveSearch={searchText !== '' || searchCategories.length > 0}
          />
        )}
      </div>
    </div>
  )
}

export default App
