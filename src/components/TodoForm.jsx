import CategorySelection from './CategorySelection'

function TodoForm({ inputValue, onInputChange, selectedCategories, onCategoryChange, onSubmit }) {
  const handleCategoryChange = (categoryValue) => {
    onCategoryChange(categoryValue)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim() !== '' && selectedCategories.length > 0) {
      onSubmit(inputValue.trim(), selectedCategories)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Add a new todo..."
        className="todo-input"
      />
      <CategorySelection
        selectedCategories={selectedCategories}
        onCategoryChange={handleCategoryChange}
      />
      <button type="submit" className="submit-button">
        Add Todo
      </button>
    </form>
  )
}

export default TodoForm

