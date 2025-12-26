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
