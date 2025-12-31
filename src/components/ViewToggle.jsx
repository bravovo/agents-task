function ViewToggle({ showArchive, onToggle, todosCount, archiveCount }) {
  return (
    <div className="view-toggle">
      <button 
        className={`toggle-button ${!showArchive ? 'active' : ''}`}
        onClick={() => onToggle(false)}
      >
        Active Todos ({todosCount})
      </button>
      <button 
        className={`toggle-button ${showArchive ? 'active' : ''}`}
        onClick={() => onToggle(true)}
      >
        Archive ({archiveCount})
      </button>
    </div>
  )
}

export default ViewToggle
