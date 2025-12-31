function Header({ theme, onThemeToggle }) {
  return (
    <div className="header-with-theme">
      <h1>Todo App</h1>
      <button 
        className="theme-toggle"
        onClick={onThemeToggle}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  )
}

export default Header
