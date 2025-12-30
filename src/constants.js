// LocalStorage keys
export const STORAGE_KEYS = {
  TODOS: 'todos',
  ARCHIVED_TODOS: 'archivedTodos',
  THEME: 'theme'
}

// Category definitions organized by type
export const CATEGORIES = {
  priority: [
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ],
  time: [
    { value: 'urgent', label: 'Urgent' },
    { value: 'today', label: 'Today' },
    { value: 'this-week', label: 'This Week' },
    { value: 'later', label: 'Later' }
  ],
  progress: [
    { value: 'not-started', label: 'Not Started' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'blocked', label: 'Blocked' }
  ]
}

