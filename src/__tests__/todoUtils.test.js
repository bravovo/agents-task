import {
  createTodo,
  updateTodo,
  deleteTodo,
  completeTodo,
  restoreTodo,
  deleteFromArchive,
  filterTodos,
} from '../todoUtils';

// Mock crypto.randomUUID for consistent testing
const mockRandomUUID = jest.fn(() => 'mock-uuid-123');
global.crypto = {
  randomUUID: mockRandomUUID,
};

describe('Todo CRUD Operations', () => {
  beforeEach(() => {
    // Reset the mock before each test
    mockRandomUUID.mockClear();
    mockRandomUUID.mockReturnValue('mock-uuid-123');
  });

  describe('Create Operation', () => {
    test('should create a new todo with text and categories', () => {
      const todos = [];
      const text = 'Buy groceries';
      const categories = { priority: 'high', time: 'today', progress: 'not-started' };

      const result = createTodo(todos, text, categories);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        text: 'Buy groceries',
        categories: { priority: 'high', time: 'today', progress: 'not-started' },
      });
      expect(result[0].id).toBeDefined();
      expect(typeof result[0].id).toBe('string');
    });

    test('should add new todo to existing todos list', () => {
      const todos = [
        { id: '1', text: 'Existing todo', categories: {} },
      ];
      const text = 'New todo';
      const categories = { priority: 'medium' };

      const result = createTodo(todos, text, categories);

      expect(result).toHaveLength(2);
      expect(result[1].text).toBe('New todo');
    });

    test('should trim whitespace from todo text', () => {
      const todos = [];
      const text = '  Trimmed todo  ';
      const categories = {};

      const result = createTodo(todos, text, categories);

      expect(result[0].text).toBe('Trimmed todo');
    });

    test('should not create todo with empty text', () => {
      const todos = [];
      const text = '';
      const categories = {};

      const result = createTodo(todos, text, categories);

      expect(result).toHaveLength(0);
    });

    test('should not create todo with only whitespace', () => {
      const todos = [];
      const text = '   ';
      const categories = {};

      const result = createTodo(todos, text, categories);

      expect(result).toHaveLength(0);
    });

    test('should create todo with default empty categories if not provided', () => {
      const todos = [];
      const text = 'Todo without categories';

      const result = createTodo(todos, text);

      expect(result[0].categories).toEqual({});
    });
  });

  describe('Update Operation', () => {
    test('should update todo text and categories', () => {
      const todos = [
        { id: '1', text: 'Original text', categories: { priority: 'low' } },
        { id: '2', text: 'Another todo', categories: { priority: 'high' } },
      ];

      const result = updateTodo(todos, '1', 'Updated text', { priority: 'medium' });

      expect(result[0]).toEqual({
        id: '1',
        text: 'Updated text',
        categories: { priority: 'medium' },
      });
      expect(result[1]).toEqual(todos[1]); // Other todos unchanged
    });

    test('should trim whitespace from updated text', () => {
      const todos = [{ id: '1', text: 'Original', categories: {} }];

      const result = updateTodo(todos, '1', '  Updated  ', {});

      expect(result[0].text).toBe('Updated');
    });

    test('should not update todo with empty text', () => {
      const todos = [{ id: '1', text: 'Original', categories: {} }];

      const result = updateTodo(todos, '1', '', {});

      expect(result[0].text).toBe('Original');
    });

    test('should not update todo with only whitespace', () => {
      const todos = [{ id: '1', text: 'Original', categories: {} }];

      const result = updateTodo(todos, '1', '   ', {});

      expect(result[0].text).toBe('Original');
    });

    test('should return unchanged array if todo id not found', () => {
      const todos = [{ id: '1', text: 'Original', categories: {} }];

      const result = updateTodo(todos, 'non-existent', 'Updated', {});

      expect(result).toEqual(todos);
    });

    test('should update only the specified todo', () => {
      const todos = [
        { id: '1', text: 'Todo 1', categories: {} },
        { id: '2', text: 'Todo 2', categories: {} },
        { id: '3', text: 'Todo 3', categories: {} },
      ];

      const result = updateTodo(todos, '2', 'Updated Todo 2', { priority: 'high' });

      expect(result[0].text).toBe('Todo 1');
      expect(result[1].text).toBe('Updated Todo 2');
      expect(result[2].text).toBe('Todo 3');
    });
  });

  describe('Delete Operation', () => {
    test('should delete todo by id', () => {
      const todos = [
        { id: '1', text: 'Todo 1', categories: {} },
        { id: '2', text: 'Todo 2', categories: {} },
        { id: '3', text: 'Todo 3', categories: {} },
      ];

      const result = deleteTodo(todos, '2');

      expect(result).toHaveLength(2);
      expect(result.find(todo => todo.id === '2')).toBeUndefined();
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('3');
    });

    test('should return unchanged array if todo id not found', () => {
      const todos = [
        { id: '1', text: 'Todo 1', categories: {} },
      ];

      const result = deleteTodo(todos, 'non-existent');

      expect(result).toEqual(todos);
      expect(result).toHaveLength(1);
    });

    test('should handle deleting from empty array', () => {
      const todos = [];

      const result = deleteTodo(todos, '1');

      expect(result).toEqual([]);
    });

    test('should delete the last remaining todo', () => {
      const todos = [{ id: '1', text: 'Last todo', categories: {} }];

      const result = deleteTodo(todos, '1');

      expect(result).toHaveLength(0);
    });
  });

  describe('Complete Operation', () => {
    test('should move todo from todos to archive', () => {
      const todos = [
        { id: '1', text: 'Todo 1', categories: { priority: 'high' } },
        { id: '2', text: 'Todo 2', categories: { priority: 'low' } },
      ];
      const archive = [];

      const result = completeTodo(todos, archive, '1');

      expect(result.todos).toHaveLength(1);
      expect(result.todos[0].id).toBe('2');
      expect(result.archive).toHaveLength(1);
      expect(result.archive[0].id).toBe('1');
      expect(result.archive[0].text).toBe('Todo 1');
    });

    test('should add completedAt timestamp when completing todo', () => {
      const todos = [{ id: '1', text: 'Todo 1', categories: {} }];
      const archive = [];

      const result = completeTodo(todos, archive, '1');

      expect(result.archive[0]).toHaveProperty('completedAt');
      expect(typeof result.archive[0].completedAt).toBe('string');
      expect(new Date(result.archive[0].completedAt)).toBeInstanceOf(Date);
    });

    test('should preserve todo categories when completing', () => {
      const todos = [
        { id: '1', text: 'Todo 1', categories: { priority: 'high', time: 'today' } },
      ];
      const archive = [];

      const result = completeTodo(todos, archive, '1');

      expect(result.archive[0].categories).toEqual({ priority: 'high', time: 'today' });
    });

    test('should add to existing archive', () => {
      const todos = [{ id: '2', text: 'Todo 2', categories: {} }];
      const archive = [
        { id: '1', text: 'Already archived', categories: {}, completedAt: '2024-01-01' },
      ];

      const result = completeTodo(todos, archive, '2');

      expect(result.archive).toHaveLength(2);
      expect(result.archive[0].id).toBe('1');
      expect(result.archive[1].id).toBe('2');
    });

    test('should return unchanged if todo id not found', () => {
      const todos = [{ id: '1', text: 'Todo 1', categories: {} }];
      const archive = [];

      const result = completeTodo(todos, archive, 'non-existent');

      expect(result.todos).toEqual(todos);
      expect(result.archive).toEqual(archive);
    });
  });

  describe('Restore Operation', () => {
    test('should restore todo from archive to todos', () => {
      const todos = [{ id: '1', text: 'Active todo', categories: {} }];
      const archive = [
        { id: '2', text: 'Archived todo', categories: { priority: 'high' }, completedAt: '2024-01-01' },
      ];

      const result = restoreTodo(todos, archive, '2');

      expect(result.todos).toHaveLength(2);
      expect(result.todos[1].id).toBe('2');
      expect(result.todos[1].text).toBe('Archived todo');
      expect(result.archive).toHaveLength(0);
    });

    test('should remove completedAt when restoring', () => {
      const todos = [];
      const archive = [
        { id: '1', text: 'Todo', categories: {}, completedAt: '2024-01-01' },
      ];

      const result = restoreTodo(todos, archive, '1');

      expect(result.todos[0]).not.toHaveProperty('completedAt');
    });

    test('should preserve categories when restoring', () => {
      const todos = [];
      const archive = [
        { id: '1', text: 'Todo', categories: { priority: 'high', time: 'today' }, completedAt: '2024-01-01' },
      ];

      const result = restoreTodo(todos, archive, '1');

      expect(result.todos[0].categories).toEqual({ priority: 'high', time: 'today' });
    });

    test('should restore to existing todos list', () => {
      const todos = [
        { id: '1', text: 'Todo 1', categories: {} },
        { id: '2', text: 'Todo 2', categories: {} },
      ];
      const archive = [
        { id: '3', text: 'Archived todo', categories: {}, completedAt: '2024-01-01' },
      ];

      const result = restoreTodo(todos, archive, '3');

      expect(result.todos).toHaveLength(3);
      expect(result.todos[2].id).toBe('3');
    });

    test('should return unchanged if archived todo id not found', () => {
      const todos = [{ id: '1', text: 'Todo 1', categories: {} }];
      const archive = [{ id: '2', text: 'Archived', categories: {}, completedAt: '2024-01-01' }];

      const result = restoreTodo(todos, archive, 'non-existent');

      expect(result.todos).toEqual(todos);
      expect(result.archive).toEqual(archive);
    });
  });

  describe('Delete from Archive Operation', () => {
    test('should delete todo from archive', () => {
      const archive = [
        { id: '1', text: 'Archived 1', categories: {}, completedAt: '2024-01-01' },
        { id: '2', text: 'Archived 2', categories: {}, completedAt: '2024-01-02' },
        { id: '3', text: 'Archived 3', categories: {}, completedAt: '2024-01-03' },
      ];

      const result = deleteFromArchive(archive, '2');

      expect(result).toHaveLength(2);
      expect(result.find(todo => todo.id === '2')).toBeUndefined();
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('3');
    });

    test('should return unchanged array if archived todo id not found', () => {
      const archive = [
        { id: '1', text: 'Archived', categories: {}, completedAt: '2024-01-01' },
      ];

      const result = deleteFromArchive(archive, 'non-existent');

      expect(result).toEqual(archive);
    });

    test('should handle deleting from empty archive', () => {
      const archive = [];

      const result = deleteFromArchive(archive, '1');

      expect(result).toEqual([]);
    });
  });

  describe('Filter/Read Operation', () => {
    const todos = [
      { id: '1', text: 'Buy groceries', categories: { priority: 'high', time: 'today' } },
      { id: '2', text: 'Walk the dog', categories: { priority: 'medium', time: 'today' } },
      { id: '3', text: 'Write report', categories: { priority: 'high', time: 'this-week' } },
      { id: '4', text: 'Call dentist', categories: { priority: 'low', time: 'later' } },
    ];

    test('should return all todos when no search text or filters', () => {
      const result = filterTodos(todos, '', {});

      expect(result).toHaveLength(4);
    });

    test('should filter todos by search text', () => {
      const result = filterTodos(todos, 'report', {});

      expect(result).toHaveLength(1);
      expect(result[0].text).toBe('Write report');
    });

    test('should filter todos case-insensitively', () => {
      const result = filterTodos(todos, 'WALK', {});

      expect(result).toHaveLength(1);
      expect(result[0].text).toBe('Walk the dog');
    });

    test('should filter todos by partial text match', () => {
      const result = filterTodos(todos, 'the', {});

      expect(result).toHaveLength(1);
      expect(result[0].text).toBe('Walk the dog');
    });

    test('should filter todos by single category', () => {
      const result = filterTodos(todos, '', { priority: 'high' });

      expect(result).toHaveLength(2);
      expect(result[0].text).toBe('Buy groceries');
      expect(result[1].text).toBe('Write report');
    });

    test('should filter todos by multiple categories', () => {
      const result = filterTodos(todos, '', { priority: 'high', time: 'today' });

      expect(result).toHaveLength(1);
      expect(result[0].text).toBe('Buy groceries');
    });

    test('should filter by both search text and categories', () => {
      const result = filterTodos(todos, 'dog', { priority: 'medium' });

      expect(result).toHaveLength(1);
      expect(result[0].text).toBe('Walk the dog');
    });

    test('should handle "all" filter value', () => {
      const result = filterTodos(todos, '', { priority: 'all', time: 'all' });

      expect(result).toHaveLength(4);
    });

    test('should return empty array when no matches', () => {
      const result = filterTodos(todos, 'nonexistent', {});

      expect(result).toHaveLength(0);
    });

    test('should exclude todos without categories when filtering by specific category', () => {
      const todosWithMissingCategories = [
        ...todos,
        { id: '5', text: 'No categories', categories: null },
      ];

      const result = filterTodos(todosWithMissingCategories, '', { priority: 'high' });

      expect(result).toHaveLength(2);
      expect(result.find(todo => todo.id === '5')).toBeUndefined();
    });

    test('should trim whitespace from search text', () => {
      const result = filterTodos(todos, '  report  ', {});

      expect(result).toHaveLength(1);
      expect(result[0].text).toBe('Write report');
    });
  });
});
