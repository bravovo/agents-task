import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });
  mockLocalStorage.clear();
  mockLocalStorage.getItem.mockReturnValue(null);
});

describe('Todo App - End-to-End Tests', () => {
  describe('Main E2E Scenario: Complete Todo Lifecycle', () => {
    test('should complete full lifecycle: create => edit => complete => search in archive => uncomplete => delete', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Step 1: Create a todo
      const input = screen.getByPlaceholderText('Add a new todo...');
      const submitButton = screen.getByText('Add Todo');
      
      await user.type(input, 'My important task');
      await user.click(submitButton);

      // Verify todo was created
      expect(screen.getByText('My important task')).toBeInTheDocument();
      expect(screen.getByText('1 uncompleted todo tasks')).toBeInTheDocument();

      // Step 2: Edit todo with new category
      const editButton = screen.getByRole('button', { name: /edit todo/i });
      await user.click(editButton);

      // Change the text
      const editInput = screen.getByPlaceholderText('Edit todo...');
      await user.clear(editInput);
      await user.type(editInput, 'My updated important task');

      // Change priority category from medium to high
      const highPriorityCheckboxes = screen.getAllByLabelText('High');
      // Find the checkbox in the edit form (not in search section)
      const editForm = editInput.closest('.todo-edit-form');
      const highPriorityInEdit = Array.from(highPriorityCheckboxes).find(
        checkbox => editForm?.contains(checkbox)
      );
      if (highPriorityInEdit) {
        await user.click(highPriorityInEdit);
      }

      // Add a time category
      const urgentCheckboxes = screen.getAllByLabelText('Urgent');
      const urgentInEdit = Array.from(urgentCheckboxes).find(
        checkbox => editForm?.contains(checkbox)
      );
      if (urgentInEdit) {
        await user.click(urgentInEdit);
      }

      // Save the edit
      const saveButton = screen.getByRole('button', { name: /^save$/i });
      await user.click(saveButton);

      // Verify todo was updated
      await waitFor(() => {
        expect(screen.getByText('My updated important task')).toBeInTheDocument();
        expect(screen.getByText('high')).toBeInTheDocument();
        expect(screen.getByText('urgent')).toBeInTheDocument();
      });

      // Step 3: Complete the todo
      const completeButton = screen.getByRole('button', { name: /mark as complete/i });
      await user.click(completeButton);

      // Verify todo moved to archive
      await waitFor(() => {
        expect(screen.queryByText('My updated important task')).not.toBeInTheDocument();
        expect(screen.getByText('0 uncompleted todo tasks')).toBeInTheDocument();
      });

      // Step 4: Switch to archive view and search for the todo
      const archiveButton = screen.getByRole('button', { name: /archive/i });
      await user.click(archiveButton);

      // Verify archive view
      await waitFor(() => {
        expect(screen.getByText('1 completed todo tasks')).toBeInTheDocument();
        expect(screen.getByText('My updated important task')).toBeInTheDocument();
      });

      // Search for the todo in archive
      const searchInput = screen.getByPlaceholderText('Search by text...');
      await user.type(searchInput, 'updated important');

      // Verify search results
      await waitFor(() => {
        expect(screen.getByText('My updated important task')).toBeInTheDocument();
        expect(screen.getByText('1 of 1 completed todo tasks')).toBeInTheDocument();
      });

      // Step 5: Uncomplete the todo (restore to active)
      // First clear the search
      const clearSearchButton = screen.getByRole('button', { name: /clear search/i });
      await user.click(clearSearchButton);

      const incompleteButton = screen.getByRole('button', { name: /mark as incomplete/i });
      await user.click(incompleteButton);

      // Switch back to active view
      const activeButton = screen.getByRole('button', { name: /active todos/i });
      await user.click(activeButton);

      // Verify todo is back in active list
      await waitFor(() => {
        expect(screen.getByText('My updated important task')).toBeInTheDocument();
        expect(screen.getByText('1 uncompleted todo tasks')).toBeInTheDocument();
      });

      // Step 6: Delete the todo from active list
      const deleteButtons = screen.getAllByRole('button', { name: /delete todo/i });
      const deleteButton = deleteButtons[0]; // Get the first delete button
      await user.click(deleteButton);

      // Verify todo was deleted
      await waitFor(() => {
        expect(screen.queryByText('My updated important task')).not.toBeInTheDocument();
        expect(screen.getByText('0 uncompleted todo tasks')).toBeInTheDocument();
      });
    });
  });

  describe('E2E Scenario: Multiple Todos Workflow', () => {
    test('should handle multiple todos: create multiple => complete some => search and filter => delete multiple', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Create multiple todos with different categories
      const input = screen.getByPlaceholderText('Add a new todo...');
      const submitButton = screen.getByText('Add Todo');

      // Todo 1: High priority, urgent
      const highCheckboxes = screen.getAllByLabelText('High');
      await user.click(highCheckboxes[1]); // Form checkbox
      const urgentCheckboxes = screen.getAllByLabelText('Urgent');
      await user.click(urgentCheckboxes[1]);
      await user.type(input, 'Urgent task');
      await user.click(submitButton);

      // Todo 2: Medium priority, today
      await waitFor(() => {
        expect(screen.getByText('Urgent task')).toBeInTheDocument();
      });
      const todayCheckboxes = screen.getAllByLabelText('Today');
      await user.click(todayCheckboxes[1]);
      await user.type(input, 'Today task');
      await user.click(submitButton);

      // Todo 3: Low priority, later
      await waitFor(() => {
        expect(screen.getByText('Today task')).toBeInTheDocument();
      });
      const lowCheckboxes = screen.getAllByLabelText('Low');
      await user.click(lowCheckboxes[1]);
      const laterCheckboxes = screen.getAllByLabelText('Later');
      await user.click(laterCheckboxes[1]);
      await user.type(input, 'Later task');
      await user.click(submitButton);

      // Verify all todos are created
      await waitFor(() => {
        expect(screen.getByText('3 uncompleted todo tasks')).toBeInTheDocument();
        expect(screen.getByText('Urgent task')).toBeInTheDocument();
        expect(screen.getByText('Today task')).toBeInTheDocument();
        expect(screen.getByText('Later task')).toBeInTheDocument();
      });

      // Complete the urgent task
      const completeButtons = screen.getAllByRole('button', { name: /mark as complete/i });
      await user.click(completeButtons[0]); // Complete first todo

      // Complete the today task
      await waitFor(() => {
        expect(screen.getByText('2 uncompleted todo tasks')).toBeInTheDocument();
      });
      const remainingCompleteButtons = screen.getAllByRole('button', { name: /mark as complete/i });
      await user.click(remainingCompleteButtons[0]);

      // Verify only one active todo remains
      await waitFor(() => {
        expect(screen.getByText('1 uncompleted todo tasks')).toBeInTheDocument();
        expect(screen.getByText('Later task')).toBeInTheDocument();
        expect(screen.queryByText('Urgent task')).not.toBeInTheDocument();
        expect(screen.queryByText('Today task')).not.toBeInTheDocument();
      });

      // Switch to archive and verify completed todos
      const archiveButton = screen.getByRole('button', { name: /archive/i });
      await user.click(archiveButton);

      await waitFor(() => {
        expect(screen.getByText('2 completed todo tasks')).toBeInTheDocument();
        expect(screen.getByText('Urgent task')).toBeInTheDocument();
        expect(screen.getByText('Today task')).toBeInTheDocument();
      });

      // Search by category in archive
      const searchInput = screen.getByPlaceholderText('Search by text...');
      const highSearchCheckboxes = screen.getAllByLabelText('High');
      // Find search section checkbox (first one)
      await user.click(highSearchCheckboxes[0]);

      // Verify filtered results
      await waitFor(() => {
        expect(screen.getByText('Urgent task')).toBeInTheDocument();
        expect(screen.queryByText('Today task')).not.toBeInTheDocument();
        expect(screen.getByText('1 of 2 completed todo tasks')).toBeInTheDocument();
      });

      // Clear search
      const clearSearchButton = screen.getByRole('button', { name: /clear search/i });
      await user.click(clearSearchButton);

      // Delete one todo from archive
      const deleteButtons = screen.getAllByRole('button', { name: /delete todo/i });
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('1 completed todo tasks')).toBeInTheDocument();
      });

      // Switch back to active and delete remaining todo
      const activeButton = screen.getByRole('button', { name: /active todos/i });
      await user.click(activeButton);

      const activeDeleteButton = screen.getByRole('button', { name: /delete todo/i });
      await user.click(activeDeleteButton);

      await waitFor(() => {
        expect(screen.getByText('0 uncompleted todo tasks')).toBeInTheDocument();
        expect(screen.queryByText('Later task')).not.toBeInTheDocument();
      });
    });
  });

  describe('E2E Scenario: Search and Filter Workflow', () => {
    test('should search and filter todos across active and archive views', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText('Add a new todo...');
      const submitButton = screen.getByText('Add Todo');

      // Create todos with different categories
      const highCheckboxes = screen.getAllByLabelText('High');
      await user.click(highCheckboxes[1]);
      await user.type(input, 'High priority task');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('High priority task')).toBeInTheDocument();
      });

      const mediumCheckboxes = screen.getAllByLabelText('Medium');
      await user.click(mediumCheckboxes[1]);
      const urgentCheckboxes = screen.getAllByLabelText('Urgent');
      await user.click(urgentCheckboxes[1]);
      await user.type(input, 'Medium urgent task');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Medium urgent task')).toBeInTheDocument();
      });

      // Search by text
      const searchInput = screen.getByPlaceholderText('Search by text...');
      await user.type(searchInput, 'High');

      await waitFor(() => {
        expect(screen.getByText('High priority task')).toBeInTheDocument();
        expect(screen.queryByText('Medium urgent task')).not.toBeInTheDocument();
        expect(screen.getByText('1 of 2 uncompleted todo tasks')).toBeInTheDocument();
      });

      // Clear text search and filter by category
      await user.clear(searchInput);
      const highSearchCheckbox = screen.getAllByLabelText('High')[0];
      await user.click(highSearchCheckbox);

      await waitFor(() => {
        expect(screen.getByText('High priority task')).toBeInTheDocument();
        expect(screen.queryByText('Medium urgent task')).not.toBeInTheDocument();
      });

      // Complete the high priority task
      const completeButton = screen.getByRole('button', { name: /mark as complete/i });
      await user.click(completeButton);

      // Clear search to see all
      const clearSearchButton = screen.getByRole('button', { name: /clear search/i });
      await user.click(clearSearchButton);

      // Switch to archive
      const archiveButton = screen.getByRole('button', { name: /archive/i });
      await user.click(archiveButton);

      await waitFor(() => {
        expect(screen.getByText('High priority task')).toBeInTheDocument();
        expect(screen.getByText('1 completed todo tasks')).toBeInTheDocument();
      });

      // Search in archive
      const archiveSearchInput = screen.getByPlaceholderText('Search by text...');
      await user.type(archiveSearchInput, 'High');

      await waitFor(() => {
        expect(screen.getByText('High priority task')).toBeInTheDocument();
        expect(screen.getByText('1 of 1 completed todo tasks')).toBeInTheDocument();
      });
    });
  });

  describe('E2E Scenario: Category Management Workflow', () => {
    test('should handle category changes during edit and maintain category constraints', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText('Add a new todo...');
      const submitButton = screen.getByText('Add Todo');

      // Create todo with medium priority
      await user.type(input, 'Category test task');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Category test task')).toBeInTheDocument();
        expect(screen.getByText('medium')).toBeInTheDocument();
      });

      // Edit and change priority
      const editButton = screen.getByRole('button', { name: /edit todo/i });
      await user.click(editButton);

      const editInput = screen.getByPlaceholderText('Edit todo...');
      const editForm = editInput.closest('.todo-edit-form');

      // Change to critical priority
      const criticalCheckboxes = screen.getAllByLabelText('Critical');
      const criticalInEdit = Array.from(criticalCheckboxes).find(
        checkbox => editForm?.contains(checkbox)
      );
      if (criticalInEdit) {
        await user.click(criticalInEdit);
      }

      // Add progress category
      const inProgressCheckboxes = screen.getAllByLabelText('In Progress');
      const inProgressInEdit = Array.from(inProgressCheckboxes).find(
        checkbox => editForm?.contains(checkbox)
      );
      if (inProgressInEdit) {
        await user.click(inProgressInEdit);
      }

      // Save
      const saveButton = screen.getByRole('button', { name: /^save$/i });
      await user.click(saveButton);

      // Verify categories changed
      await waitFor(() => {
        expect(screen.getByText('Category test task')).toBeInTheDocument();
        expect(screen.getByText('critical')).toBeInTheDocument();
        expect(screen.getByText('in progress')).toBeInTheDocument();
        expect(screen.queryByText('medium')).not.toBeInTheDocument();
      });

      // Edit again and change time category
      const editButton2 = screen.getByRole('button', { name: /edit todo/i });
      await user.click(editButton2);

      const editInput2 = screen.getByPlaceholderText('Edit todo...');
      const editForm2 = editInput2.closest('.todo-edit-form');

      // Change to this-week
      const thisWeekCheckboxes = screen.getAllByLabelText('This Week');
      const thisWeekInEdit = Array.from(thisWeekCheckboxes).find(
        checkbox => editForm2?.contains(checkbox)
      );
      if (thisWeekInEdit) {
        await user.click(thisWeekInEdit);
      }

      // Save
      const saveButton2 = screen.getByRole('button', { name: /^save$/i });
      await user.click(saveButton2);

      // Verify time category added
      await waitFor(() => {
        expect(screen.getByText('this week')).toBeInTheDocument();
      });
    });
  });

  describe('E2E Scenario: Edit Cancellation Workflow', () => {
    test('should cancel edit without saving changes', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText('Add a new todo...');
      const submitButton = screen.getByText('Add Todo');

      await user.type(input, 'Original task');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Original task')).toBeInTheDocument();
      });

      // Start editing
      const editButton = screen.getByRole('button', { name: /edit todo/i });
      await user.click(editButton);

      const editInput = screen.getByPlaceholderText('Edit todo...');
      await user.clear(editInput);
      await user.type(editInput, 'Modified task');

      // Cancel edit
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      // Verify original task is still there
      await waitFor(() => {
        expect(screen.getByText('Original task')).toBeInTheDocument();
        expect(screen.queryByText('Modified task')).not.toBeInTheDocument();
      });
    });
  });

  describe('E2E Scenario: Archive to Active and Back', () => {
    test('should move todo between active and archive multiple times', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText('Add a new todo...');
      const submitButton = screen.getByText('Add Todo');

      await user.type(input, 'Back and forth task');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Back and forth task')).toBeInTheDocument();
      });

      // Complete
      const completeButton = screen.getByRole('button', { name: /mark as complete/i });
      await user.click(completeButton);

      await waitFor(() => {
        expect(screen.queryByText('Back and forth task')).not.toBeInTheDocument();
      });

      // Go to archive
      const archiveButton = screen.getByRole('button', { name: /archive/i });
      await user.click(archiveButton);

      await waitFor(() => {
        expect(screen.getByText('Back and forth task')).toBeInTheDocument();
      });

      // Uncomplete
      const incompleteButton = screen.getByRole('button', { name: /mark as incomplete/i });
      await user.click(incompleteButton);

      // Back to active
      const activeButton = screen.getByRole('button', { name: /active todos/i });
      await user.click(activeButton);

      await waitFor(() => {
        expect(screen.getByText('Back and forth task')).toBeInTheDocument();
      });

      // Complete again
      const completeButton2 = screen.getByRole('button', { name: /mark as complete/i });
      await user.click(completeButton2);

      // Back to archive
      await user.click(archiveButton);

      await waitFor(() => {
        expect(screen.getByText('Back and forth task')).toBeInTheDocument();
        expect(screen.getByText('1 completed todo tasks')).toBeInTheDocument();
      });
    });
  });

  describe('E2E Scenario: Empty States and Edge Cases', () => {
    test('should handle empty states correctly when todos are deleted', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Verify empty state
      expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument();

      // Create and delete a todo
      const input = screen.getByPlaceholderText('Add a new todo...');
      const submitButton = screen.getByText('Add Todo');

      await user.type(input, 'Temporary task');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Temporary task')).toBeInTheDocument();
      });

      // Delete it
      const deleteButton = screen.getByRole('button', { name: /delete todo/i });
      await user.click(deleteButton);

      // Verify empty state again
      await waitFor(() => {
        expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument();
        expect(screen.getByText('0 uncompleted todo tasks')).toBeInTheDocument();
      });

      // Create, complete, then delete from archive
      await user.type(input, 'Archive task');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Archive task')).toBeInTheDocument();
      });

      const completeButton = screen.getByRole('button', { name: /mark as complete/i });
      await user.click(completeButton);

      const archiveButton = screen.getByRole('button', { name: /archive/i });
      await user.click(archiveButton);

      await waitFor(() => {
        expect(screen.getByText('Archive task')).toBeInTheDocument();
      });

      const archiveDeleteButton = screen.getByRole('button', { name: /delete todo/i });
      await user.click(archiveDeleteButton);

      // Verify archive empty state
      await waitFor(() => {
        expect(screen.getByText('No archived todos yet.')).toBeInTheDocument();
        expect(screen.getByText('0 completed todo tasks')).toBeInTheDocument();
      });
    });

    test('should handle search with no results', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText('Add a new todo...');
      const submitButton = screen.getByText('Add Todo');

      await user.type(input, 'Test task');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Test task')).toBeInTheDocument();
      });

      // Search for something that doesn't exist
      const searchInput = screen.getByPlaceholderText('Search by text...');
      await user.type(searchInput, 'NonExistentTask');

      await waitFor(() => {
        expect(screen.getByText('No todos match your search criteria.')).toBeInTheDocument();
        expect(screen.getByText('0 of 1 uncompleted todo tasks')).toBeInTheDocument();
      });

      // Clear search
      const clearSearchButton = screen.getByRole('button', { name: /clear search/i });
      await user.click(clearSearchButton);

      await waitFor(() => {
        expect(screen.getByText('Test task')).toBeInTheDocument();
        expect(screen.getByText('1 uncompleted todo tasks')).toBeInTheDocument();
      });
    });
  });

  describe('E2E Scenario: Theme Toggle Functionality', () => {
    test('should toggle theme from light to dark and persist in localStorage', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Verify initial theme is light (default)
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      
      // Find theme toggle button
      const themeToggle = screen.getByRole('button', { 
        name: /switch to dark theme/i 
      });
      
      // Verify button shows moon icon (indicating light mode)
      expect(themeToggle).toHaveTextContent('🌙');

      // Toggle to dark theme
      await user.click(themeToggle);

      // Verify theme changed to dark
      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      });

      // Verify button now shows sun icon (indicating dark mode)
      const darkThemeToggle = screen.getByRole('button', { 
        name: /switch to light theme/i 
      });
      expect(darkThemeToggle).toHaveTextContent('☀️');

      // Verify theme is saved to localStorage
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', '"dark"');
    });

    test('should toggle theme from dark to light', async () => {
      const user = userEvent.setup();
      
      // Set initial theme to dark in localStorage
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'theme') return 'dark';
        return null;
      });

      render(<App />);

      // Verify initial theme is dark
      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      });

      // Find theme toggle button (should show sun icon)
      const themeToggle = screen.getByRole('button', { 
        name: /switch to light theme/i 
      });
      expect(themeToggle).toHaveTextContent('☀️');

      // Toggle to light theme
      await user.click(themeToggle);

      // Verify theme changed to light
      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      });

      // Verify button now shows moon icon
      const lightThemeToggle = screen.getByRole('button', { 
        name: /switch to dark theme/i 
      });
      expect(lightThemeToggle).toHaveTextContent('🌙');

      // Verify theme is saved to localStorage
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', '"light"');
    });

    test('should persist theme preference across app re-renders', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<App />);

      // Toggle to dark theme
      const themeToggle = screen.getByRole('button', { 
        name: /switch to dark theme/i 
      });
      await user.click(themeToggle);

      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      });

      // Simulate app re-render by unmounting and remounting
      rerender(<App />);

      // Verify theme persists
      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        expect(screen.getByRole('button', { 
          name: /switch to light theme/i 
        })).toBeInTheDocument();
      });
    });

    test('should maintain theme while performing todo operations', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Switch to dark theme
      const themeToggle = screen.getByRole('button', { 
        name: /switch to dark theme/i 
      });
      await user.click(themeToggle);

      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      });

      // Perform todo operations while in dark theme
      const input = screen.getByPlaceholderText('Add a new todo...');
      const submitButton = screen.getByText('Add Todo');

      await user.type(input, 'Dark theme todo');
      await user.click(submitButton);

      // Verify todo was created and theme is still dark
      await waitFor(() => {
        expect(screen.getByText('Dark theme todo')).toBeInTheDocument();
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      });

      // Complete the todo
      const completeButton = screen.getByRole('button', { name: /mark as complete/i });
      await user.click(completeButton);

      // Verify theme persists after completing todo
      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      });

      // Switch to archive view
      const archiveButton = screen.getByRole('button', { name: /archive/i });
      await user.click(archiveButton);

      // Verify theme persists in archive view
      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        expect(screen.getByText('Dark theme todo')).toBeInTheDocument();
      });

      // Toggle back to light theme while in archive
      const lightThemeToggle = screen.getByRole('button', { 
        name: /switch to light theme/i 
      });
      await user.click(lightThemeToggle);

      // Verify theme changed and archive still works
      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
        expect(screen.getByText('Dark theme todo')).toBeInTheDocument();
      });
    });

    test('should toggle theme multiple times and maintain state', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Verify initial light theme
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');

      // Toggle to dark
      let themeToggle = screen.getByRole('button', { 
        name: /switch to dark theme/i 
      });
      await user.click(themeToggle);

      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      });

      // Toggle back to light
      themeToggle = screen.getByRole('button', { 
        name: /switch to light theme/i 
      });
      await user.click(themeToggle);

      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      });

      // Toggle to dark again
      themeToggle = screen.getByRole('button', { 
        name: /switch to dark theme/i 
      });
      await user.click(themeToggle);

      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      });

      // Verify final state
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(screen.getByRole('button', { 
        name: /switch to light theme/i 
      })).toBeInTheDocument();
    });

    test('should load saved theme preference on initial render', async () => {
      // Set dark theme in localStorage before rendering
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'theme') return 'dark';
        return null;
      });

      render(<App />);

      // Verify dark theme is loaded
      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        expect(screen.getByRole('button', { 
          name: /switch to light theme/i 
        })).toBeInTheDocument();
      });
    });
  });
});

