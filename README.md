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

## Project Structure

```
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Component styles
│   ├── main.jsx         # Application entry point
│   ├── index.css        # Global styles
│   └── assets/          # Static assets (images, icons)
├── public/              # Public static files
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── eslint.config.js     # ESLint configuration
└── package.json         # Project dependencies and scripts
```

## Features

- ⚡️ Lightning-fast development with Vite HMR
- ⚛️ React 19 with modern hooks
- 🎨 Responsive design with dark/light theme support
- ♿️ Accessibility-focused markup
- 🔍 ESLint for code quality
- 🎯 Optimized production builds

## Code Quality

- Zero linting errors
- Modern React patterns (functional components, hooks)
- Accessible markup with ARIA attributes
- Secure external links with proper rel attributes

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
