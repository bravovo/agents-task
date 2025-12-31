import { categoryTypes } from '../constants'

function SearchFilter({ searchText, onSearchChange, filterCategories, onFilterChange }) {
  return (
    <div className="search-filter-section">
      <input
        type="text"
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search todos..."
        className="search-input"
      />
      <div className="filter-controls">
        {Object.entries(categoryTypes).map(([type, config]) => (
          <div key={type} className="filter-group">
            <label htmlFor={`filter-${type}`} className="filter-label">
              {config.label}:
            </label>
            <select
              id={`filter-${type}`}
              value={filterCategories[type]}
              onChange={(e) => onFilterChange(type, e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              {Object.entries(config.options).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchFilter
