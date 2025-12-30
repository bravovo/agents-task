import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock crypto.randomUUID
let uuidCounter = 0;
global.crypto = {
  randomUUID: () => {
    uuidCounter++;
    return `test-uuid-${uuidCounter}`;
  },
};

describe('App Component', () => {
  beforeEach(() => {
    localStorageMock.clear();
    uuidCounter = 0;
  });

  describe('Initial Rendering', () => {
    test('renders the app with title', () => {
      render(<App />);
      expect(screen.getByText('Todo App')).toBeInTheDocument();
    });

    test('renders empty state message when no todos', () => {
      render(<App />);
      expect(screen.getByText('No todos yet. Add one to get started!')).toBeInTheDocument();
    });

    test('renders add todo form', () => {
      render(<App />);
      expect(screen.getByPlaceholderText('Enter a new todo...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add Todo' })).toBeInTheDocument();
    });

    test('renders view toggle buttons', () => {
      render(<App />);
      expect(screen.getByRole('button', { name: /Active Todos/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Archive/i })).toBeInTheDocument();
    });

    test('renders theme toggle button', () => {
      render(<App />);
      expect(screen.getByRole('button', { name: 'Toggle theme' })).toBeInTheDocument();
    });
  });

  describe('Adding Todos', () => {
    test('adds a new todo when form is submitted', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText('Enter a new todo...');
      const addButton = screen.getByRole('button', { name: 'Add Todo' });

      await user.type(input, 'Buy groceries');
      await user.click(addButton);

      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(input).toHaveValue('');
    });

    test('does not add empty todo', async () => {
      const user = userEvent.setup();
      render(<App />);

      const addButton = screen.getByRole('button', { name: 'Add Todo' });
      await user.click(addButton);

      expect(screen.getByText('No todos yet. Add one to get started!')).toBeInTheDocument();
    });

    test('trims whitespace from todo text', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText('Enter a new todo...');
      await user.type(input, '  Trimmed todo  ');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      expect(screen.getByText('Trimmed todo')).toBeInTheDocument();
    });

    test('adds todo with selected categories', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText('Enter a new todo...');
      // Get the priority select in the add form by its id
      const prioritySelect = document.getElementById('priority-select');

      await user.selectOptions(prioritySelect, 'high');
      await user.type(input, 'Important task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      expect(screen.getByText('Important task')).toBeInTheDocument();
      // Look for the category badge with specific class
      const badges = document.querySelectorAll('.category-badge');
      const hasPriorityBadge = Array.from(badges).some(badge => badge.textContent === 'High');
      expect(hasPriorityBadge).toBe(true);
    });

    test('updates todo count in view toggle', async () => {
      const user = userEvent.setup();
      render(<App />);

      expect(screen.getByText('Active Todos (0)')).toBeInTheDocument();

      const input = screen.getByPlaceholderText('Enter a new todo...');
      await user.type(input, 'First todo');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      expect(screen.getByText('Active Todos (1)')).toBeInTheDocument();
    });
  });

  describe('Editing Todos', () => {
    test('enters edit mode when edit button is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add a todo first
      const input = screen.getByPlaceholderText('Enter a new todo...');
      await user.type(input, 'Original text');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      // Click edit button
      const editButton = screen.getByRole('button', { name: 'Edit' });
      await user.click(editButton);

      // Check if edit input is visible
      const editInput = screen.getByDisplayValue('Original text');
      expect(editInput).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    test('saves edited todo text', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add a todo
      const input = screen.getByPlaceholderText('Enter a new todo...');
      await user.type(input, 'Original text');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      // Edit the todo
      await user.click(screen.getByRole('button', { name: 'Edit' }));
      const editInput = screen.getByDisplayValue('Original text');
      await user.clear(editInput);
      await user.type(editInput, 'Updated text');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(screen.getByText('Updated text')).toBeInTheDocument();
      expect(screen.queryByText('Original text')).not.toBeInTheDocument();
    });

    test('cancels edit without saving changes', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add a todo
      const input = screen.getByPlaceholderText('Enter a new todo...');
      await user.type(input, 'Original text');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      // Start editing
      await user.click(screen.getByRole('button', { name: 'Edit' }));
      const editInput = screen.getByDisplayValue('Original text');
      await user.clear(editInput);
      await user.type(editInput, 'Changed text');
      
      // Cancel
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(screen.getByText('Original text')).toBeInTheDocument();
      expect(screen.queryByText('Changed text')).not.toBeInTheDocument();
    });

    test('does not save empty edited text', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add a todo
      const input = screen.getByPlaceholderText('Enter a new todo...');
      await user.type(input, 'Original text');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      // Try to save empty text
      await user.click(screen.getByRole('button', { name: 'Edit' }));
      const editInput = screen.getByDisplayValue('Original text');
      await user.clear(editInput);
      await user.click(screen.getByRole('button', { name: 'Save' }));

      // Should still show the edit input (in edit mode) since empty text wasn't saved
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });
  });

  describe('Deleting Todos', () => {
    test('deletes a todo when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add a todo
      const input = screen.getByPlaceholderText('Enter a new todo...');
      await user.type(input, 'Todo to delete');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      expect(screen.getByText('Todo to delete')).toBeInTheDocument();

      // Delete the todo
      const deleteButton = screen.getByRole('button', { name: 'Delete' });
      await user.click(deleteButton);

      expect(screen.queryByText('Todo to delete')).not.toBeInTheDocument();
      expect(screen.getByText('No todos yet. Add one to get started!')).toBeInTheDocument();
    });

    test('deletes correct todo from multiple todos', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add multiple todos
      const input = screen.getByPlaceholderText('Enter a new todo...');
      
      await user.type(input, 'First todo');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));
      
      await user.type(input, 'Second todo');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      // Delete the first todo
      const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
      await user.click(deleteButtons[0]);

      expect(screen.queryByText('First todo')).not.toBeInTheDocument();
      expect(screen.getByText('Second todo')).toBeInTheDocument();
    });
  });

  describe('Completing Todos (Archive)', () => {
    test('moves todo to archive when complete button is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add a todo
      const input = screen.getByPlaceholderText('Enter a new todo...');
      await user.type(input, 'Complete this task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      expect(screen.getByText('Active Todos (1)')).toBeInTheDocument();

      // Complete the todo
      await user.click(screen.getByRole('button', { name: 'Complete' }));

      // Check active view
      expect(screen.queryByText('Complete this task')).not.toBeInTheDocument();
      expect(screen.getByText('Active Todos (0)')).toBeInTheDocument();
      expect(screen.getByText('Archive (1)')).toBeInTheDocument();

      // Switch to archive view
      await user.click(screen.getByRole('button', { name: /Archive/i }));
      expect(screen.getByText('Complete this task')).toBeInTheDocument();
    });

    test('preserves todo categories when completing', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add a todo with high priority - use getElementById approach
      const input = screen.getByPlaceholderText('Enter a new todo...');
      const prioritySelect = document.getElementById('priority-select');
      
      await user.selectOptions(prioritySelect, 'high');
      await user.type(input, 'High priority task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      // Complete it
      await user.click(screen.getByRole('button', { name: 'Complete' }));

      // Switch to archive and verify category is preserved
      await user.click(screen.getByRole('button', { name: /Archive/i }));
      expect(screen.getByText('High priority task')).toBeInTheDocument();
      
      // Look for the category badge with specific class in archived items
      const badges = document.querySelectorAll('.archived .category-badge');
      const hasPriorityBadge = Array.from(badges).some(badge => badge.textContent === 'High');
      expect(hasPriorityBadge).toBe(true);
    });
  });

  describe('Restoring Todos from Archive', () => {
    test('restores todo from archive to active list', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add and complete a todo
      const input = screen.getByPlaceholderText('Enter a new todo...');
      await user.type(input, 'Task to restore');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));
      await user.click(screen.getByRole('button', { name: 'Complete' }));

      // Go to archive
      await user.click(screen.getByRole('button', { name: /Archive/i }));
      expect(screen.getByText('Task to restore')).toBeInTheDocument();

      // Restore the todo
      await user.click(screen.getByRole('button', { name: 'Restore' }));
      expect(screen.queryByText('Task to restore')).not.toBeInTheDocument();
      expect(screen.getByText('No archived todos yet.')).toBeInTheDocument();

      // Switch back to active view
      await user.click(screen.getByRole('button', { name: /Active Todos/i }));
      expect(screen.getByText('Task to restore')).toBeInTheDocument();
    });

    test('updates counts when restoring todos', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add and complete a todo
      const input = screen.getByPlaceholderText('Enter a new todo...');
      await user.type(input, 'Task to restore');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));
      await user.click(screen.getByRole('button', { name: 'Complete' }));

      expect(screen.getByText('Active Todos (0)')).toBeInTheDocument();
      expect(screen.getByText('Archive (1)')).toBeInTheDocument();

      // Restore
      await user.click(screen.getByRole('button', { name: /Archive/i }));
      await user.click(screen.getByRole('button', { name: 'Restore' }));

      expect(screen.getByText('Active Todos (1)')).toBeInTheDocument();
      expect(screen.getByText('Archive (0)')).toBeInTheDocument();
    });
  });

  describe('Deleting from Archive', () => {
    test('permanently deletes todo from archive', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add and complete a todo
      const input = screen.getByPlaceholderText('Enter a new todo...');
      await user.type(input, 'Task to delete from archive');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));
      await user.click(screen.getByRole('button', { name: 'Complete' }));

      // Go to archive and delete
      await user.click(screen.getByRole('button', { name: /Archive/i }));
      expect(screen.getByText('Task to delete from archive')).toBeInTheDocument();
      
      await user.click(screen.getByRole('button', { name: 'Delete' }));
      expect(screen.queryByText('Task to delete from archive')).not.toBeInTheDocument();
      expect(screen.getByText('No archived todos yet.')).toBeInTheDocument();
    });
  });

  describe('Searching and Filtering', () => {
    test('filters todos by search text', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add multiple todos
      const input = screen.getByPlaceholderText('Enter a new todo...');
      await user.type(input, 'Buy groceries');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));
      
      await user.type(input, 'Walk the dog');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      // Search for "dog"
      const searchInput = screen.getByPlaceholderText('Search todos...');
      await user.type(searchInput, 'dog');

      expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument();
      expect(screen.getByText('Walk the dog')).toBeInTheDocument();
    });

    test('search is case-insensitive', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText('Enter a new todo...');
      await user.type(input, 'Buy GROCERIES');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      const searchInput = screen.getByPlaceholderText('Search todos...');
      await user.type(searchInput, 'groceries');

      expect(screen.getByText('Buy GROCERIES')).toBeInTheDocument();
    });

    test('filters todos by priority category', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add todo with high priority
      const input = screen.getByPlaceholderText('Enter a new todo...');
      const prioritySelect = document.getElementById('priority-select');
      
      await user.selectOptions(prioritySelect, 'high');
      await user.type(input, 'High priority task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      // Add todo with low priority
      await user.selectOptions(prioritySelect, 'low');
      await user.type(input, 'Low priority task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      // Filter by high priority using the filter select (not the add form select)
      const priorityFilter = document.getElementById('filter-priority');
      
      await user.selectOptions(priorityFilter, 'high');

      expect(screen.getByText('High priority task')).toBeInTheDocument();
      expect(screen.queryByText('Low priority task')).not.toBeInTheDocument();
    });

    test('shows message when no todos match search', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText('Enter a new todo...');
      await user.type(input, 'Buy groceries');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      const searchInput = screen.getByPlaceholderText('Search todos...');
      await user.type(searchInput, 'nonexistent');

      expect(screen.getByText('No todos match your search or filters.')).toBeInTheDocument();
    });
  });

  describe('Theme Toggle', () => {
    test('toggles between light and dark theme', async () => {
      const user = userEvent.setup();
      render(<App />);

      const themeButton = screen.getByRole('button', { name: 'Toggle theme' });
      
      // Initial theme is light
      expect(themeButton).toHaveTextContent('🌙');

      // Toggle to dark
      await user.click(themeButton);
      expect(themeButton).toHaveTextContent('☀️');

      // Toggle back to light
      await user.click(themeButton);
      expect(themeButton).toHaveTextContent('🌙');
    });

    test('persists theme preference in localStorage', async () => {
      const user = userEvent.setup();
      render(<App />);

      const themeButton = screen.getByRole('button', { name: 'Toggle theme' });
      await user.click(themeButton);

      expect(localStorageMock.getItem('todo-app-theme')).toBe('dark');
    });

    test('loads saved theme from localStorage', () => {
      localStorageMock.setItem('todo-app-theme', 'dark');
      render(<App />);

      const themeButton = screen.getByRole('button', { name: 'Toggle theme' });
      expect(themeButton).toHaveTextContent('☀️');
    });
  });

  describe('View Toggle', () => {
    test('switches between active and archive views', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add and complete a todo
      const input = screen.getByPlaceholderText('Enter a new todo...');
      await user.type(input, 'Test task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));
      await user.click(screen.getByRole('button', { name: 'Complete' }));

      // Initially in active view
      expect(screen.queryByText('Test task')).not.toBeInTheDocument();

      // Switch to archive
      await user.click(screen.getByRole('button', { name: /Archive/i }));
      expect(screen.getByText('Test task')).toBeInTheDocument();

      // Switch back to active
      await user.click(screen.getByRole('button', { name: /Active Todos/i }));
      expect(screen.queryByText('Test task')).not.toBeInTheDocument();
    });

    test('shows correct active class on toggle buttons', async () => {
      const user = userEvent.setup();
      render(<App />);

      const activeButton = screen.getByRole('button', { name: /Active Todos/i });
      const archiveButton = screen.getByRole('button', { name: /Archive/i });

      // Active view is selected by default
      expect(activeButton).toHaveClass('active');
      expect(archiveButton).not.toHaveClass('active');

      // Switch to archive
      await user.click(archiveButton);
      expect(activeButton).not.toHaveClass('active');
      expect(archiveButton).toHaveClass('active');
    });
  });

  describe('Integration Tests', () => {
    test('complete workflow: add, edit, complete, restore, delete', async () => {
      const user = userEvent.setup();
      render(<App />);

      // 1. Add a todo
      const input = screen.getByPlaceholderText('Enter a new todo...');
      await user.type(input, 'Original task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));
      expect(screen.getByText('Original task')).toBeInTheDocument();

      // 2. Edit the todo
      await user.click(screen.getByRole('button', { name: 'Edit' }));
      const editInput = screen.getByDisplayValue('Original task');
      await user.clear(editInput);
      await user.type(editInput, 'Updated task');
      await user.click(screen.getByRole('button', { name: 'Save' }));
      expect(screen.getByText('Updated task')).toBeInTheDocument();

      // 3. Complete the todo
      await user.click(screen.getByRole('button', { name: 'Complete' }));
      expect(screen.queryByText('Updated task')).not.toBeInTheDocument();

      // 4. Restore from archive
      await user.click(screen.getByRole('button', { name: /Archive/i }));
      expect(screen.getByText('Updated task')).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: 'Restore' }));

      // 5. Delete permanently
      await user.click(screen.getByRole('button', { name: /Active Todos/i }));
      await user.click(screen.getByRole('button', { name: 'Delete' }));
      expect(screen.queryByText('Updated task')).not.toBeInTheDocument();
      expect(screen.getByText('No todos yet. Add one to get started!')).toBeInTheDocument();
    });

    test('multiple todos with categories and filtering', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText('Enter a new todo...');
      const prioritySelect = document.getElementById('priority-select');

      // Add high priority todo
      await user.selectOptions(prioritySelect, 'high');
      await user.type(input, 'Urgent task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      // Add medium priority todo
      await user.selectOptions(prioritySelect, 'medium');
      await user.type(input, 'Normal task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      // Add low priority todo
      await user.selectOptions(prioritySelect, 'low');
      await user.type(input, 'Minor task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      // Verify all are visible
      expect(screen.getByText('Urgent task')).toBeInTheDocument();
      expect(screen.getByText('Normal task')).toBeInTheDocument();
      expect(screen.getByText('Minor task')).toBeInTheDocument();

      // Filter by high priority
      const priorityFilter = document.getElementById('filter-priority');
      
      await user.selectOptions(priorityFilter, 'high');

      expect(screen.getByText('Urgent task')).toBeInTheDocument();
      expect(screen.queryByText('Normal task')).not.toBeInTheDocument();
      expect(screen.queryByText('Minor task')).not.toBeInTheDocument();
    });
  });
});
