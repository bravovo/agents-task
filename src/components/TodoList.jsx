import TodoItem from './TodoItem'

function TodoList({ todos, editingId, editValue, editCategories, isArchived, onEdit, onSave, onCancel, onEditValueChange, onEditCategoryChange, onComplete, onDelete, onRestore }) {
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isEditing={editingId === todo.id}
          editValue={editValue}
          editCategories={editCategories}
          isArchived={isArchived}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          onEditValueChange={onEditValueChange}
          onEditCategoryChange={onEditCategoryChange}
          onComplete={onComplete}
          onDelete={onDelete}
          onRestore={onRestore}
        />
      ))}
    </ul>
  )
}

export default TodoList
