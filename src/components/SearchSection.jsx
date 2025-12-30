import { CATEGORIES } from '../constants'

function SearchSection({ searchText, onSearchTextChange, searchCategories, onSearchCategoryChange, onClearSearch }) {
  return (
    <div className="search-section">
      <div className="search-header">
        <h2>Search Todos</h2>
      </div>
      <div className="search-form">
        <input
          type="text"
          value={searchText}
          onChange={(e) => onSearchTextChange(e.target.value)}
          placeholder="Search by text..."
          className="search-input"
        />
        <div className="search-category-selection">
          <div className="category-group">
            <label className="category-group-label">Filter by Priority:</label>
            <div className="category-checkboxes">
              {CATEGORIES.priority.map(cat => (
                <label key={cat.value} className="category-checkbox-label">
                  <input
                    type="checkbox"
                    checked={searchCategories.includes(cat.value)}
                    onChange={() => onSearchCategoryChange(cat.value)}
                    className="category-checkbox"
                  />
                  <span>{cat.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="category-group">
            <label className="category-group-label">Filter by Time:</label>
            <div className="category-checkboxes">
              {CATEGORIES.time.map(cat => (
                <label key={cat.value} className="category-checkbox-label">
                  <input
                    type="checkbox"
                    checked={searchCategories.includes(cat.value)}
                    onChange={() => onSearchCategoryChange(cat.value)}
                    className="category-checkbox"
                  />
                  <span>{cat.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="category-group">
            <label className="category-group-label">Filter by Progress:</label>
            <div className="category-checkboxes">
              {CATEGORIES.progress.map(cat => (
                <label key={cat.value} className="category-checkbox-label">
                  <input
                    type="checkbox"
                    checked={searchCategories.includes(cat.value)}
                    onChange={() => onSearchCategoryChange(cat.value)}
                    className="category-checkbox"
                  />
                  <span>{cat.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        {(searchText || searchCategories.length > 0) && (
          <button
            onClick={onClearSearch}
            className="clear-search-button"
          >
            Clear Search
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchSection

