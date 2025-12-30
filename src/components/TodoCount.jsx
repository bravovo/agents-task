function TodoCount({ activeView, todosCount, archivedCount, filteredCount, hasActiveSearch }) {
  return (
    <div className="todo-count">
      {activeView === 'active' ? (
        <p>
          {hasActiveSearch
            ? `${filteredCount} of ${todosCount} uncompleted todo tasks`
            : `${todosCount} uncompleted todo tasks`}
        </p>
      ) : (
        <p>
          {hasActiveSearch
            ? `${filteredCount} of ${archivedCount} completed todo tasks`
            : `${archivedCount} completed todo tasks`}
        </p>
      )}
    </div>
  )
}

export default TodoCount

