# Cypress E2E Testing Setup Guide

## Overview

This project includes comprehensive end-to-end testing with Cypress, configured with code coverage tracking using Istanbul. The setup includes 6 test suites covering all aspects of the Todo application.

## Prerequisites

Before running Cypress tests, ensure you have:
- Node.js (version 16 or higher)
- npm (comes with Node.js)
- All project dependencies installed (`npm install`)

## Installation

Cypress has already been installed and configured in this project. The required dependencies are:

- `cypress` - E2E testing framework
- `@cypress/code-coverage` - Code coverage plugin
- `babel-plugin-istanbul` - Code instrumentation
- `nyc` - Coverage reporter
- `vite-plugin-istanbul` - Vite integration for coverage
- `start-server-and-test` - Test automation utility

If you need to reinstall Cypress binary (e.g., on a new machine), run:

```bash
npx cypress install
```

## Configuration Files

### cypress.config.js
Main Cypress configuration file with:
- Base URL: `http://localhost:5173`
- Code coverage setup via `@cypress/code-coverage/task`
- Video recording disabled (can be enabled if needed)
- Screenshot on failure enabled
- Viewport: 1280x720

### .nycrc
NYC configuration for coverage reporting with:
- HTML, LCOV, JSON, and text reports
- Coverage output directory: `coverage-e2e/`
- Source files included: `src/**/*.{js,jsx}`
- Excluded: test files, main.jsx, cypress directory

### vite.config.js
Updated with Istanbul plugin for code instrumentation during build

### eslint.config.js
Updated to recognize Cypress globals (cy, Cypress, describe, it, etc.)

## Test Structure

```
cypress/
├── e2e/                          # Test files
│   ├── todo-crud.cy.js           # Basic CRUD operations
│   ├── todo-edit.cy.js           # Edit functionality
│   ├── todo-archive.cy.js        # Complete and restore
│   ├── todo-search-filter.cy.js  # Search and filter
│   ├── todo-theme.cy.js          # Theme toggle
│   └── todo-integration.cy.js    # Integration workflows
├── support/
│   ├── e2e.js                    # Support file with coverage setup
│   └── commands.js               # Custom commands
└── fixtures/                      # Test fixtures (empty initially)
```

## Running Tests

### Interactive Mode (Cypress UI)

Open the Cypress Test Runner for interactive test development and debugging:

```bash
npm run cypress:open
```

This will:
1. Open the Cypress UI
2. Allow you to select and run individual tests
3. Provide real-time test execution feedback
4. Enable debugging with browser DevTools

### Headless Mode

Run all tests in headless mode (useful for CI/CD):

```bash
npm run cypress:run
```

### With Code Coverage

Run tests and generate code coverage reports:

```bash
npm run test:e2e
```

This will:
1. Build the application with code instrumentation
2. Start the preview server on port 5173
3. Run all Cypress tests
4. Generate coverage reports in `coverage-e2e/` directory
5. Shut down the server after tests complete

## Test Suites

### 1. Basic CRUD Operations (todo-crud.cy.js)
- Display app title and initial UI
- Add todos with default and custom categories
- Add multiple todos
- Validation (empty inputs, whitespace trimming)
- Delete todos
- Todo count updates

**8 tests covering:**
- Initial rendering
- Todo creation with various category combinations
- Input validation
- Delete operations
- UI updates

### 2. Edit Functionality (todo-edit.cy.js)
- Edit todo text
- Edit mode UI (input, save, cancel buttons)
- Cancel editing without saving
- Edit todo categories
- Validation (prevent saving empty text)
- Edit multiple todos independently

**6 tests covering:**
- Edit mode activation
- Text and category updates
- Cancel functionality
- Empty text validation
- Multiple todo editing

### 3. Archive and Restore (todo-archive.cy.js)
- Complete todos and move to archive
- Strike-through display for completed items
- Restore todos from archive
- Delete from archive
- Preserve categories during complete/restore
- Multiple archived todos

**7 tests covering:**
- Complete workflow
- Archive display
- Restore functionality
- Delete from archive
- Category preservation
- Empty state handling

### 4. Search and Filter (todo-search-filter.cy.js)
- Search by text (case-insensitive)
- Filter by priority (high, medium, low)
- Filter by time (today, this week, this month, later)
- Filter by progress (not started, in progress, blocked)
- Combine multiple filters
- Combine search and filters
- Filter archived todos
- Empty state messages

**12 tests covering:**
- Text search
- Category filtering
- Filter combinations
- Search + filter combinations
- Archive filtering
- Empty states

### 5. Theme Toggle (todo-theme.cy.js)
- Display theme toggle button
- Toggle between light and dark themes
- Persist theme in localStorage
- Restore theme on page reload
- Maintain theme during operations

**8 tests covering:**
- Theme toggle UI
- Light/dark mode switching
- LocalStorage persistence
- Theme restoration
- Theme stability during operations

