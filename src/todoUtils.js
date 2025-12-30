/**
 * CRUD utility functions for the Todo app
 */

/**
 * Creates a new todo item
 * @param {Array} todos - Current list of todos
 * @param {string} text - Text for the new todo
 * @param {Object} categories - Categories for the new todo
 * @returns {Array} Updated todos array with new todo
 */
export const createTodo = (todos, text, categories = {}) => {
  const trimmedText = text.trim();
  if (!trimmedText) {
    return todos;
  }
  
  const newTodo = {
    id: crypto.randomUUID(),
    text: trimmedText,
    categories: { ...categories }
  };
  
  return [...todos, newTodo];
};

/**
 * Updates an existing todo item
 * @param {Array} todos - Current list of todos
 * @param {string} id - ID of todo to update
 * @param {string} text - Updated text
 * @param {Object} categories - Updated categories
 * @returns {Array} Updated todos array
 */
export const updateTodo = (todos, id, text, categories) => {
  const trimmedText = text.trim();
  if (!trimmedText) {
    return todos;
  }
  
  return todos.map(todo =>
    todo.id === id
      ? { ...todo, text: trimmedText, categories: { ...categories } }
      : todo
  );
};

/**
 * Deletes a todo item
 * @param {Array} todos - Current list of todos
 * @param {string} id - ID of todo to delete
 * @returns {Array} Updated todos array without deleted todo
 */
export const deleteTodo = (todos, id) => {
  return todos.filter(todo => todo.id !== id);
};

/**
 * Completes a todo by moving it to archive
 * @param {Array} todos - Current list of todos
 * @param {Array} archive - Current archive list
 * @param {string} id - ID of todo to complete
 * @returns {Object} Object with updated todos and archive arrays
 */
export const completeTodo = (todos, archive, id) => {
  const todoToComplete = todos.find(todo => todo.id === id);
  
  if (!todoToComplete) {
    return { todos, archive };
  }
  
  const updatedTodos = todos.filter(todo => todo.id !== id);
  const updatedArchive = [
    ...archive,
    { ...todoToComplete, completedAt: new Date().toISOString() }
  ];
  
  return {
    todos: updatedTodos,
    archive: updatedArchive
  };
};

/**
 * Restores a todo from archive
 * @param {Array} todos - Current list of todos
 * @param {Array} archive - Current archive list
 * @param {string} id - ID of todo to restore
 * @returns {Object} Object with updated todos and archive arrays
 */
export const restoreTodo = (todos, archive, id) => {
  const todoToRestore = archive.find(todo => todo.id === id);
  
  if (!todoToRestore) {
    return { todos, archive };
  }
  
  const { completedAt: _completedAt, ...restoredTodo } = todoToRestore;
  const updatedTodos = [...todos, restoredTodo];
  const updatedArchive = archive.filter(todo => todo.id !== id);
  
  return {
    todos: updatedTodos,
    archive: updatedArchive
  };
};

/**
 * Deletes a todo from archive
 * @param {Array} archive - Current archive list
 * @param {string} id - ID of todo to delete from archive
 * @returns {Array} Updated archive array without deleted todo
 */
export const deleteFromArchive = (archive, id) => {
  return archive.filter(todo => todo.id !== id);
};

/**
 * Filters todos based on search text and category filters
 * @param {Array} todoList - List of todos to filter
 * @param {string} searchText - Search text to filter by
 * @param {Object} filterCategories - Category filters
 * @returns {Array} Filtered todos array
 */
export const filterTodos = (todoList, searchText = '', filterCategories = {}) => {
  const searchLower = searchText.toLowerCase().trim();
  
  return todoList.filter(todo => {
    // Text search filter
    const matchesSearch = searchLower === '' || 
      todo.text.toLowerCase().includes(searchLower);
    
    // Category filters
    const matchesFilters = Object.entries(filterCategories).every(([type, value]) => {
      if (value === 'all') return true;
      // Include todos without categories when filtering (they won't match specific values)
      if (!todo.categories) return false;
      return todo.categories[type] === value;
    });
    
    return matchesSearch && matchesFilters;
  });
};
