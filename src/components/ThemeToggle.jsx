function ThemeToggle({ isDarkTheme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="theme-toggle"
      aria-label={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDarkTheme ? '☀️' : '🌙'}
    </button>
  )
}

export default ThemeToggle

