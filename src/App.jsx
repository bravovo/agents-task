import { useState } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [category, setCategory] = useState('medium')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmedValue = inputValue.trim()
    if (trimmedValue) {
      setTodos([...todos, { id: crypto.randomUUID(), text: trimmedValue, category }])
      setInputValue('')
      setCategory('medium')
    }
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
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
        >
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
        <button type="submit" className="submit-button">
          Add Todo
        </button>
      </form>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className="todo-item">
            <span className="todo-text">{todo.text}</span>
            <span className={`category-badge category-${todo.category}`}>
              {todo.category === 'high' ? 'High' : todo.category === 'medium' ? 'Medium' : 'Low'}
            </span>
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
