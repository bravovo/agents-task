# Cypress E2E Tests - New Test Coverage

This document describes the new end-to-end test scenarios added to the Todo App.

## New Test Files

### 1. `todo-category-editing.cy.js` (13 tests)

Comprehensive tests for editing todo categories with various scenarios:

#### Individual Category Editing
- **Edit only priority**: Change priority while keeping time and progress unchanged
- **Edit only time**: Change time category while keeping others unchanged
- **Edit only progress**: Change progress while keeping others unchanged

#### Bulk Category Operations
- **Change all categories at once**: Modify priority, time, and progress together
- **Edit text and categories together**: Update both todo text and categories in one operation

#### Category Editing Workflows
- **Cancel category changes**: Verify canceling preserves original categories
- **Edit multiple todos independently**: Change categories for different todos without interference
- **Cycle through options**: Test cycling through all priority, time, and progress values
- **Maintain edits across sessions**: Verify incremental category changes persist correctly

#### Edge Cases
- **Preserve categories on failed edit**: Ensure categories remain when edit fails
- **Verify dropdown values**: Check correct category dropdowns appear in edit mode

---

### 2. `todo-advanced-archive.cy.js` (16 tests)

Advanced archiving scenarios beyond basic complete/restore operations:

#### Archiving with Filters
- **Archive with search active**: Complete todos while search filter is applied
- **Archive with category filter**: Complete todos while category filters are active
- **Archive multiple with different categories**: Test archiving todos with various category combinations

#### Archive View Operations
- **Search archived todos**: Filter archived items by text search
- **Filter archived by categories**: Apply category filters to archive view
- **Restore multiple from archive**: Batch restore operations
- **Delete multiple from archive**: Batch delete operations from archive

#### Data Integrity
- **Archive count accuracy**: Verify counter updates correctly during operations
- **Category preservation**: Ensure categories persist through archive/restore cycles
- **Completed styling**: Verify archived todos display with correct styling
- **Edit restrictions**: Confirm archived todos cannot be edited

#### Complex Workflows
- **Archive/restore with search**: Handle operations while search is active
- **Archive all category combinations**: Test comprehensive category coverage
- **Restore and re-archive**: Cycle todos through archive multiple times
- **Quick bulk operations**: Rapid archive/restore of multiple todos
- **Default category handling**: Archive todos created with default categories

---

### 3. `todo-advanced-deletion.cy.js` (22 tests)

Extensive deletion scenarios covering edge cases and complex situations:

#### Deletion with Filters
- **Delete with search active**: Remove todos while search filter is applied
- **Delete with category filter**: Remove todos while category filters are active
- **Combined search and filter**: Delete with both filters active simultaneously

#### Sequential Operations
- **Delete multiple in sequence**: Remove several todos one after another
- **Delete last remaining**: Handle deletion of the only todo
- **Delete all one by one**: Systematically remove all todos

#### Deletion from Different Views
- **Delete from archive**: Remove todos from archive view
- **Delete from both views**: Handle deletions from active and archive in sequence
- **Delete after editing**: Remove todos that were previously edited
- **Delete after archive cycle**: Remove todos that were archived and restored

#### List Position Testing
- **Delete first todo**: Remove from beginning of list
- **Delete middle todo**: Remove from middle of list
- **Delete last todo**: Remove from end of list

#### Data Integrity
- **Update counts**: Verify todo counts update correctly after deletion
- **Preserve other categories**: Ensure remaining todos keep their categories
- **Maintain data after rapid deletions**: Test integrity with quick successive deletes
- **Allow add after delete all**: Verify can add new todos after clearing all

#### Edge Cases
- **Empty message with filters**: Show correct message when filtered results are deleted
- **Long text todos**: Delete todos with lengthy text content
- **Special characters**: Delete todos containing special characters and emojis

---

## Test Statistics

- **Total new tests added**: 51
- **Category editing scenarios**: 13
- **Archive operation scenarios**: 16  
- **Deletion scenarios**: 22

## Test Patterns

All new tests follow the established patterns in the repository:

- Use `beforeEach()` to visit the app before each test
- Utilize custom Cypress commands (`addTodo`, `deleteTodo`, `completeTodo`, `editTodo`, `goToArchive`, `goToActiveTodos`)
- Follow descriptive naming convention: `it('should [action] [expected result]')`
- Test both UI state and data integrity
- Verify counts and empty messages
- Check category badge presence and accuracy

## Running the Tests

To run all tests including the new ones:

```bash
# Run all e2e tests
npm run test:e2e

# Open Cypress interactive mode
npm run cypress:open

# Run only new test files
npm run cypress:run -- --spec "cypress/e2e/todo-category-editing.cy.js"
npm run cypress:run -- --spec "cypress/e2e/todo-advanced-archive.cy.js"
npm run cypress:run -- --spec "cypress/e2e/todo-advanced-deletion.cy.js"
```

## Coverage Improvements

These tests significantly expand coverage of:

1. **Category Management**: Comprehensive testing of all category editing combinations and workflows
2. **Archive Operations**: Advanced scenarios beyond basic complete/restore, including filtering and bulk operations
3. **Deletion Safety**: Edge cases ensuring data integrity and proper UI updates during deletions
4. **Filter Interactions**: Testing operations while search and category filters are active
5. **Multi-operation Workflows**: Complex scenarios combining multiple operations in sequence

## Related Files

- Existing tests: `cypress/e2e/todo-*.cy.js`
- Custom commands: `cypress/support/commands.js`
- App component: `src/App.jsx`
- Cypress config: `cypress.config.js`