### 6. Integration Workflows (todo-integration.cy.js)
- Complete todo workflow (add, edit, complete, restore)
- Multiple todos with different workflows
- Search/filter with active operations
- Data integrity across view switches
- Rapid successive operations
- Theme persistence during operations

**6 tests covering:**
- Full workflow testing
- Complex scenarios
- Data integrity
- Performance under rapid operations
- Cross-feature interactions

## Custom Commands

The following custom Cypress commands are available (defined in `cypress/support/commands.js`):

### cy.addTodo(text, categories)
Add a new todo with specified text and optional categories.

```javascript
cy.addTodo('Buy groceries')
cy.addTodo('Important meeting', {
  priority: 'high',
  time: 'today',
  progress: 'in-progress'
})
```

### cy.todoShouldExist(text)
Assert that a todo with the specified text exists.

```javascript
cy.todoShouldExist('Buy groceries')
```

### cy.todoShouldNotExist(text)
Assert that a todo with the specified text does not exist.

```javascript
cy.todoShouldNotExist('Deleted todo')
```

### cy.completeTodo(text)
Complete a todo by its text.

```javascript
cy.completeTodo('Buy groceries')
```

### cy.deleteTodo(text)
Delete a todo by its text.

```javascript
cy.deleteTodo('Old todo')
```

### cy.editTodo(oldText, newText)
Edit a todo by replacing its text.

```javascript
cy.editTodo('Old text', 'New text')
```

### cy.goToArchive()
Switch to the archive view.

```javascript
cy.goToArchive()
```

### cy.goToActiveTodos()
Switch to the active todos view.

```javascript
cy.goToActiveTodos()
```

## Code Coverage

### Viewing Coverage Reports

After running `npm run test:e2e`, coverage reports are generated in the `coverage-e2e/` directory:

1. **HTML Report**: Open `coverage-e2e/index.html` in a browser for an interactive view
2. **LCOV Report**: `coverage-e2e/lcov.info` for integration with CI/CD tools
3. **JSON Report**: `coverage-e2e/coverage-final.json` for programmatic access
4. **Text Summary**: Displayed in the terminal after test execution

### Coverage Metrics

The coverage report includes:
- **Statement Coverage**: Percentage of statements executed
- **Branch Coverage**: Percentage of conditional branches tested
- **Function Coverage**: Percentage of functions called
- **Line Coverage**: Percentage of lines executed

### Interpreting Coverage

- Green: Well-covered code (>80%)
- Yellow: Partially covered code (50-80%)
- Red: Under-covered code (<50%)

## Debugging Tests

### Using Cypress Test Runner

1. Run `npm run cypress:open`
2. Click on a test file to run it
3. Use the time-travel feature to step through test execution
4. Inspect DOM snapshots at each step
5. Use browser DevTools for debugging

### Debug Mode

Add `.debug()` to any Cypress command to pause execution:

```javascript
cy.get('.todo-input').debug().type('Test todo')
```

### Console Logs

View Cypress logs in the test runner or browser console:

```javascript
cy.log('Custom message')
cy.get('.todo-item').then(($el) => {
  console.log('Element:', $el)
})
```

## Troubleshooting

### Tests Failing to Start

1. Ensure the build is successful: `npm run build`
2. Verify port 5173 is available
3. Check that all dependencies are installed

### Coverage Not Generated

1. Verify Istanbul plugin is configured in `vite.config.js`
2. Check that `@cypress/code-coverage` is imported in `cypress/support/e2e.js`
3. Ensure NYC configuration exists in `.nycrc`

### Cypress Binary Missing

If you see "Cypress binary is missing", run:

```bash
npx cypress install
```

### Network Issues

In restricted environments, Cypress binary download may fail. Solutions:
1. Use a proxy: `HTTPS_PROXY=http://proxy.example.com npx cypress install`
2. Download binary manually and set `CYPRESS_INSTALL_BINARY` environment variable
3. Use cached binary from another machine

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  cypress:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots
      - uses: actions/upload-artifact@v3
        with:
          name: coverage
          path: coverage-e2e
```

## Best Practices

1. **Keep tests independent**: Each test should be able to run in isolation
2. **Use custom commands**: Leverage the provided custom commands for cleaner tests
3. **Clear state**: Use `beforeEach` to ensure clean state before each test
4. **Descriptive names**: Use clear, descriptive test names
5. **Avoid hard-coded waits**: Use Cypress's built-in retry-ability instead of `cy.wait()`
6. **Test user workflows**: Focus on real user scenarios, not implementation details
7. **Review coverage**: Regularly check coverage reports to identify gaps

## Additional Resources

- [Cypress Documentation](https://docs.cypress.io)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Code Coverage Plugin](https://github.com/cypress-io/code-coverage)
- [NYC Documentation](https://github.com/istanbuljs/nyc)
