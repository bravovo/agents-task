import SearchFilter from '../../src/components/SearchFilter'
import { categoryTypes } from '../../src/constants'

describe('SearchFilter Component', () => {
  const defaultFilterCategories = {
    priority: 'all',
    time: 'all',
    progress: 'all'
  }

  it('renders search input with correct placeholder', () => {
    cy.mount(
      <SearchFilter
        searchText=""
        onSearchChange={() => {}}
        filterCategories={defaultFilterCategories}
        onFilterChange={() => {}}
      />
    )
    cy.get('.search-input').should('have.attr', 'placeholder', 'Search todos...')
  })

  it('displays search text value', () => {
    cy.mount(
      <SearchFilter
        searchText="test search"
        onSearchChange={() => {}}
        filterCategories={defaultFilterCategories}
        onFilterChange={() => {}}
      />
    )
    cy.get('.search-input').should('have.value', 'test search')
  })

  it('calls onSearchChange when typing in search input', () => {
    const onSearchChangeSpy = cy.spy().as('onSearchChangeSpy')
    cy.mount(
      <SearchFilter
        searchText=""
        onSearchChange={onSearchChangeSpy}
        filterCategories={defaultFilterCategories}
        onFilterChange={() => {}}
      />
    )
    cy.get('.search-input').type('new search')
    cy.get('@onSearchChangeSpy').should('have.been.called')
  })

  it('renders all three filter groups (priority, time, progress)', () => {
    cy.mount(
      <SearchFilter
        searchText=""
        onSearchChange={() => {}}
        filterCategories={defaultFilterCategories}
        onFilterChange={() => {}}
      />
    )
    cy.contains('Priority:').should('be.visible')
    cy.contains('Time:').should('be.visible')
    cy.contains('Progress:').should('be.visible')
  })

  it('shows "All" option for each filter category', () => {
    cy.mount(
      <SearchFilter
        searchText=""
        onSearchChange={() => {}}
        filterCategories={defaultFilterCategories}
        onFilterChange={() => {}}
      />
    )
    cy.get('#filter-priority option[value="all"]').should('contain', 'All')
    cy.get('#filter-time option[value="all"]').should('contain', 'All')
    cy.get('#filter-progress option[value="all"]').should('contain', 'All')
  })

  it('displays correct selected filter values', () => {
    cy.mount(
      <SearchFilter
        searchText=""
        onSearchChange={() => {}}
        filterCategories={{
          priority: 'high',
          time: 'today',
          progress: 'in-progress'
        }}
        onFilterChange={() => {}}
      />
    )
    cy.get('#filter-priority').should('have.value', 'high')
    cy.get('#filter-time').should('have.value', 'today')
    cy.get('#filter-progress').should('have.value', 'in-progress')
  })

  it('calls onFilterChange with correct type and value for priority', () => {
    const onFilterChangeSpy = cy.spy().as('onFilterChangeSpy')
    cy.mount(
      <SearchFilter
        searchText=""
        onSearchChange={() => {}}
        filterCategories={defaultFilterCategories}
        onFilterChange={onFilterChangeSpy}
      />
    )
    cy.get('#filter-priority').select('high')
    cy.get('@onFilterChangeSpy').should('have.been.calledWith', 'priority', 'high')
  })

  it('calls onFilterChange with correct type and value for time', () => {
    const onFilterChangeSpy = cy.spy().as('onFilterChangeSpy')
    cy.mount(
      <SearchFilter
        searchText=""
        onSearchChange={() => {}}
        filterCategories={defaultFilterCategories}
        onFilterChange={onFilterChangeSpy}
      />
    )
    cy.get('#filter-time').select('this-week')
    cy.get('@onFilterChangeSpy').should('have.been.calledWith', 'time', 'this-week')
  })

  it('calls onFilterChange with correct type and value for progress', () => {
    const onFilterChangeSpy = cy.spy().as('onFilterChangeSpy')
    cy.mount(
      <SearchFilter
        searchText=""
        onSearchChange={() => {}}
        filterCategories={defaultFilterCategories}
        onFilterChange={onFilterChangeSpy}
      />
    )
    cy.get('#filter-progress').select('blocked')
    cy.get('@onFilterChangeSpy').should('have.been.calledWith', 'progress', 'blocked')
  })

  it('renders all priority filter options', () => {
    cy.mount(
      <SearchFilter
        searchText=""
        onSearchChange={() => {}}
        filterCategories={defaultFilterCategories}
        onFilterChange={() => {}}
      />
    )
    const priorityOptions = Object.keys(categoryTypes.priority.options).length + 1 // +1 for "All"
    cy.get('#filter-priority option').should('have.length', priorityOptions)
  })

  it('renders all time filter options', () => {
    cy.mount(
      <SearchFilter
        searchText=""
        onSearchChange={() => {}}
        filterCategories={defaultFilterCategories}
        onFilterChange={() => {}}
      />
    )
    const timeOptions = Object.keys(categoryTypes.time.options).length + 1 // +1 for "All"
    cy.get('#filter-time option').should('have.length', timeOptions)
  })

  it('renders all progress filter options', () => {
    cy.mount(
      <SearchFilter
        searchText=""
        onSearchChange={() => {}}
        filterCategories={defaultFilterCategories}
        onFilterChange={() => {}}
      />
    )
    const progressOptions = Object.keys(categoryTypes.progress.options).length + 1 // +1 for "All"
    cy.get('#filter-progress option').should('have.length', progressOptions)
  })
})

