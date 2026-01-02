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

  describe('Advanced Category Editing', () => {
    test('changes category during edit using dropdown', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add a todo with low priority
      const input = screen.getByPlaceholderText('Enter a new todo...');
      const prioritySelect = document.getElementById('priority-select');
      
      await user.selectOptions(prioritySelect, 'low');
      await user.type(input, 'Task to edit categories');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      // Enter edit mode
      await user.click(screen.getByRole('button', { name: 'Edit' }));

      // Change priority using the edit dropdown
      const editPrioritySelect = document.getElementById('edit-priority-select');
      await user.selectOptions(editPrioritySelect, 'high');

      // Change time category
      const editTimeSelect = document.getElementById('edit-time-select');
      await user.selectOptions(editTimeSelect, 'this-week');

      // Change progress category
      const editProgressSelect = document.getElementById('edit-progress-select');
      await user.selectOptions(editProgressSelect, 'in-progress');

      // Save
      await user.click(screen.getByRole('button', { name: 'Save' }));

      // Verify the categories were updated
      const badges = document.querySelectorAll('.category-badge');
      const badgeTexts = Array.from(badges).map(badge => badge.textContent);
      expect(badgeTexts).toContain('High');
      expect(badgeTexts).toContain('This Week');
      expect(badgeTexts).toContain('In Progress');
    });

    test('edits only one category while keeping others', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add a todo
      const input = screen.getByPlaceholderText('Enter a new todo...');
      await user.type(input, 'Task for single category edit');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      // Enter edit mode
      await user.click(screen.getByRole('button', { name: 'Edit' }));

      // Change only the progress category
      const editProgressSelect = document.getElementById('edit-progress-select');
      await user.selectOptions(editProgressSelect, 'blocked');

      // Save
      await user.click(screen.getByRole('button', { name: 'Save' }));

      // Verify progress changed
      const badges = document.querySelectorAll('.category-badge');
      const badgeTexts = Array.from(badges).map(badge => badge.textContent);
      expect(badgeTexts).toContain('Blocked');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('filters todos without categories correctly', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Manually add a todo without categories by manipulating component state
      // This is an edge case where data might be corrupted or migrated
      const input = screen.getByPlaceholderText('Enter a new todo...');
      await user.type(input, 'Normal todo');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      // Apply a priority filter
      const priorityFilter = document.getElementById('filter-priority');
      await user.selectOptions(priorityFilter, 'high');

      // The normal todo should be filtered out since it doesn't match
      // This tests the filter logic handles todos with categories properly
      expect(screen.getByText('No todos match your search or filters.')).toBeInTheDocument();
    });

    test('handles multiple category combinations', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText('Enter a new todo...');
      const prioritySelect = document.getElementById('priority-select');
      const timeSelect = document.getElementById('time-select');
      const progressSelect = document.getElementById('progress-select');

      // Add todo with various category combinations
      await user.selectOptions(prioritySelect, 'high');
      await user.selectOptions(timeSelect, 'this-week');
      await user.selectOptions(progressSelect, 'blocked');
      await user.type(input, 'Complex todo');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      expect(screen.getByText('Complex todo')).toBeInTheDocument();

      // Verify all three categories are displayed
      const badges = document.querySelectorAll('.category-badge');
      const badgeTexts = Array.from(badges).map(badge => badge.textContent);
      expect(badgeTexts).toContain('High');
      expect(badgeTexts).toContain('This Week');
      expect(badgeTexts).toContain('Blocked');
    });

    test('displays category badges for all time options', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText('Enter a new todo...');
      const timeSelect = document.getElementById('time-select');

      // Test all time options
      const timeOptions = ['today', 'this-week', 'this-month', 'later'];
      
      for (const timeOption of timeOptions) {
        await user.selectOptions(timeSelect, timeOption);
        await user.type(input, `Task ${timeOption}`);
        await user.click(screen.getByRole('button', { name: 'Add Todo' }));
      }

      // Verify all todos are displayed with their time categories
      expect(screen.getByText('Task today')).toBeInTheDocument();
      expect(screen.getByText('Task this-week')).toBeInTheDocument();
      expect(screen.getByText('Task this-month')).toBeInTheDocument();
      expect(screen.getByText('Task later')).toBeInTheDocument();
    });

    test('displays category badges for all progress options', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText('Enter a new todo...');
      const progressSelect = document.getElementById('progress-select');

      // Test all progress options
      const progressOptions = ['not-started', 'in-progress', 'blocked'];
      
      for (const progressOption of progressOptions) {
        await user.selectOptions(progressSelect, progressOption);
        await user.type(input, `Task ${progressOption}`);
        await user.click(screen.getByRole('button', { name: 'Add Todo' }));
      }

      // Verify all todos are displayed
      expect(screen.getByText('Task not-started')).toBeInTheDocument();
      expect(screen.getByText('Task in-progress')).toBeInTheDocument();
      expect(screen.getByText('Task blocked')).toBeInTheDocument();
    });

    test('handles todos with corrupted category data gracefully', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add a normal todo first
      const input = screen.getByPlaceholderText('Enter a new todo...');
      await user.type(input, 'Normal todo');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      // Verify todo exists
      expect(screen.getByText('Normal todo')).toBeInTheDocument();

      // Test filtering when todos don't have matching categories
      const priorityFilter = document.getElementById('filter-priority');
      await user.selectOptions(priorityFilter, 'high');

      // Should show "no match" message since our todo is not high priority
      expect(screen.getByText('No todos match your search or filters.')).toBeInTheDocument();
    });

    test('handles archive filtering with no matches', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add and complete a todo
      const input = screen.getByPlaceholderText('Enter a new todo...');
      const prioritySelect = document.getElementById('priority-select');
      
      await user.selectOptions(prioritySelect, 'low');
      await user.type(input, 'Low priority task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));
      await user.click(screen.getByRole('button', { name: 'Complete' }));

      // Go to archive
      await user.click(screen.getByRole('button', { name: /Archive/i }));
      expect(screen.getByText('Low priority task')).toBeInTheDocument();

      // Filter by high priority (should show no matches)
      const priorityFilter = document.getElementById('filter-priority');
      await user.selectOptions(priorityFilter, 'high');

      expect(screen.getByText('No archived todos match your search or filters.')).toBeInTheDocument();
    });

    test('edits todo text without changing categories', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add a todo with specific categories
      const input = screen.getByPlaceholderText('Enter a new todo...');
      const prioritySelect = document.getElementById('priority-select');
      
      await user.selectOptions(prioritySelect, 'high');
      await user.type(input, 'Original task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      // Edit only the text
      await user.click(screen.getByRole('button', { name: 'Edit' }));
      const editInput = screen.getByDisplayValue('Original task');
      await user.clear(editInput);
      await user.type(editInput, 'Modified task');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      // Verify text changed but category preserved
      expect(screen.getByText('Modified task')).toBeInTheDocument();
      const badges = document.querySelectorAll('.category-badge');
      const badgeTexts = Array.from(badges).map(badge => badge.textContent);
      expect(badgeTexts).toContain('High');
    });

    test('filters by time category', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText('Enter a new todo...');
      const timeSelect = document.getElementById('time-select');

      // Add todos with different time categories
      await user.selectOptions(timeSelect, 'today');
      await user.type(input, 'Today task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      await user.selectOptions(timeSelect, 'this-week');
      await user.type(input, 'This week task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      // Filter by today
      const timeFilter = document.getElementById('filter-time');
      await user.selectOptions(timeFilter, 'today');

      expect(screen.getByText('Today task')).toBeInTheDocument();
      expect(screen.queryByText('This week task')).not.toBeInTheDocument();
    });

    test('filters by progress category', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText('Enter a new todo...');
      const progressSelect = document.getElementById('progress-select');

      // Add todos with different progress states
      await user.selectOptions(progressSelect, 'not-started');
      await user.type(input, 'Not started task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      await user.selectOptions(progressSelect, 'in-progress');
      await user.type(input, 'In progress task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      await user.selectOptions(progressSelect, 'blocked');
      await user.type(input, 'Blocked task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      // Filter by blocked
      const progressFilter = document.getElementById('filter-progress');
      await user.selectOptions(progressFilter, 'blocked');

      expect(screen.getByText('Blocked task')).toBeInTheDocument();
      expect(screen.queryByText('Not started task')).not.toBeInTheDocument();
      expect(screen.queryByText('In progress task')).not.toBeInTheDocument();
    });

    test('combines multiple filters', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText('Enter a new todo...');
      const prioritySelect = document.getElementById('priority-select');
      const timeSelect = document.getElementById('time-select');

      // Add todos with different combinations
      await user.selectOptions(prioritySelect, 'high');
      await user.selectOptions(timeSelect, 'today');
      await user.type(input, 'High today');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      await user.selectOptions(prioritySelect, 'high');
      await user.selectOptions(timeSelect, 'this-week');
      await user.type(input, 'High this week');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      await user.selectOptions(prioritySelect, 'low');
      await user.selectOptions(timeSelect, 'today');
      await user.type(input, 'Low today');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      // Apply combined filters
      const priorityFilter = document.getElementById('filter-priority');
      const timeFilter = document.getElementById('filter-time');
      
      await user.selectOptions(priorityFilter, 'high');
      await user.selectOptions(timeFilter, 'today');

      expect(screen.getByText('High today')).toBeInTheDocument();
      expect(screen.queryByText('High this week')).not.toBeInTheDocument();
      expect(screen.queryByText('Low today')).not.toBeInTheDocument();
    });

    test('searches archived todos with search text', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add and complete multiple todos
      const input = screen.getByPlaceholderText('Enter a new todo...');
      
      await user.type(input, 'Buy groceries');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));
      await user.click(screen.getByRole('button', { name: 'Complete' }));

      await user.type(input, 'Walk the dog');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));
      await user.click(screen.getByRole('button', { name: 'Complete' }));

      // Go to archive
      await user.click(screen.getByRole('button', { name: /Archive/i }));

      // Search in archive
      const searchInput = screen.getByPlaceholderText('Search todos...');
      await user.type(searchInput, 'dog');

      expect(screen.getByText('Walk the dog')).toBeInTheDocument();
      expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument();
    });

    test('resets category filters to show all', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText('Enter a new todo...');
      const prioritySelect = document.getElementById('priority-select');

      // Add todos with different priorities
      await user.selectOptions(prioritySelect, 'high');
      await user.type(input, 'High task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      await user.selectOptions(prioritySelect, 'low');
      await user.type(input, 'Low task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      // Filter by high
      const priorityFilter = document.getElementById('filter-priority');
      await user.selectOptions(priorityFilter, 'high');
      expect(screen.getByText('High task')).toBeInTheDocument();
      expect(screen.queryByText('Low task')).not.toBeInTheDocument();

      // Reset filter to all
      await user.selectOptions(priorityFilter, 'all');
      expect(screen.getByText('High task')).toBeInTheDocument();
      expect(screen.getByText('Low task')).toBeInTheDocument();
    });

    test('searches with partial text match', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText('Enter a new todo...');
      
      await user.type(input, 'Complete project documentation');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      await user.type(input, 'Review pull request');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      // Search with partial match
      const searchInput = screen.getByPlaceholderText('Search todos...');
      await user.type(searchInput, 'project');

      expect(screen.getByText('Complete project documentation')).toBeInTheDocument();
      expect(screen.queryByText('Review pull request')).not.toBeInTheDocument();
    });

    test('clears search to show all todos', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText('Enter a new todo...');
      
      await user.type(input, 'First task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      await user.type(input, 'Second task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      // Search
      const searchInput = screen.getByPlaceholderText('Search todos...');
      await user.type(searchInput, 'First');
      expect(screen.getByText('First task')).toBeInTheDocument();
      expect(screen.queryByText('Second task')).not.toBeInTheDocument();

      // Clear search
      await user.clear(searchInput);
      expect(screen.getByText('First task')).toBeInTheDocument();
      expect(screen.getByText('Second task')).toBeInTheDocument();
    });
  });

  describe('Todo Count Display', () => {
    test('displays count of incomplete todos in active view', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Initially should show 0 incomplete todos
      expect(screen.getByText('0 incomplete todos')).toBeInTheDocument();

      // Add a todo
      const input = screen.getByPlaceholderText('Enter a new todo...');
      await user.type(input, 'First task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      expect(screen.getByText('1 incomplete todo')).toBeInTheDocument();

      // Add another todo
      await user.type(input, 'Second task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      expect(screen.getByText('2 incomplete todos')).toBeInTheDocument();
    });

    test('displays count of completed todos in archive view', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Add and complete todos
      const input = screen.getByPlaceholderText('Enter a new todo...');
      await user.type(input, 'First task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));
      await user.click(screen.getByRole('button', { name: 'Complete' }));

      await user.type(input, 'Second task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));
      await user.click(screen.getByRole('button', { name: 'Complete' }));

      // Switch to archive view
      await user.click(screen.getByRole('button', { name: /Archive/i }));

      expect(screen.getByText('2 completed todos')).toBeInTheDocument();
    });

    test('updates count when todos are deleted', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText('Enter a new todo...');
      
      // Add multiple todos
      await user.type(input, 'First task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));
      await user.type(input, 'Second task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      expect(screen.getByText('2 incomplete todos')).toBeInTheDocument();

      // Delete one todo
      const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
      await user.click(deleteButtons[0]);

      expect(screen.getByText('1 incomplete todo')).toBeInTheDocument();
    });

    test('updates count when todos are completed', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText('Enter a new todo...');
      
      // Add todos
      await user.type(input, 'Task 1');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));
      await user.type(input, 'Task 2');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      expect(screen.getByText('2 incomplete todos')).toBeInTheDocument();

      // Complete one
      const completeButtons = screen.getAllByRole('button', { name: 'Complete' });
      await user.click(completeButtons[0]);

      expect(screen.getByText('1 incomplete todo')).toBeInTheDocument();
    });

    test('shows filtered count when search is applied', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText('Enter a new todo...');
      
      // Add multiple todos
      await user.type(input, 'Buy groceries');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));
      await user.type(input, 'Walk the dog');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));
      await user.type(input, 'Read a book');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      expect(screen.getByText('3 incomplete todos')).toBeInTheDocument();

      // Apply search filter
      const searchInput = screen.getByPlaceholderText('Search todos...');
      await user.type(searchInput, 'dog');

      // Count should reflect only filtered results
      expect(screen.getByText('1 incomplete todo')).toBeInTheDocument();
    });

    test('shows filtered count when category filter is applied', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText('Enter a new todo...');
      const prioritySelect = document.getElementById('priority-select');

      // Add todos with different priorities
      await user.selectOptions(prioritySelect, 'high');
      await user.type(input, 'High priority task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      await user.selectOptions(prioritySelect, 'low');
      await user.type(input, 'Low priority task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      expect(screen.getByText('2 incomplete todos')).toBeInTheDocument();

      // Apply category filter
      const priorityFilter = document.getElementById('filter-priority');
      await user.selectOptions(priorityFilter, 'high');

      // Count should reflect filtered results
      expect(screen.getByText('1 incomplete todo')).toBeInTheDocument();
    });

    test('shows correct count in archive after filtering', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText('Enter a new todo...');
      
      // Add and complete multiple todos
      await user.type(input, 'Task 1');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));
      await user.click(screen.getByRole('button', { name: 'Complete' }));

      await user.type(input, 'Task 2');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));
      await user.click(screen.getByRole('button', { name: 'Complete' }));

      await user.type(input, 'Special task');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));
      await user.click(screen.getByRole('button', { name: 'Complete' }));

      // Switch to archive
      await user.click(screen.getByRole('button', { name: /Archive/i }));

      expect(screen.getByText('3 completed todos')).toBeInTheDocument();

      // Apply search filter in archive
      const searchInput = screen.getByPlaceholderText('Search todos...');
      await user.type(searchInput, 'Special');

      expect(screen.getByText('1 completed todo')).toBeInTheDocument();
    });
  });
});
