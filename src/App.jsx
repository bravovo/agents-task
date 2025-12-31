import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import ViewToggle from './components/ViewToggle'
import SearchFilter from './components/SearchFilter'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'

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
      <Header 
        theme={theme} 
        onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      />
      <ViewToggle 
        showArchive={showArchive}
        onToggle={setShowArchive}
        todosCount={todos.length}
        archiveCount={archive.length}
      />
      <SearchFilter 
        searchText={searchText}
        onSearchChange={setSearchText}
        filterCategories={filterCategories}
        onFilterChange={handleFilterCategoryChange}
      />
      {!showArchive ? (
        <>
          <TodoForm 
            inputValue={inputValue}
            onInputChange={setInputValue}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            onSubmit={handleSubmit}
          />
          <TodoList 
            todos={filteredTodos}
            editingId={editingId}
            editValue={editValue}
            editCategories={editCategories}
            isArchived={false}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancelEdit}
            onEditValueChange={setEditValue}
            onEditCategoryChange={handleEditCategoryChange}
            onComplete={handleComplete}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />
          {filteredTodos.length === 0 && todos.length > 0 && (
            <p className="empty-message">No todos match your search or filters.</p>
          )}
          {todos.length === 0 && (
            <p className="empty-message">No todos yet. Add one to get started!</p>
          )}
        </>
      ) : (
        <>
          <TodoList 
            todos={filteredArchive}
            editingId={null}
            editValue=""
            editCategories={{}}
            isArchived={true}
            onEdit={() => {}}
            onSave={() => {}}
            onCancel={() => {}}
            onEditValueChange={() => {}}
            onEditCategoryChange={() => {}}
            onComplete={() => {}}
            onDelete={handleDeleteFromArchive}
            onRestore={handleRestore}
          />
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
