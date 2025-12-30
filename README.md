<img width="932" height="911" alt="image" src="https://github.com/user-attachments/assets/5457e82b-e6b8-4964-88a6-385e599bc622" />
<img width="819" height="862" alt="image" src="https://github.com/user-attachments/assets/80e73808-842a-492f-ac4d-cab125c34aeb" />
<img width="935" height="611" alt="image" src="https://github.com/user-attachments/assets/83c43754-ba4a-4bb7-adde-9bb209da3758" />
<img width="713" height="262" alt="image" src="https://github.com/user-attachments/assets/c3a3e520-db50-4557-899f-336342a01384" />
<img width="935" height="611" alt="image" src="https://github.com/user-attachments/assets/83c43754-ba4a-4bb7-adde-9bb209da3758" />
<img width="713" height="262" alt="image" src="https://github.com/user-attachments/assets/c3a3e520-db50-4557-899f-336342a01384" />

<img width="811" height="439" alt="image" src="https://github.com/user-attachments/assets/345cf67e-11f4-4d89-8ab5-3cc1ba4b9750" />
<img width="791" height="819" alt="image" src="https://github.com/user-attachments/assets/c9ad4867-0801-4a52-adc0-6d587089f2db" />
<img width="822" height="554" alt="image" src="https://github.com/user-attachments/assets/04159c94-c836-474b-af09-3cab7c54c327" />


# Todo List App

A simple todo list application built with React.js and Vite, featuring a clean white and beige color theme.

## Features

- Add todos via input field and submit button
- Edit todos (text and categories)
- Archive/complete todos
- Restore archived todos
- Delete todos from active and archive views
- Search todos by text and categories
- Filter todos by priority, time, and progress categories
- Dark/Light theme toggle
- Responsive design
- Clean, minimal UI with white and beige color scheme
- Comprehensive unit test coverage

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Testing

This project includes comprehensive unit tests and end-to-end (E2E) integration tests.

### Test Files

- **`src/App.test.jsx`** - Unit tests for individual components and functions (Jest + React Testing Library)
- **`cypress/e2e/todo-app.cy.js`** - End-to-end integration tests using Cypress (simulating complete user workflows in a real browser)

### Run Tests

#### Unit Tests (Jest)

Run all unit tests once:

```bash
npm test
```

Run only unit tests:

```bash
npm test -- App.test.jsx
```

Run tests in watch mode (automatically re-runs on file changes):

```bash
npm run test:watch
```

#### End-to-End Tests (Cypress)

**Important**: Before running Cypress E2E tests, make sure the development server is running:

```bash
# In one terminal, start the dev server
npm run dev
```

Then, in another terminal, run Cypress tests:

**Run Cypress tests in headless mode (CI-friendly):**
```bash
npm run test:e2e
```

**Open Cypress Test Runner (interactive GUI):**
```bash
npm run test:e2e:open
```

**Run Cypress tests with code coverage:**
```bash
npm run test:e2e:coverage        # Headless mode with coverage
npm run test:e2e:coverage:open   # Interactive mode with coverage
```

Or use the direct Cypress commands:
```bash
npm run cypress:run    # Headless mode
npm run cypress:open   # Interactive mode
```

### End-to-End Tests

The E2E tests (`cypress/e2e/todo-app.cy.js`) use Cypress to simulate complete user workflows in a real browser and include:

1. **Main E2E Scenario**: Complete todo lifecycle
   - Create todo → Edit todo with new category → Complete todo → Search in archive → Uncomplete → Delete

2. **Multiple Todos Workflow**: Handling multiple todos simultaneously
   - Create multiple todos → Complete some → Search and filter → Delete multiple

3. **Search and Filter Workflow**: Testing search functionality
   - Search by text and categories across active and archive views

4. **Category Management Workflow**: Testing category changes
   - Edit categories and maintain category constraints

5. **Edit Cancellation Workflow**: Testing edit cancellation
   - Start editing and cancel without saving changes

6. **Archive to Active and Back**: Testing todo movement
   - Move todos between active and archive multiple times

7. **Empty States and Edge Cases**: Testing edge cases
   - Empty states, search with no results, etc.

8. **Theme Toggle Functionality**: Testing theme switching
   - Toggle between light and dark themes
   - Theme persistence in localStorage
   - Theme persistence across app re-renders
   - Theme maintenance during todo operations
   - Multiple theme toggles
   - Loading saved theme preference

### Test Coverage

#### Unit Test Coverage (Jest)

Generate a coverage report for unit tests:

```bash
npm run test:coverage
```

This will:
- Run all unit tests
- Generate coverage reports in multiple formats:
  - **Text summary** in the terminal
  - **HTML report** in `coverage/index.html` (open in browser for detailed view)
  - **LCOV report** in `coverage/lcov.info` (for CI/CD integration)
  - **JSON summary** in `coverage/coverage-summary.json`

Run tests with coverage in watch mode:

```bash
npm run test:coverage:watch
```

#### End-to-End Test Coverage (Cypress)

Generate a coverage report for E2E tests:

**Important**: Before running Cypress tests with coverage, make sure the development server is running:

```bash
# In one terminal, start the dev server
npm run dev
```

Then, in another terminal, run Cypress tests with coverage:

```bash
npm run test:e2e:coverage        # Headless mode
npm run test:e2e:coverage:open   # Interactive mode
```

This will:
- Run all Cypress E2E tests
- Collect code coverage data from the application
- Generate coverage reports in `coverage-e2e/` directory:
  - **Text summary** in the terminal
  - **HTML report** in `coverage-e2e/index.html` (open in browser for detailed view)
  - **LCOV report** in `coverage-e2e/lcov.info` (for CI/CD integration)
  - **JSON summary** in `coverage-e2e/coverage-summary.json`

### Coverage Thresholds

The project maintains minimum coverage thresholds for unit tests:
- **Branches**: 60%
- **Functions**: 70%
- **Lines**: 75%
- **Statements**: 75%

### Viewing Coverage Reports

#### Unit Test Coverage

After running `npm run test:coverage`, open the HTML report:

```bash
# On macOS/Linux
open coverage/index.html

# On Windows
start coverage/index.html

# Or simply navigate to the file in your file explorer
```

#### E2E Test Coverage

After running `npm run test:e2e:coverage`, open the HTML report:

```bash
# On macOS/Linux
open coverage-e2e/index.html

# On Windows
start coverage-e2e/index.html

# Or simply navigate to the file in your file explorer
```

The HTML reports provide:
- Line-by-line coverage highlighting
- File-by-file coverage breakdown
- Interactive navigation through the codebase

## Project Structure

```
src/
├── main.jsx          # Application entry point
├── App.jsx           # Main app component with todo state management
├── App.css           # Styles with white and beige theme
├── App.test.jsx      # Unit tests for App component (Jest)
├── App.e2e.test.jsx  # Legacy E2E tests (Jest) - replaced by Cypress
├── setupTests.js     # Jest test setup configuration
└── components/
    └── TodoList.jsx  # Component for displaying todos

cypress/
├── e2e/
│   └── todo-app.cy.js  # Cypress end-to-end tests
├── support/
│   ├── e2e.js         # Cypress support file
│   └── commands.js    # Custom Cypress commands
└── fixtures/          # Test fixtures (if needed)
```

## Technologies Used

### Core
- React 18
- Vite
- CSS3

### Testing
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - DOM matchers for Jest
- **Cypress** - End-to-end testing framework

