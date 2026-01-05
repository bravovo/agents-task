#!/bin/bash
# Test verification script for Cypress component tests

echo "========================================="
echo "Cypress Component Tests - Verification"
echo "========================================="
echo ""

# Count test files
test_files=$(find cypress/component -name "*.cy.jsx" | wc -l)
echo "✓ Total test files: $test_files"

# Count total tests
total_tests=0
for file in cypress/component/*.cy.jsx; do
    count=$(grep -c '^\s*it(' "$file")
    filename=$(basename "$file")
    echo "  - $filename: $count tests"
    total_tests=$((total_tests + count))
done

echo ""
echo "✓ Total tests: $total_tests"
echo ""

# Check configuration files
echo "Configuration files:"
if [ -f "cypress.config.js" ]; then
    echo "✓ cypress.config.js exists"
else
    echo "✗ cypress.config.js missing"
fi

if [ -f "cypress/support/component.js" ]; then
    echo "✓ cypress/support/component.js exists"
else
    echo "✗ cypress/support/component.js missing"
fi

if [ -f ".nycrc.component.json" ]; then
    echo "✓ .nycrc.component.json exists"
else
    echo "✗ .nycrc.component.json missing"
fi

echo ""
echo "Component coverage:"
src_components=$(find src/components -name "*.jsx" | wc -l)
test_components=$(find cypress/component -name "*.cy.jsx" | wc -l)
echo "  - Components in src/: $src_components"
echo "  - Component tests: $test_components"

if [ "$src_components" -eq "$test_components" ]; then
    echo "✓ All components have tests!"
else
    echo "⚠ Component/test count mismatch"
fi

echo ""
echo "========================================="
echo "Verification complete!"
echo "========================================="
