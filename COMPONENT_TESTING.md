# Cypress Component Tests

This repository includes comprehensive Cypress component tests for all React components in the Todo App.

## Overview

Component tests allow you to test React components in isolation, similar to unit tests but with the full power of Cypress. These tests run in a real browser and provide code coverage reporting.

## Test Coverage

The following components have complete test coverage:

1. **Header** (5 tests) - Theme toggle functionality and display
2. **ViewToggle** (7 tests) - Toggle between active and archived views
3. **CategorySelect** (8 tests) - Dropdown component for category selection
4. **SearchFilter** (12 tests) - Search and filter functionality
5. **TodoForm** (12 tests) - Form for adding new todos
6. **TodoItem** (18 tests) - Individual todo item in view, edit, and archived modes
7. **TodoList** (10 tests) - List of todos with proper state management

**Total: 72 component tests**

## Running Component Tests

### Prerequisites

Make sure all dependencies are installed:
```bash
npm install
```

Note: If running in a CI environment without internet access to download Cypress binary, the tests may not be executable. In local development, Cypress will automatically download the binary on first run.

### Running Tests

#### Interactive Mode (with Cypress UI)
```bash
npm run cypress:component:open
```
This opens the Cypress Test Runner where you can select and run individual component tests.

#### Headless Mode (for CI/CD)
```bash
npm run test:component
```
This runs all component tests in headless mode.

#### With Code Coverage
```bash
npm run test:component:coverage
```
This runs all component tests and generates a code coverage report.

### Alternative Commands
```bash
# Run component tests only
npm run cypress:component

# Open Cypress UI for component testing
cypress open --component
```

## Code Coverage

### Configuration

Code coverage is configured through:
- **Vite Plugin**: `vite-plugin-istanbul` instruments the code during the build
- **Cypress Plugin**: `@cypress/code-coverage` collects coverage data during tests
- **NYC Config**: `.nycrc.component.json` configures coverage reporting

### Coverage Reports

After running `npm run test:component:coverage`, coverage reports are generated in:
- **Terminal**: Text summary of coverage
- **HTML Report**: `coverage-component/index.html` - Detailed interactive report
- **LCOV Report**: `coverage-component/lcov.info` - For CI integration
- **JSON Report**: `coverage-component/coverage-final.json` - Machine-readable format

### Viewing Coverage

To view the HTML coverage report:
```bash
# Run tests with coverage
npm run test:component:coverage

# Open the HTML report (on Mac)
open coverage-component/index.html

# Or on Linux
xdg-open coverage-component/index.html
```

## Test Structure

All component tests are located in the `cypress/component/` directory:

```
cypress/
├── component/
│   ├── Header.cy.jsx
│   ├── ViewToggle.cy.jsx
│   ├── CategorySelect.cy.jsx
│   ├── SearchFilter.cy.jsx
│   ├── TodoForm.cy.jsx
│   ├── TodoItem.cy.jsx
│   └── TodoList.cy.jsx
└── support/
    ├── component.js            # Component test setup
    └── component-index.html    # HTML template for component tests
```

## Writing New Component Tests

When adding new components or modifying existing ones, follow this pattern:

```jsx
import YourComponent from '../../src/components/YourComponent'

describe('YourComponent', () => {
  it('renders correctly', () => {
    cy.mount(<YourComponent prop="value" />)
    cy.contains('Expected Text').should('be.visible')
  })

  it('handles interactions', () => {
    const onClickSpy = cy.spy().as('onClickSpy')
    cy.mount(<YourComponent onClick={onClickSpy} />)
    cy.get('.button').click()
    cy.get('@onClickSpy').should('have.been.calledOnce')
  })
})
```

## Key Testing Patterns Used

1. **Component Mounting**: Using `cy.mount()` to render components
2. **Spy Functions**: Using `cy.spy()` to verify callbacks
3. **Assertions**: Using Cypress assertions to verify component behavior
4. **Multiple Test Cases**: Testing different states, props, and interactions
5. **Accessibility**: Verifying ARIA labels and semantic HTML

## Continuous Integration

To run component tests in CI:

```bash
# Ensure Cypress binary is cached or available
# Run component tests
npm run test:component

# Generate coverage report
npm run test:component:coverage
```

The tests are configured to:
- Run in headless mode
- Generate code coverage automatically
- Handle uncaught exceptions gracefully
- Work with React 19 and Vite

## Troubleshooting

### Cypress Binary Not Found

If you see an error about the Cypress binary being missing:

```bash
# Install the Cypress binary
npx cypress install

# Or set cache directory
export CYPRESS_CACHE_FOLDER=/path/to/cache
```

### Tests Failing

1. Ensure all dependencies are installed: `npm install`
2. Check that the component structure matches the tests
3. Run tests interactively to debug: `npm run cypress:component:open`
4. Check console output for specific error messages

### Coverage Not Generating

1. Verify `vite-plugin-istanbul` is configured in `vite.config.js`
2. Check that `.nycrc.component.json` exists
3. Ensure `@cypress/code-coverage` plugin is loaded in `cypress/support/component.js`
4. Run with verbose output: `DEBUG=cypress:* npm run test:component:coverage`

## Benefits of Component Testing

1. **Fast Feedback**: Tests run faster than E2E tests
2. **Isolated Testing**: Test components in isolation without dependencies
3. **Real Browser**: Tests run in a real browser, catching real issues
4. **Developer Experience**: Interactive test runner with time-travel debugging
5. **Code Coverage**: Automatic code coverage reporting
6. **CI/CD Ready**: Headless mode for automated testing

## Related Documentation

- [Cypress Component Testing](https://docs.cypress.io/guides/component-testing/overview)
- [Code Coverage Plugin](https://github.com/cypress-io/code-coverage)
- [Vite Istanbul Plugin](https://github.com/ifaxity/vite-plugin-istanbul)
- [NYC Configuration](https://github.com/istanbuljs/nyc#configuration-files)
