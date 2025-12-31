import { categoryTypes } from '../constants'
import CategorySelect from './CategorySelect'

function TodoForm({ inputValue, onInputChange, selectedCategories, onCategoryChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="todo-form">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Enter a new todo..."
        className="todo-input"
      />
      {Object.entries(categoryTypes).map(([type, config]) => (
        <CategorySelect
          key={type}
          id={`${type}-select`}
          type={type}
          config={config}
          value={selectedCategories[type]}
          onChange={onCategoryChange}
        />
      ))}
      <button type="submit" className="submit-button">
        Add Todo
      </button>
    </form>
  )
}

export default TodoForm
