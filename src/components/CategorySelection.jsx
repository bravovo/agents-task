import { CATEGORIES } from '../constants'

function CategorySelection({ selectedCategories, onCategoryChange }) {
  return (
    <div className="category-selection">
      <div className="category-group">
        <label className="category-group-label">Priority:</label>
        <div className="category-checkboxes">
          {CATEGORIES.priority.map(cat => (
            <label key={cat.value} className="category-checkbox-label">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.value)}
                onChange={() => onCategoryChange(cat.value)}
                className="category-checkbox"
              />
              <span>{cat.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="category-group">
        <label className="category-group-label">Time:</label>
        <div className="category-checkboxes">
          {CATEGORIES.time.map(cat => (
            <label key={cat.value} className="category-checkbox-label">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.value)}
                onChange={() => onCategoryChange(cat.value)}
                className="category-checkbox"
              />
              <span>{cat.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="category-group">
        <label className="category-group-label">Progress:</label>
        <div className="category-checkboxes">
          {CATEGORIES.progress.map(cat => (
            <label key={cat.value} className="category-checkbox-label">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.value)}
                onChange={() => onCategoryChange(cat.value)}
                className="category-checkbox"
              />
              <span>{cat.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategorySelection

