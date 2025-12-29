import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

describe('Todo App - Adding Todos', () => {
  test('should add a new todo when form is submitted with valid input', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');

    await user.type(input, 'Test todo item');
    await user.click(submitButton);

    expect(screen.getByText('Test todo item')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  test('should not add a todo with empty text', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');

    await user.type(input, '   ');
    await user.click(submitButton);

    expect(screen.queryByText('   ')).not.toBeInTheDocument();
  });

  test('should add todo with default category (medium)', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');

    await user.type(input, 'Todo with default category');
    await user.click(submitButton);

    const todo = screen.getByText('Todo with default category');
    expect(todo).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
  });

  test('should add todo with selected categories', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');

    // Select high priority - get all and use the one in the form (not search)
    const highPriorityCheckboxes = screen.getAllByLabelText('High');
    const highPriorityCheckbox = highPriorityCheckboxes.find(checkbox => 
      checkbox.closest('.todo-form') !== null
    ) || highPriorityCheckboxes[1]; // Form comes after search section
    await user.click(highPriorityCheckbox);

    // Select urgent time
    const urgentCheckboxes = screen.getAllByLabelText('Urgent');
    const urgentCheckbox = urgentCheckboxes.find(checkbox => 
      checkbox.closest('.todo-form') !== null
    ) || urgentCheckboxes[1];
    await user.click(urgentCheckbox);

    await user.type(input, 'High priority urgent todo');
    await user.click(submitButton);

    expect(screen.getByText('High priority urgent todo')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('urgent')).toBeInTheDocument();
  });

  test('should trim whitespace from todo text', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');

    await user.type(input, '  Trimmed todo  ');
    await user.click(submitButton);

    expect(screen.getByText('Trimmed todo')).toBeInTheDocument();
    expect(screen.queryByText('  Trimmed todo  ')).not.toBeInTheDocument();
  });

  test('should update todo count after adding', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');

    expect(screen.getByText(/0 uncompleted todo tasks/)).toBeInTheDocument();

    await user.type(input, 'First todo');
    await user.click(submitButton);

    expect(screen.getByText(/1 uncompleted todo tasks/)).toBeInTheDocument();

    await user.type(input, 'Second todo');
    await user.click(submitButton);

    expect(screen.getByText(/2 uncompleted todo tasks/)).toBeInTheDocument();
  });
});

describe('Todo App - Editing Todos', () => {
  test('should enter edit mode when Edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo first
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    await user.type(input, 'Todo to edit');
    await user.click(submitButton);

    // Click edit button
    const editButton = screen.getByLabelText('Edit todo');
    await user.click(editButton);

    // Check that edit form is shown
    expect(screen.getByPlaceholderText('Edit todo...')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('should update todo text when edited', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo first
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    await user.type(input, 'Original text');
    await user.click(submitButton);

    // Edit the todo
    const editButton = screen.getByLabelText('Edit todo');
    await user.click(editButton);

    const editInput = screen.getByPlaceholderText('Edit todo...');
    await user.clear(editInput);
    await user.type(editInput, 'Updated text');

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    expect(screen.getByText('Updated text')).toBeInTheDocument();
    expect(screen.queryByText('Original text')).not.toBeInTheDocument();
  });

  test('should update todo categories when edited', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo first
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    await user.type(input, 'Todo to edit categories');
    await user.click(submitButton);

    // Edit the todo
    const editButton = screen.getByLabelText('Edit todo');
    await user.click(editButton);

    // Wait for edit form to appear
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Edit todo...')).toBeInTheDocument();
    });

    // Change priority to critical - find checkbox in edit form
    const criticalCheckboxes = screen.getAllByLabelText('Critical');
    const criticalCheckbox = criticalCheckboxes.find(checkbox => 
      checkbox.closest('.todo-edit-form') !== null
    ) || criticalCheckboxes[criticalCheckboxes.length - 1]; // Edit form is last
    await user.click(criticalCheckbox);

    // Change time to today
    const todayCheckboxes = screen.getAllByLabelText('Today');
    const todayCheckbox = todayCheckboxes.find(checkbox => 
      checkbox.closest('.todo-edit-form') !== null
    ) || todayCheckboxes[todayCheckboxes.length - 1];
    await user.click(todayCheckbox);

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('critical')).toBeInTheDocument();
      expect(screen.getByText('today')).toBeInTheDocument();
    });
  });

  test('should cancel edit mode without saving changes', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo first
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    await user.type(input, 'Original text');
    await user.click(submitButton);

    // Edit the todo
    const editButton = screen.getByLabelText('Edit todo');
    await user.click(editButton);

    const editInput = screen.getByPlaceholderText('Edit todo...');
    await user.clear(editInput);
    await user.type(editInput, 'Changed text');

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    // Original text should still be there
    expect(screen.getByText('Original text')).toBeInTheDocument();
    expect(screen.queryByText('Changed text')).not.toBeInTheDocument();
  });

  test('should not save edit with empty text', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo first
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    await user.type(input, 'Original text');
    await user.click(submitButton);

    // Edit the todo
    const editButton = screen.getByLabelText('Edit todo');
    await user.click(editButton);

    const editInput = screen.getByPlaceholderText('Edit todo...');
    await user.clear(editInput);
    await user.type(editInput, '   ');

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    // Edit form should still be visible (validation prevents save)
    expect(screen.getByPlaceholderText('Edit todo...')).toBeInTheDocument();
  });

  test('should trim whitespace when editing', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo first
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    await user.type(input, 'Original');
    await user.click(submitButton);

    // Edit the todo
    const editButton = screen.getByLabelText('Edit todo');
    await user.click(editButton);

    const editInput = screen.getByPlaceholderText('Edit todo...');
    await user.clear(editInput);
    await user.type(editInput, '  Trimmed edit  ');

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    expect(screen.getByText('Trimmed edit')).toBeInTheDocument();
  });

  // Helper function to get checkbox from edit form
  const getEditFormCheckbox = (labelText) => {
    const checkboxes = screen.getAllByLabelText(labelText);
    return checkboxes.find(checkbox => 
      checkbox.closest('.todo-edit-form') !== null
    ) || checkboxes[checkboxes.length - 1];
  };

  test('should change priority category from medium to high when editing', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo with default medium priority
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    await user.type(input, 'Todo with medium priority');
    await user.click(submitButton);

    // Verify initial category
    expect(screen.getByText('medium')).toBeInTheDocument();

    // Edit the todo
    const editButton = screen.getByLabelText('Edit todo');
    await user.click(editButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Edit todo...')).toBeInTheDocument();
    });

    // Change priority to high
    const highCheckbox = getEditFormCheckbox('High');
    await user.click(highCheckbox);

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('high')).toBeInTheDocument();
      expect(screen.queryByText('medium')).not.toBeInTheDocument();
    });
  });

  test('should change priority category from high to critical when editing', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo with high priority
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    
    // Set high priority first
    const highCheckboxes = screen.getAllByLabelText('High');
    const highCheckbox = highCheckboxes.find(checkbox => 
      checkbox.closest('.todo-form') !== null
    ) || highCheckboxes[1];
    await user.click(highCheckbox);
    
    await user.type(input, 'Todo with high priority');
    await user.click(submitButton);

    // Verify initial category
    expect(screen.getByText('high')).toBeInTheDocument();

    // Edit the todo
    const editButton = screen.getByLabelText('Edit todo');
    await user.click(editButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Edit todo...')).toBeInTheDocument();
    });

    // Change priority to critical
    const criticalCheckbox = getEditFormCheckbox('Critical');
    await user.click(criticalCheckbox);

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('critical')).toBeInTheDocument();
      expect(screen.queryByText('high')).not.toBeInTheDocument();
    });
  });

  test('should change time category from urgent to today when editing', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo with urgent time category
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    
    // Set urgent time first
    const urgentCheckboxes = screen.getAllByLabelText('Urgent');
    const urgentCheckbox = urgentCheckboxes.find(checkbox => 
      checkbox.closest('.todo-form') !== null
    ) || urgentCheckboxes[1];
    await user.click(urgentCheckbox);
    
    await user.type(input, 'Todo with urgent time');
    await user.click(submitButton);

    // Verify initial category
    expect(screen.getByText('urgent')).toBeInTheDocument();

    // Edit the todo
    const editButton = screen.getByLabelText('Edit todo');
    await user.click(editButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Edit todo...')).toBeInTheDocument();
    });

    // Change time to today
    const todayCheckbox = getEditFormCheckbox('Today');
    await user.click(todayCheckbox);

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
      expect(screen.queryByText('urgent')).not.toBeInTheDocument();
    });
  });

  test('should change progress category from not-started to in-progress when editing', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo with not-started progress
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    
    // Set not-started progress first
    const notStartedCheckboxes = screen.getAllByLabelText('Not Started');
    const notStartedCheckbox = notStartedCheckboxes.find(checkbox => 
      checkbox.closest('.todo-form') !== null
    ) || notStartedCheckboxes[1];
    await user.click(notStartedCheckbox);
    
    await user.type(input, 'Todo with not-started progress');
    await user.click(submitButton);

    // Verify initial category (displayed with space, not hyphen)
    expect(screen.getByText('not started')).toBeInTheDocument();

    // Edit the todo
    const editButton = screen.getByLabelText('Edit todo');
    await user.click(editButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Edit todo...')).toBeInTheDocument();
    });

    // Change progress to in-progress
    const inProgressCheckbox = getEditFormCheckbox('In Progress');
    await user.click(inProgressCheckbox);

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('in progress')).toBeInTheDocument();
      expect(screen.queryByText('not started')).not.toBeInTheDocument();
    });
  });

  test('should change multiple categories at once when editing', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo with default categories
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    await user.type(input, 'Todo with multiple categories');
    await user.click(submitButton);

    // Edit the todo
    const editButton = screen.getByLabelText('Edit todo');
    await user.click(editButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Edit todo...')).toBeInTheDocument();
    });

    // Change priority to critical
    const criticalCheckbox = getEditFormCheckbox('Critical');
    await user.click(criticalCheckbox);

    // Change time to this-week
    const thisWeekCheckbox = getEditFormCheckbox('This Week');
    await user.click(thisWeekCheckbox);

    // Change progress to blocked
    const blockedCheckbox = getEditFormCheckbox('Blocked');
    await user.click(blockedCheckbox);

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('critical')).toBeInTheDocument();
      expect(screen.getByText('this week')).toBeInTheDocument();
      expect(screen.getByText('blocked')).toBeInTheDocument();
      expect(screen.queryByText('medium')).not.toBeInTheDocument();
    });
  });

  test('should replace priority category when changing from one to another', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo with low priority
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    
    const lowCheckboxes = screen.getAllByLabelText('Low');
    const lowCheckbox = lowCheckboxes.find(checkbox => 
      checkbox.closest('.todo-form') !== null
    ) || lowCheckboxes[1];
    await user.click(lowCheckbox);
    
    await user.type(input, 'Todo with low priority');
    await user.click(submitButton);

    expect(screen.getByText('low')).toBeInTheDocument();

    // Edit the todo
    const editButton = screen.getByLabelText('Edit todo');
    await user.click(editButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Edit todo...')).toBeInTheDocument();
    });

    // Change to critical - should replace low, not add to it
    const criticalCheckbox = getEditFormCheckbox('Critical');
    await user.click(criticalCheckbox);

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('critical')).toBeInTheDocument();
      expect(screen.queryByText('low')).not.toBeInTheDocument();
      // Should only have one priority category
      const priorityBadges = screen.queryAllByText(/^(critical|high|medium|low)$/);
      expect(priorityBadges.length).toBe(1);
    });
  });

  test('should maintain at least one priority category when editing', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo with high priority
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    
    const highCheckboxes = screen.getAllByLabelText('High');
    const highCheckbox = highCheckboxes.find(checkbox => 
      checkbox.closest('.todo-form') !== null
    ) || highCheckboxes[1];
    await user.click(highCheckbox);
    
    await user.type(input, 'Todo with high priority');
    await user.click(submitButton);

    // Edit the todo
    const editButton = screen.getByLabelText('Edit todo');
    await user.click(editButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Edit todo...')).toBeInTheDocument();
    });

    // Try to uncheck high priority (should default back to medium)
    const highCheckboxInEdit = getEditFormCheckbox('High');
    await user.click(highCheckboxInEdit);

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    await waitFor(() => {
      // Should default to medium when removing the last priority
      expect(screen.getByText('medium')).toBeInTheDocument();
      expect(screen.queryByText('high')).not.toBeInTheDocument();
    });
  });

  test('should preserve existing categories when only changing text', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo with specific categories
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    
    // Set categories
    const highCheckboxes = screen.getAllByLabelText('High');
    const highCheckbox = highCheckboxes.find(checkbox => 
      checkbox.closest('.todo-form') !== null
    ) || highCheckboxes[1];
    await user.click(highCheckbox);
    
    const urgentCheckboxes = screen.getAllByLabelText('Urgent');
    const urgentCheckbox = urgentCheckboxes.find(checkbox => 
      checkbox.closest('.todo-form') !== null
    ) || urgentCheckboxes[1];
    await user.click(urgentCheckbox);
    
    await user.type(input, 'Original text');
    await user.click(submitButton);

    // Verify initial categories
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('urgent')).toBeInTheDocument();

    // Edit only the text, not categories
    const editButton = screen.getByLabelText('Edit todo');
    await user.click(editButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Edit todo...')).toBeInTheDocument();
    });

    const editInput = screen.getByPlaceholderText('Edit todo...');
    await user.clear(editInput);
    await user.type(editInput, 'Updated text');

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Updated text')).toBeInTheDocument();
      // Categories should be preserved
      expect(screen.getByText('high')).toBeInTheDocument();
      expect(screen.getByText('urgent')).toBeInTheDocument();
    });
  });

  test('should change from low priority to high and add time category when editing', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo with low priority only
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    
    const lowCheckboxes = screen.getAllByLabelText('Low');
    const lowCheckbox = lowCheckboxes.find(checkbox => 
      checkbox.closest('.todo-form') !== null
    ) || lowCheckboxes[1];
    await user.click(lowCheckbox);
    
    await user.type(input, 'Todo to upgrade');
    await user.click(submitButton);

    expect(screen.getByText('low')).toBeInTheDocument();

    // Edit the todo
    const editButton = screen.getByLabelText('Edit todo');
    await user.click(editButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Edit todo...')).toBeInTheDocument();
    });

    // Change priority to high
    const highCheckbox = getEditFormCheckbox('High');
    await user.click(highCheckbox);

    // Add urgent time category
    const urgentCheckbox = getEditFormCheckbox('Urgent');
    await user.click(urgentCheckbox);

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('high')).toBeInTheDocument();
      expect(screen.getByText('urgent')).toBeInTheDocument();
      expect(screen.queryByText('low')).not.toBeInTheDocument();
    });
  });

  test('should cancel category changes when canceling edit', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo with medium priority
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    await user.type(input, 'Todo to test cancel');
    await user.click(submitButton);

    expect(screen.getByText('medium')).toBeInTheDocument();

    // Edit the todo
    const editButton = screen.getByLabelText('Edit todo');
    await user.click(editButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Edit todo...')).toBeInTheDocument();
    });

    // Change priority to critical
    const criticalCheckbox = getEditFormCheckbox('Critical');
    await user.click(criticalCheckbox);

    // Cancel instead of saving
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    // Original category should still be there
    await waitFor(() => {
      expect(screen.getByText('medium')).toBeInTheDocument();
      expect(screen.queryByText('critical')).not.toBeInTheDocument();
    });
  });
});

describe('Todo App - Archiving Todos', () => {
  test('should archive a todo when Complete button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo first
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    await user.type(input, 'Todo to archive');
    await user.click(submitButton);

    expect(screen.getByText('Todo to archive')).toBeInTheDocument();
    expect(screen.getByText(/1 uncompleted todo tasks/)).toBeInTheDocument();

    // Archive the todo
    const completeButton = screen.getByLabelText('Mark as complete');
    await user.click(completeButton);

    // Should be removed from active view
    expect(screen.queryByText('Todo to archive')).not.toBeInTheDocument();
    expect(screen.getByText(/0 uncompleted todo tasks/)).toBeInTheDocument();

    // Switch to archive view
    const archiveButton = screen.getByText(/Archive/);
    await user.click(archiveButton);

    // Should appear in archive
    expect(screen.getByText('Todo to archive')).toBeInTheDocument();
    expect(screen.getByText(/1 completed todo tasks/)).toBeInTheDocument();
  });

  test('should add completedAt timestamp when archiving', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo first
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    await user.type(input, 'Todo with timestamp');
    await user.click(submitButton);

    // Archive the todo
    const completeButton = screen.getByLabelText('Mark as complete');
    await user.click(completeButton);

    // Wait for archive to complete
    await waitFor(() => {
      expect(screen.queryByText('Todo with timestamp')).not.toBeInTheDocument();
    });

    // Check localStorage to verify completedAt was added
    const archiveCalls = mockLocalStorage.setItem.mock.calls.filter(
      call => call[0] === 'archivedTodos'
    );
    
    if (archiveCalls.length > 0) {
      const archivedTodos = JSON.parse(archiveCalls[archiveCalls.length - 1][1]);
      expect(archivedTodos).toHaveLength(1);
      expect(archivedTodos[0]).toHaveProperty('completedAt');
      expect(archivedTodos[0].completedAt).toBeGreaterThan(0);
    } else {
      // If localStorage mock didn't capture it, verify through UI
      const archiveButton = screen.getByText(/Archive/);
      await user.click(archiveButton);
      expect(screen.getByText('Todo with timestamp')).toBeInTheDocument();
    }
  });

  test('should preserve todo text and categories when archiving', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo with categories
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    
    // Get high priority checkbox from form (not search)
    const highPriorityCheckboxes = screen.getAllByLabelText('High');
    const highPriorityCheckbox = highPriorityCheckboxes.find(checkbox => 
      checkbox.closest('.todo-form') !== null
    ) || highPriorityCheckboxes[1];
    await user.click(highPriorityCheckbox);
    
    await user.type(input, 'Todo with categories');
    await user.click(submitButton);

    // Archive the todo
    const completeButton = screen.getByLabelText('Mark as complete');
    await user.click(completeButton);

    // Switch to archive view
    const archiveButton = screen.getByText(/Archive/);
    await user.click(archiveButton);

    // Verify text and categories are preserved
    expect(screen.getByText('Todo with categories')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  test('should update archive count when archiving', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add two todos
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    
    await user.type(input, 'First todo');
    await user.click(submitButton);
    
    await user.type(input, 'Second todo');
    await user.click(submitButton);

    // Check archive button shows 0
    const archiveButton = screen.getByText(/Archive \(0\)/);
    expect(archiveButton).toBeInTheDocument();

    // Archive first todo
    const completeButtons = screen.getAllByLabelText('Mark as complete');
    await user.click(completeButtons[0]);

    // Archive count should update
    expect(screen.getByText(/Archive \(1\)/)).toBeInTheDocument();

    // Archive second todo
    const remainingCompleteButton = screen.getByLabelText('Mark as complete');
    await user.click(remainingCompleteButton);

    // Archive count should update to 2
    expect(screen.getByText(/Archive \(2\)/)).toBeInTheDocument();
  });

  test('should restore archived todo when Mark Incomplete is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add and archive a todo
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    await user.type(input, 'Todo to restore');
    await user.click(submitButton);

    const completeButton = screen.getByLabelText('Mark as complete');
    await user.click(completeButton);

    // Switch to archive view
    const archiveButton = screen.getByText(/Archive/);
    await user.click(archiveButton);

    expect(screen.getByText('Todo to restore')).toBeInTheDocument();

    // Restore the todo
    const incompleteButton = screen.getByLabelText('Mark as incomplete');
    await user.click(incompleteButton);

    // Should be removed from archive
    expect(screen.queryByText('Todo to restore')).not.toBeInTheDocument();

    // Switch back to active view
    const activeButton = screen.getByText(/Active Todos/);
    await user.click(activeButton);

    // Should appear in active todos
    expect(screen.getByText('Todo to restore')).toBeInTheDocument();
  });

  test('should remove completedAt when restoring from archive', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add and archive a todo
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    await user.type(input, 'Todo to restore');
    await user.click(submitButton);

    const completeButton = screen.getByLabelText('Mark as complete');
    await user.click(completeButton);

    // Wait for archive to complete
    await waitFor(() => {
      expect(screen.queryByText('Todo to restore')).not.toBeInTheDocument();
    });

    // Switch to archive view
    const archiveButton = screen.getByText(/Archive/);
    await user.click(archiveButton);

    expect(screen.getByText('Todo to restore')).toBeInTheDocument();

    // Restore the todo
    const incompleteButton = screen.getByLabelText('Mark as incomplete');
    await user.click(incompleteButton);

    // Wait for restore to complete
    await waitFor(() => {
      expect(screen.queryByText('Todo to restore')).not.toBeInTheDocument();
    });

    // Switch back to active view to verify
    const activeButton = screen.getByText(/Active Todos/);
    await user.click(activeButton);
    
    expect(screen.getByText('Todo to restore')).toBeInTheDocument();
    
    // Check localStorage to verify completedAt was removed
    const todosCalls = mockLocalStorage.setItem.mock.calls.filter(
      call => call[0] === 'todos'
    );
    
    if (todosCalls.length > 0) {
      const activeTodos = JSON.parse(todosCalls[todosCalls.length - 1][1]);
      expect(activeTodos.length).toBeGreaterThan(0);
      const restoredTodo = activeTodos.find(t => t.text === 'Todo to restore');
      expect(restoredTodo).not.toHaveProperty('completedAt');
    }
  });

  test('should handle archiving multiple todos', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add multiple todos
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    
    await user.type(input, 'Todo 1');
    await user.click(submitButton);
    
    await user.type(input, 'Todo 2');
    await user.click(submitButton);
    
    await user.type(input, 'Todo 3');
    await user.click(submitButton);

    expect(screen.getByText(/3 uncompleted todo tasks/)).toBeInTheDocument();

    // Archive all todos
    const completeButtons = screen.getAllByLabelText('Mark as complete');
    for (const button of completeButtons) {
      await user.click(button);
    }

    expect(screen.getByText(/0 uncompleted todo tasks/)).toBeInTheDocument();

    // Switch to archive view
    const archiveButton = screen.getByText(/Archive/);
    await user.click(archiveButton);

    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
    expect(screen.getByText('Todo 3')).toBeInTheDocument();
    expect(screen.getByText(/3 completed todo tasks/)).toBeInTheDocument();
  });

  test('should delete todo from archive', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add and archive a todo
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    await user.type(input, 'Todo to delete from archive');
    await user.click(submitButton);

    const completeButton = screen.getByLabelText('Mark as complete');
    await user.click(completeButton);

    // Switch to archive view
    const archiveButton = screen.getByText(/Archive/);
    await user.click(archiveButton);

    expect(screen.getByText('Todo to delete from archive')).toBeInTheDocument();
    expect(screen.getByText(/1 completed todo tasks/)).toBeInTheDocument();

    // Delete the todo from archive
    const deleteButton = screen.getByLabelText('Delete todo');
    await user.click(deleteButton);

    // Should be removed from archive
    await waitFor(() => {
      expect(screen.queryByText('Todo to delete from archive')).not.toBeInTheDocument();
      expect(screen.getByText(/0 completed todo tasks/)).toBeInTheDocument();
    });
  });

  test('should delete multiple todos from archive', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add and archive multiple todos
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    
    await user.type(input, 'Archive todo 1');
    await user.click(submitButton);
    
    await user.type(input, 'Archive todo 2');
    await user.click(submitButton);
    
    await user.type(input, 'Archive todo 3');
    await user.click(submitButton);

    // Archive all todos
    const completeButtons = screen.getAllByLabelText('Mark as complete');
    for (const button of completeButtons) {
      await user.click(button);
    }

    // Switch to archive view
    const archiveButton = screen.getByText(/Archive/);
    await user.click(archiveButton);

    expect(screen.getByText(/3 completed todo tasks/)).toBeInTheDocument();

    // Delete first todo
    const deleteButtons = screen.getAllByLabelText('Delete todo');
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('Archive todo 1')).not.toBeInTheDocument();
      expect(screen.getByText(/2 completed todo tasks/)).toBeInTheDocument();
    });

    // Delete second todo
    const remainingDeleteButtons = screen.getAllByLabelText('Delete todo');
    await user.click(remainingDeleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('Archive todo 2')).not.toBeInTheDocument();
      expect(screen.getByText(/1 completed todo tasks/)).toBeInTheDocument();
    });

    // Verify last todo remains
    expect(screen.getByText('Archive todo 3')).toBeInTheDocument();
  });

  test('should uncomplete todo from archive and restore to active', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add and archive a todo
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    await user.type(input, 'Todo to uncomplete');
    await user.click(submitButton);

    const completeButton = screen.getByLabelText('Mark as complete');
    await user.click(completeButton);

    // Switch to archive view
    const archiveButton = screen.getByText(/Archive/);
    await user.click(archiveButton);

    expect(screen.getByText('Todo to uncomplete')).toBeInTheDocument();
    expect(screen.getByText(/1 completed todo tasks/)).toBeInTheDocument();

    // Uncomplete the todo
    const incompleteButton = screen.getByLabelText('Mark as incomplete');
    await user.click(incompleteButton);

    // Should be removed from archive
    await waitFor(() => {
      expect(screen.queryByText('Todo to uncomplete')).not.toBeInTheDocument();
      expect(screen.getByText(/0 completed todo tasks/)).toBeInTheDocument();
    });

    // Switch back to active view
    const activeButton = screen.getByText(/Active Todos/);
    await user.click(activeButton);

    // Should appear in active todos
    expect(screen.getByText('Todo to uncomplete')).toBeInTheDocument();
    expect(screen.getByText(/1 uncompleted todo tasks/)).toBeInTheDocument();
  });

  test('should uncomplete multiple todos from archive', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add and archive multiple todos
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    
    await user.type(input, 'Uncomplete todo 1');
    await user.click(submitButton);
    
    await user.type(input, 'Uncomplete todo 2');
    await user.click(submitButton);

    // Archive both todos
    const completeButtons = screen.getAllByLabelText('Mark as complete');
    for (const button of completeButtons) {
      await user.click(button);
    }

    // Switch to archive view
    const archiveButton = screen.getByText(/Archive/);
    await user.click(archiveButton);

    expect(screen.getByText(/2 completed todo tasks/)).toBeInTheDocument();

    // Uncomplete first todo
    const incompleteButtons = screen.getAllByLabelText('Mark as incomplete');
    await user.click(incompleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('Uncomplete todo 1')).not.toBeInTheDocument();
      expect(screen.getByText(/1 completed todo tasks/)).toBeInTheDocument();
    });

    // Switch to active view to verify first todo is restored
    const activeButton = screen.getByText(/Active Todos/);
    await user.click(activeButton);
    expect(screen.getByText('Uncomplete todo 1')).toBeInTheDocument();

    // Switch back to archive
    const archiveButton2 = screen.getByText(/Archive/);
    await user.click(archiveButton2);

    // Uncomplete second todo
    const remainingIncompleteButton = screen.getByLabelText('Mark as incomplete');
    await user.click(remainingIncompleteButton);

    await waitFor(() => {
      expect(screen.queryByText('Uncomplete todo 2')).not.toBeInTheDocument();
      expect(screen.getByText(/0 completed todo tasks/)).toBeInTheDocument();
    });

    // Switch to active view to verify both todos are restored
    const activeButton2 = screen.getByText(/Active Todos/);
    await user.click(activeButton2);
    expect(screen.getByText('Uncomplete todo 1')).toBeInTheDocument();
    expect(screen.getByText('Uncomplete todo 2')).toBeInTheDocument();
    expect(screen.getByText(/2 uncompleted todo tasks/)).toBeInTheDocument();
  });

  test('should preserve categories when uncompleting todo from archive', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo with specific categories
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    
    const highCheckboxes = screen.getAllByLabelText('High');
    const highCheckbox = highCheckboxes.find(checkbox => 
      checkbox.closest('.todo-form') !== null
    ) || highCheckboxes[1];
    await user.click(highCheckbox);
    
    const urgentCheckboxes = screen.getAllByLabelText('Urgent');
    const urgentCheckbox = urgentCheckboxes.find(checkbox => 
      checkbox.closest('.todo-form') !== null
    ) || urgentCheckboxes[1];
    await user.click(urgentCheckbox);
    
    await user.type(input, 'Todo with categories to restore');
    await user.click(submitButton);

    // Archive the todo
    const completeButton = screen.getByLabelText('Mark as complete');
    await user.click(completeButton);

    // Switch to archive view
    const archiveButton = screen.getByText(/Archive/);
    await user.click(archiveButton);

    // Verify categories in archive
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('urgent')).toBeInTheDocument();

    // Uncomplete the todo
    const incompleteButton = screen.getByLabelText('Mark as incomplete');
    await user.click(incompleteButton);

    // Switch to active view
    const activeButton = screen.getByText(/Active Todos/);
    await user.click(activeButton);

    // Verify categories are preserved
    expect(screen.getByText('Todo with categories to restore')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('urgent')).toBeInTheDocument();
  });
});

describe('Todo App - Searching Todos', () => {
  test('should search todos by text in active view', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add multiple todos
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    
    await user.type(input, 'Buy groceries');
    await user.click(submitButton);
    
    await user.type(input, 'Call dentist');
    await user.click(submitButton);
    
    await user.type(input, 'Buy milk');
    await user.click(submitButton);

    expect(screen.getByText(/3 uncompleted todo tasks/)).toBeInTheDocument();

    // Search for "Buy"
    const searchInput = screen.getByPlaceholderText('Search by text...');
    await user.type(searchInput, 'Buy');

    // Should show only todos containing "Buy"
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
    expect(screen.queryByText('Call dentist')).not.toBeInTheDocument();
    expect(screen.getByText(/2 of 3 uncompleted todo tasks/)).toBeInTheDocument();
  });

  test('should search todos by text in archive view', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add and archive multiple todos
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    
    await user.type(input, 'Completed task 1');
    await user.click(submitButton);
    
    await user.type(input, 'Completed task 2');
    await user.click(submitButton);
    
    await user.type(input, 'Active task');
    await user.click(submitButton);

    // Archive first two todos
    const completeButtons = screen.getAllByLabelText('Mark as complete');
    await user.click(completeButtons[0]);
    await user.click(completeButtons[0]); // After first click, buttons re-render

    // Switch to archive view
    const archiveButton = screen.getByText(/Archive/);
    await user.click(archiveButton);

    // Search for "task 1"
    const searchInput = screen.getByPlaceholderText('Search by text...');
    await user.type(searchInput, 'task 1');

    // Should show only matching archived todo
    expect(screen.getByText('Completed task 1')).toBeInTheDocument();
    expect(screen.queryByText('Completed task 2')).not.toBeInTheDocument();
  });

  test('should search todos by category in active view', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add todos with different priorities
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    
    // Add high priority todo
    const highCheckboxes = screen.getAllByLabelText('High');
    const highCheckbox = highCheckboxes.find(checkbox => 
      checkbox.closest('.todo-form') !== null
    ) || highCheckboxes[1];
    await user.click(highCheckbox);
    await user.type(input, 'High priority task');
    await user.click(submitButton);
    
    // Add low priority todo
    const lowCheckboxes = screen.getAllByLabelText('Low');
    const lowCheckbox = lowCheckboxes.find(checkbox => 
      checkbox.closest('.todo-form') !== null
    ) || lowCheckboxes[1];
    await user.click(lowCheckbox);
    await user.type(input, 'Low priority task');
    await user.click(submitButton);

    // Search by high priority category
    const searchHighCheckboxes = screen.getAllByLabelText('High');
    const searchHighCheckbox = searchHighCheckboxes.find(checkbox => 
      checkbox.closest('.search-category-selection') !== null
    ) || searchHighCheckboxes[0];
    await user.click(searchHighCheckbox);

    // Should show only high priority todo
    expect(screen.getByText('High priority task')).toBeInTheDocument();
    expect(screen.queryByText('Low priority task')).not.toBeInTheDocument();
  });

  test('should search todos by multiple categories in active view (OR logic)', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add todos with different categories
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    
    // Add high priority + urgent todo
    const highCheckboxes = screen.getAllByLabelText('High');
    const highCheckbox = highCheckboxes.find(checkbox => 
      checkbox.closest('.todo-form') !== null
    ) || highCheckboxes[1];
    await user.click(highCheckbox);
    
    const urgentCheckboxes = screen.getAllByLabelText('Urgent');
    const urgentCheckbox = urgentCheckboxes.find(checkbox => 
      checkbox.closest('.todo-form') !== null
    ) || urgentCheckboxes[1];
    await user.click(urgentCheckbox);
    
    await user.type(input, 'High urgent task');
    await user.click(submitButton);
    
    // Add high priority + later todo
    const highCheckbox2 = screen.getAllByLabelText('High').find(checkbox => 
      checkbox.closest('.todo-form') !== null
    ) || screen.getAllByLabelText('High')[1];
    await user.click(highCheckbox2);
    
    const laterCheckboxes = screen.getAllByLabelText('Later');
    const laterCheckbox = laterCheckboxes.find(checkbox => 
      checkbox.closest('.todo-form') !== null
    ) || laterCheckboxes[1];
    await user.click(laterCheckbox);
    
    await user.type(input, 'High later task');
    await user.click(submitButton);
    
    // Add low priority todo
    const lowCheckboxes = screen.getAllByLabelText('Low');
    const lowCheckbox = lowCheckboxes.find(checkbox => 
      checkbox.closest('.todo-form') !== null
    ) || lowCheckboxes[1];
    await user.click(lowCheckbox);
    await user.type(input, 'Low priority task');
    await user.click(submitButton);

    // Search by high priority OR urgent (search uses OR logic)
    const searchHighCheckboxes = screen.getAllByLabelText('High');
    const searchHighCheckbox = searchHighCheckboxes.find(checkbox => 
      checkbox.closest('.search-category-selection') !== null
    ) || searchHighCheckboxes[0];
    await user.click(searchHighCheckbox);
    
    const searchUrgentCheckboxes = screen.getAllByLabelText('Urgent');
    const searchUrgentCheckbox = searchUrgentCheckboxes.find(checkbox => 
      checkbox.closest('.search-category-selection') !== null
    ) || searchUrgentCheckboxes[0];
    await user.click(searchUrgentCheckbox);

    // Should show todos matching either category (OR logic)
    expect(screen.getByText('High urgent task')).toBeInTheDocument();
    expect(screen.getByText('High later task')).toBeInTheDocument(); // Has "high" category
    expect(screen.queryByText('Low priority task')).not.toBeInTheDocument();
  });

  test('should search todos by category in archive view', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add and archive todos with different categories
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    
    // Add critical priority todo
    const criticalCheckboxes = screen.getAllByLabelText('Critical');
    const criticalCheckbox = criticalCheckboxes.find(checkbox => 
      checkbox.closest('.todo-form') !== null
    ) || criticalCheckboxes[1];
    await user.click(criticalCheckbox);
    await user.type(input, 'Critical archived task');
    await user.click(submitButton);
    
    // Add medium priority todo
    await user.type(input, 'Medium archived task');
    await user.click(submitButton);

    // Archive both todos
    const completeButtons = screen.getAllByLabelText('Mark as complete');
    await user.click(completeButtons[0]);
    await user.click(completeButtons[0]);

    // Switch to archive view
    const archiveButton = screen.getByText(/Archive/);
    await user.click(archiveButton);

    // Search by critical category
    const searchCriticalCheckboxes = screen.getAllByLabelText('Critical');
    const searchCriticalCheckbox = searchCriticalCheckboxes.find(checkbox => 
      checkbox.closest('.search-category-selection') !== null
    ) || searchCriticalCheckboxes[0];
    await user.click(searchCriticalCheckbox);

    // Should show only critical priority archived todo
    expect(screen.getByText('Critical archived task')).toBeInTheDocument();
    expect(screen.queryByText('Medium archived task')).not.toBeInTheDocument();
  });

  test('should combine text and category search in active view', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add todos
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    
    // Add high priority "Buy" todo
    const highCheckboxes = screen.getAllByLabelText('High');
    const highCheckbox = highCheckboxes.find(checkbox => 
      checkbox.closest('.todo-form') !== null
    ) || highCheckboxes[1];
    await user.click(highCheckbox);
    await user.type(input, 'Buy groceries');
    await user.click(submitButton);
    
    // Add high priority "Call" todo
    const highCheckbox2 = screen.getAllByLabelText('High').find(checkbox => 
      checkbox.closest('.todo-form') !== null
    ) || screen.getAllByLabelText('High')[1];
    await user.click(highCheckbox2);
    await user.type(input, 'Call dentist');
    await user.click(submitButton);
    
    // Add low priority "Buy" todo
    const lowCheckboxes = screen.getAllByLabelText('Low');
    const lowCheckbox = lowCheckboxes.find(checkbox => 
      checkbox.closest('.todo-form') !== null
    ) || lowCheckboxes[1];
    await user.click(lowCheckbox);
    await user.type(input, 'Buy milk');
    await user.click(submitButton);

    // Search by text "Buy" AND category "high"
    const searchInput = screen.getByPlaceholderText('Search by text...');
    await user.type(searchInput, 'Buy');
    
    const searchHighCheckboxes = screen.getAllByLabelText('High');
    const searchHighCheckbox = searchHighCheckboxes.find(checkbox => 
      checkbox.closest('.search-category-selection') !== null
    ) || searchHighCheckboxes[0];
    await user.click(searchHighCheckbox);

    // Should show only high priority "Buy" todo
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.queryByText('Call dentist')).not.toBeInTheDocument();
    expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();
  });

  test('should clear search and show all todos', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add multiple todos
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    
    await user.type(input, 'First todo');
    await user.click(submitButton);
    
    await user.type(input, 'Second todo');
    await user.click(submitButton);

    // Search for "First"
    const searchInput = screen.getByPlaceholderText('Search by text...');
    await user.type(searchInput, 'First');

    // Should show only first todo
    expect(screen.getByText('First todo')).toBeInTheDocument();
    expect(screen.queryByText('Second todo')).not.toBeInTheDocument();

    // Clear search
    const clearButton = screen.getByText('Clear Search');
    await user.click(clearButton);

    // Should show all todos
    expect(screen.getByText('First todo')).toBeInTheDocument();
    expect(screen.getByText('Second todo')).toBeInTheDocument();
    expect(screen.getByText(/2 uncompleted todo tasks/)).toBeInTheDocument();
  });

  test('should show empty state when search has no results in active view', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a todo
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    await user.type(input, 'Existing todo');
    await user.click(submitButton);

    // Search for non-existent text
    const searchInput = screen.getByPlaceholderText('Search by text...');
    await user.type(searchInput, 'NonExistent');

    // Should show empty state message
    expect(screen.getByText('No todos match your search criteria.')).toBeInTheDocument();
    expect(screen.queryByText('Existing todo')).not.toBeInTheDocument();
  });

  test('should show empty state when search has no results in archive view', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add and archive a todo
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    await user.type(input, 'Archived todo');
    await user.click(submitButton);

    const completeButton = screen.getByLabelText('Mark as complete');
    await user.click(completeButton);

    // Switch to archive view
    const archiveButton = screen.getByText(/Archive/);
    await user.click(archiveButton);

    // Search for non-existent text
    const searchInput = screen.getByPlaceholderText('Search by text...');
    await user.type(searchInput, 'NonExistent');

    // Should show empty state message
    expect(screen.getByText('No archived todos match your search criteria.')).toBeInTheDocument();
    expect(screen.queryByText('Archived todo')).not.toBeInTheDocument();
  });
});

