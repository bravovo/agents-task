# Vite + React Project

A modern React application built with Vite, featuring a simple counter demonstration.

## Overview

This project showcases a minimal React application setup using Vite as the build tool. It includes a basic counter component demonstrating React state management with hooks.

## Tech Stack

- **React 19.2.0** - Modern React framework
- **Vite 7.2.4** - Fast build tool and development server
- **ESLint 9.39.1** - Code quality and linting

## Prerequisites

- Node.js (version 16 or higher recommended)
- npm (comes with Node.js)

## Getting Started

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Building

Create an optimized production build:

```bash
npm run build
```

The build output will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

### Testing

Run the test suite:

```bash
npm test
```

Run tests with code coverage:

```bash
npm run test:coverage
```

Run tests in watch mode:

```bash
npm run test:watch
```

The test suite includes 72 comprehensive tests:

**Utility Tests (40 tests)** - `src/todoUtils.js`
- Create, Read, Update, Delete operations
- Complete, Restore, Archive management
- Search and filter functionality
- Edge cases: empty inputs, whitespace validation, non-existent IDs

**Component Tests (32 tests)** - `src/App.jsx`
- Initial rendering and UI elements
- Adding, editing, and deleting todos
- Completing and restoring todos
- Searching and filtering by text and categories
- Theme toggle (light/dark mode)
- View toggle (Active/Archive)
- Full workflow integration tests

**Coverage:**
- **100%** Statement Coverage
- **90.47%** Branch Coverage
- **100%** Function Coverage
- **100%** Line Coverage

Coverage reports are generated in the `coverage/` directory and include:
- HTML report: `coverage/index.html`
- LCOV report: `coverage/lcov.info`
- Text summary in terminal output

### End-to-End Testing with Cypress

Run E2E tests in interactive mode:

```bash
npm run cypress:open
```

Run E2E tests headless:

```bash
npm run cypress:run
```

Run E2E tests with code coverage:

```bash
npm run test:e2e
```

The E2E test suite includes 6 comprehensive test files covering:

**CRUD Operations** - `cypress/e2e/todo-crud.cy.js`
- Display app title and initial UI
- Add todos with default and custom categories
- Add multiple todos
- Validation (empty inputs, whitespace trimming)
- Delete todos
- Todo count updates

**Edit Functionality** - `cypress/e2e/todo-edit.cy.js`
- Edit todo text
- Edit mode UI (input, save, cancel buttons)
- Cancel editing without saving
- Edit todo categories
- Validation (prevent saving empty text)
- Edit multiple todos independently

**Archive and Restore** - `cypress/e2e/todo-archive.cy.js`
- Complete todos and move to archive
- Strike-through display for completed items
- Restore todos from archive
- Delete from archive
- Preserve categories during complete/restore
- Multiple archived todos

**Search and Filter** - `cypress/e2e/todo-search-filter.cy.js`
- Search by text (case-insensitive)
- Filter by priority, time, and progress
- Combine multiple filters
- Combine search and filters
- Filter archived todos
- Empty state messages

**Theme Toggle** - `cypress/e2e/todo-theme.cy.js`
- Display theme toggle button
- Toggle between light and dark themes
- Persist theme in localStorage
- Restore theme on page reload
- Maintain theme during operations

**Integration Workflows** - `cypress/e2e/todo-integration.cy.js`
- Complete todo workflow (add, edit, complete, restore)
- Multiple todos with different workflows
- Search/filter with active operations
- Data integrity across view switches
- Rapid successive operations
- Theme persistence during operations

**E2E Coverage:**
E2E test coverage reports are generated in the `coverage-e2e/` directory and include:
- HTML report: `coverage-e2e/index.html`
- LCOV report: `coverage-e2e/lcov.info`
- JSON report: `coverage-e2e/coverage-final.json`
- Text summary in terminal output

## Project Structure

```
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Component styles
│   ├── main.jsx         # Application entry point
│   ├── index.css        # Global styles
│   └── assets/          # Static assets (images, icons)
├── cypress/
│   ├── e2e/             # End-to-end test files
│   ├── support/         # Custom commands and configuration
│   └── fixtures/        # Test fixtures
├── public/              # Public static files
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── cypress.config.js    # Cypress configuration
├── eslint.config.js     # ESLint configuration
├── .nycrc               # NYC coverage configuration
└── package.json         # Project dependencies and scripts
```

## Features

- ⚡️ Lightning-fast development with Vite HMR
- ⚛️ React 19 with modern hooks
- 🎨 Responsive design with dark/light theme support
- ♿️ Accessibility-focused markup
- 🔍 ESLint for code quality
- 🎯 Optimized production builds
- 🧪 Comprehensive unit and E2E testing with code coverage

## Code Quality

- Zero linting errors
- Modern React patterns (functional components, hooks)
- Accessible markup with ARIA attributes
- Secure external links with proper rel attributes
- 100% unit test coverage
- Comprehensive E2E test coverage

## Browser Support

This project uses modern JavaScript features and targets evergreen browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is private and not licensed for public use.

## Learn More

- [Vite Documentation](https://vite.dev)
- [React Documentation](https://react.dev)
- [Cypress Documentation](https://docs.cypress.io)

