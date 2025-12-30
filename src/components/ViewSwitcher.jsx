function ViewSwitcher({ activeView, onViewChange, activeCount, archiveCount }) {
  return (
    <div className="view-switcher">
      <button
        onClick={() => onViewChange('active')}
        className={`view-button ${activeView === 'active' ? 'active' : ''}`}
      >
        Active Todos ({activeCount})
      </button>
      <button
        onClick={() => onViewChange('archive')}
        className={`view-button ${activeView === 'archive' ? 'active' : ''}`}
      >
        Archive ({archiveCount})
      </button>
    </div>
  )
}

export default ViewSwitcher

