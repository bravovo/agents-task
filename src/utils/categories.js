import { CATEGORIES } from '../constants'

// Helper function to get the category type for a given category value
export const getCategoryType = (categoryValue) => {
  if (CATEGORIES.priority.some(cat => cat.value === categoryValue)) return 'priority'
  if (CATEGORIES.time.some(cat => cat.value === categoryValue)) return 'time'
  if (CATEGORIES.progress.some(cat => cat.value === categoryValue)) return 'progress'
  return null
}

// Helper function to get all category values of a specific type
export const getCategoryValuesByType = (type) => {
  return CATEGORIES[type].map(cat => cat.value)
}

