function CategorySelect({ id, type, config, value, onChange, className = "category-select" }) {
  return (
    <div className="category-group">
      <label htmlFor={id} className="category-label">
        {config.label}:
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(type, e.target.value)}
        className={className}
      >
        {Object.entries(config.options).map(([optionValue, label]) => (
          <option key={optionValue} value={optionValue}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CategorySelect