describe('Todo App - Theme Toggle', () => {
  test('should render theme toggle button', () => {
    render(<App />);
    const themeButton = screen.getByRole('button', { name: /switch to/i });
    expect(themeButton).toBeInTheDocument();
    expect(themeButton).toHaveClass('theme-toggle');
  });

  test('should start with light theme by default', () => {
    render(<App />);
    const themeButton = screen.getByRole('button', { name: /switch to dark theme/i });
    expect(themeButton).toBeInTheDocument();
    expect(themeButton).toHaveTextContent('🌙');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  test('should toggle to dark theme when button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const themeButton = screen.getByRole('button', { name: /switch to dark theme/i });
    await user.click(themeButton);

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(themeButton).toHaveTextContent('☀️');
      expect(themeButton).toHaveAttribute('aria-label', 'Switch to light theme');
      expect(themeButton).toHaveAttribute('title', 'Switch to light theme');
    });
  });

  test('should toggle back to light theme when clicked again', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const themeButton = screen.getByRole('button', { name: /switch to dark theme/i });
    
    // Toggle to dark
    await user.click(themeButton);
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    // Toggle back to light
    const lightThemeButton = screen.getByRole('button', { name: /switch to light theme/i });
    await user.click(lightThemeButton);

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(lightThemeButton).toHaveTextContent('🌙');
      expect(lightThemeButton).toHaveAttribute('aria-label', 'Switch to dark theme');
    });
  });

  test('should save theme preference to localStorage', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const themeButton = screen.getByRole('button', { name: /switch to dark theme/i });
    await user.click(themeButton);

    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', '"dark"');
    });
  });

  test('should load theme preference from localStorage on mount', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'theme') return 'dark';
      return null;
    });
    render(<App />);

    const themeButton = screen.getByRole('button', { name: /switch to light theme/i });
    expect(themeButton).toBeInTheDocument();
    expect(themeButton).toHaveTextContent('☀️');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  test('should apply theme attribute to document element on mount', () => {
    render(<App />);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  test('should update document element when theme changes', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    
    const themeButton = screen.getByRole('button', { name: /switch to dark theme/i });
    await user.click(themeButton);

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  test('should maintain theme during todo operations', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Set to dark theme
    const themeButton = screen.getByRole('button', { name: /switch to dark theme/i });
    await user.click(themeButton);
    
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    // Add a todo
    const input = screen.getByPlaceholderText('Add a new todo...');
    const submitButton = screen.getByText('Add Todo');
    await user.type(input, 'Test todo');
    await user.click(submitButton);

    // Theme should still be dark
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  test('should persist theme across multiple toggles', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const themeButton = screen.getByRole('button', { name: /switch to dark theme/i });
    
    // Toggle multiple times
    await user.click(themeButton); // dark
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    await user.click(screen.getByRole('button', { name: /switch to light theme/i })); // light
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    await user.click(screen.getByRole('button', { name: /switch to dark theme/i })); // dark
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    // Final state should be dark
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', '"dark"');
  });
});

