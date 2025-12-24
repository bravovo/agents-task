import { useState } from 'react'
import TodoList from './components/TodoList'

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim() !== '') {
      const newTodo = {
        id: Date.now(),
        text: inputValue.trim()
      }
      setTodos([...todos, newTodo])
      setInputValue('')
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