describe('SearchFilter Component - Edge Cases', () => {
  const defaultFilterCategories = {
    priority: 'all',
    time: 'all',
    progress: 'all'
  }

  it('handles clearing search text', () => {
    const onSearchChangeSpy = cy.spy().as('onSearchChangeSpy')
    cy.mount(
      <SearchFilter
        searchText="existing search"
        onSearchChange={onSearchChangeSpy}
        filterCategories={defaultFilterCategories}
        onFilterChange={() => {}}
      />
    )
    cy.get('.search-input').clear()
    cy.get('@onSearchChangeSpy').should('have.been.called')
  })

  it('handles special characters in search', () => {
    const onSearchChangeSpy = cy.spy().as('onSearchChangeSpy')
    cy.mount(
      <SearchFilter
        searchText=""
        onSearchChange={onSearchChangeSpy}
        filterCategories={defaultFilterCategories}
        onFilterChange={() => {}}
      />
    )
    cy.get('.search-input').type('test@#$%')
    cy.get('@onSearchChangeSpy').should('have.been.called')
  })

  it('handles emojis in search', () => {
    const onSearchChangeSpy = cy.spy().as('onSearchChangeSpy')
    cy.mount(
      <SearchFilter
        searchText=""
        onSearchChange={onSearchChangeSpy}
        filterCategories={defaultFilterCategories}
        onFilterChange={() => {}}
      />
    )
    cy.get('.search-input').type('🚀 rocket')
    cy.get('@onSearchChangeSpy').should('have.been.called')
  })

  it('handles switching all filters back to "all"', () => {
    const onFilterChangeSpy = cy.spy().as('onFilterChangeSpy')
    cy.mount(
      <SearchFilter
        searchText=""
        onSearchChange={() => {}}
        filterCategories={{
          priority: 'high',
          time: 'today',
          progress: 'in-progress'
        }}
        onFilterChange={onFilterChangeSpy}
      />
    )
    cy.get('#filter-priority').select('all')
    cy.get('#filter-time').select('all')
    cy.get('#filter-progress').select('all')
    cy.get('@onFilterChangeSpy').should('have.callCount', 3)
  })

  it('handles multiple rapid filter changes', () => {
    const onFilterChangeSpy = cy.spy().as('onFilterChangeSpy')
    cy.mount(
      <SearchFilter
        searchText=""
        onSearchChange={() => {}}
        filterCategories={defaultFilterCategories}
        onFilterChange={onFilterChangeSpy}
      />
    )
    cy.get('#filter-priority').select('high')
    cy.get('#filter-priority').select('low')
    cy.get('#filter-priority').select('medium')
    cy.get('@onFilterChangeSpy').should('have.callCount', 3)
  })

  it('handles long search text', () => {
    const longText = 'This is a very long search text that users might type when looking for something specific in their todos'
    cy.mount(
      <SearchFilter
        searchText={longText}
        onSearchChange={() => {}}
        filterCategories={defaultFilterCategories}
        onFilterChange={() => {}}
      />
    )
    cy.get('.search-input').should('have.value', longText)
  })

  it('maintains filter selections independently', () => {
    const onFilterChangeSpy = cy.spy().as('onFilterChangeSpy')
    cy.mount(
      <SearchFilter
        searchText=""
        onSearchChange={() => {}}
        filterCategories={defaultFilterCategories}
        onFilterChange={onFilterChangeSpy}
      />
    )
    // Change priority
    cy.get('#filter-priority').select('high')
    cy.get('@onFilterChangeSpy').should('have.been.calledWith', 'priority', 'high')
    cy.get('#filter-priority').should('have.value', 'high')
    // Other filters should remain "all"
    cy.get('#filter-time').should('have.value', 'all')
    cy.get('#filter-progress').should('have.value', 'all')
  })

  it('renders correct structure with search section and filter controls', () => {
    cy.mount(
      <SearchFilter
        searchText=""
        onSearchChange={() => {}}
        filterCategories={defaultFilterCategories}
        onFilterChange={() => {}}
      />
    )
    cy.get('.search-filter-section').should('exist')
    cy.get('.filter-controls').should('exist')
    cy.get('.filter-group').should('have.length', 3)
  })

  it('each filter has label and select properly associated', () => {
    cy.mount(
      <SearchFilter
        searchText=""
        onSearchChange={() => {}}
        filterCategories={defaultFilterCategories}
        onFilterChange={() => {}}
      />
    )
    cy.get('label[for="filter-priority"]').should('exist')
    cy.get('label[for="filter-time"]').should('exist')
    cy.get('label[for="filter-progress"]').should('exist')
  })

  it('handles all combinations of filter values', () => {
    const allCombinations = [
      { priority: 'high', time: 'today', progress: 'not-started' },
      { priority: 'medium', time: 'this-week', progress: 'in-progress' },
      { priority: 'low', time: 'later', progress: 'blocked' },
      { priority: 'all', time: 'all', progress: 'all' }
    ]

    allCombinations.forEach(combo => {
      cy.mount(
        <SearchFilter
          searchText=""
          onSearchChange={() => {}}
          filterCategories={combo}
          onFilterChange={() => {}}
        />
      )
      cy.get('#filter-priority').should('have.value', combo.priority)
      cy.get('#filter-time').should('have.value', combo.time)
      cy.get('#filter-progress').should('have.value', combo.progress)
    })
  })
})
