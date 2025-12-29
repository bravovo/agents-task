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

This project includes comprehensive unit tests using Jest and React Testing Library.

### Run Tests

Run all tests once:

```bash
npm test
```

Run tests in watch mode (automatically re-runs on file changes):

```bash
npm run test:watch
```

### Test Coverage

Generate a coverage report:

```bash
npm run test:coverage
```

This will:
- Run all tests
- Generate coverage reports in multiple formats:
  - **Text summary** in the terminal
  - **HTML report** in `coverage/index.html` (open in browser for detailed view)
  - **LCOV report** in `coverage/lcov.info` (for CI/CD integration)
  - **JSON summary** in `coverage/coverage-summary.json`

Run tests with coverage in watch mode:

```bash
npm run test:coverage:watch
```

### Coverage Thresholds

The project maintains minimum coverage thresholds:
- **Branches**: 60%
- **Functions**: 70%
- **Lines**: 75%
- **Statements**: 75%

### Viewing Coverage Reports

After running `npm run test:coverage`, open the HTML report:

```bash
# On macOS/Linux
open coverage/index.html

# On Windows
start coverage/index.html

# Or simply navigate to the file in your file explorer
```

The HTML report provides:
- Line-by-line coverage highlighting
- File-by-file coverage breakdown
- Interactive navigation through the codebase

## Project Structure

```
src/
├── main.jsx          # Application entry point
├── App.jsx           # Main app component with todo state management
├── App.css           # Styles with white and beige theme
├── App.test.jsx     # Unit tests for App component
├── setupTests.js     # Jest test setup configuration
└── components/
    └── TodoList.jsx  # Component for displaying todos
```

## Technologies Used

### Core
- React 18
- Vite
- CSS3

### Testing
- Jest - Testing framework
- React Testing Library - Component testing utilities
- @testing-library/user-event - User interaction simulation
- @testing-library/jest-dom - DOM matchers for Jest

