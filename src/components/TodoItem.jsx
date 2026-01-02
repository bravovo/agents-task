import { categoryTypes } from '../constants'
import CategorySelect from './CategorySelect'

function TodoItem({ todo, isEditing, editValue, editCategories, isArchived, onEdit, onSave, onCancel, onEditValueChange, onEditCategoryChange, onComplete, onDelete, onRestore }) {
  if (isEditing) {
    return (
      <li className="todo-item">
        <input
          type="text"
          value={editValue}
          onChange={(e) => onEditValueChange(e.target.value)}
          className="edit-input"
          autoFocus
        />
        <div className="edit-categories">
          {Object.entries(categoryTypes).map(([type, config]) => (
            <CategorySelect
              key={type}
              id={`edit-${type}-select`}
              type={type}
              config={config}
              value={editCategories[type]}
              onChange={onEditCategoryChange}
            />
          ))}
        </div>
        <div className="button-group">
          <button
            onClick={() => onSave(todo.id)}
            className="save-button"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </li>
    )
  }

  return (
    <li className={`todo-item${isArchived ? ' archived' : ''}`}>
      <span className={`todo-text${isArchived ? ' completed' : ''}`}>{todo.text}</span>
      <div className="todo-item-footer">
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
          {!isArchived ? (
            <>
              <button
                onClick={() => onEdit(todo.id, todo.text, todo.categories)}
                className="edit-button"
              >
                Edit
              </button>
              <button
                onClick={() => onComplete(todo.id)}
                className="complete-button"
              >
                Complete
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="delete-button"
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onRestore(todo.id)}
                className="restore-button"
              >
                Restore
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="delete-button"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  )
}

export default TodoItem
