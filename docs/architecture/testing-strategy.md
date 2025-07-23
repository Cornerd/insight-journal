# Testing Strategy and Standards

## Overview

This document defines the comprehensive testing approach for the Insight Journal application, including testing philosophy, standards, and specific requirements for AI agents and human developers.

## Testing Philosophy

### Approach
**Test-Driven Development (TDD)** for critical business logic, with **Test-After** approach for UI components and integration scenarios.

### Coverage Goals
- **Unit Tests**: 80% minimum coverage
- **Integration Tests**: 70% coverage for critical workflows
- **E2E Tests**: 90% coverage for user journeys

### Test Pyramid Distribution
- **70% Unit Tests**: Fast, isolated, comprehensive
- **20% Integration Tests**: Component interactions, API integration
- **10% E2E Tests**: Critical user workflows

## Test Types and Organization

### Unit Tests

**Framework**: Jest 29.7.0  
**File Convention**: `ComponentName.test.tsx` for components, `serviceName.test.ts` for services  
**Location**: `tests/unit/` mirroring source structure  
**Mocking Library**: Jest built-in mocks + MSW for API mocking  
**Coverage Requirement**: 80% minimum for new code

#### AI Agent Requirements
- Generate tests for all public methods and components
- Cover edge cases and error conditions
- Follow AAA pattern (Arrange, Act, Assert)
- Mock all external dependencies
- Test TypeScript types and interfaces

#### Unit Test Structure
```typescript
// Example: JournalEditor.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { JournalEditor } from '@/features/editor/components/JournalEditor';

describe('JournalEditor', () => {
  it('should render markdown editor with placeholder', () => {
    // Arrange
    const mockOnChange = jest.fn();
    
    // Act
    render(<JournalEditor value="" onChange={mockOnChange} />);
    
    // Assert
    expect(screen.getByPlaceholderText(/write your thoughts/i)).toBeInTheDocument();
  });

  it('should call onChange when content is modified', () => {
    // Arrange
    const mockOnChange = jest.fn();
    render(<JournalEditor value="" onChange={mockOnChange} />);
    
    // Act
    const editor = screen.getByRole('textbox');
    fireEvent.change(editor, { target: { value: 'New content' } });
    
    // Assert
    expect(mockOnChange).toHaveBeenCalledWith('New content');
  });
});
```

### Integration Tests

**Scope**: Feature-level integration, API route testing, external service integration  
**Location**: `tests/integration/`  
**Test Infrastructure**:
- **Database**: In-memory storage for localStorage simulation
- **External APIs**: MSW (Mock Service Worker) for OpenAI API
- **File System**: Mock file operations

#### Integration Test Categories

1. **Feature Integration**
   - Journal creation → AI analysis → storage workflow
   - User authentication → data access workflow
   - Error handling across component boundaries

2. **API Route Testing**
   - `/api/ai/analyze` endpoint with various inputs
   - Error handling for invalid requests
   - Rate limiting behavior

3. **External Service Integration**
   - OpenAI API integration with real/mock responses
   - Error handling for service failures
   - Retry logic validation

#### Example Integration Test
```typescript
// tests/integration/journal-workflow.test.ts
import { createJournalEntry, analyzeEntry } from '@/features/journal';
import { setupMockOpenAI } from '../mocks/openai';

describe('Journal Workflow Integration', () => {
  beforeEach(() => {
    setupMockOpenAI();
  });

  it('should create entry and generate AI analysis', async () => {
    // Arrange
    const entryContent = 'Today was a great day...';
    
    // Act
    const entry = await createJournalEntry(entryContent);
    const analysis = await analyzeEntry(entry.id);
    
    // Assert
    expect(entry).toHaveProperty('id');
    expect(analysis).toHaveProperty('summary');
    expect(analysis.emotions).toHaveLength.greaterThan(0);
  });
});
```

### End-to-End Tests

**Framework**: Playwright (recommended) or Cypress  
**Scope**: Complete user workflows from browser perspective  
**Environment**: Staging environment with test data  
**Test Data**: Automated test data generation and cleanup

#### E2E Test Scenarios

1. **Core User Journey**
   - User visits app → creates account → writes journal entry → views AI analysis
   - User edits existing entry → updates AI analysis → saves changes
   - User deletes entry → confirms deletion → verifies removal

2. **Error Scenarios**
   - Network failure during AI analysis
   - Invalid API key configuration
   - Browser storage limitations

3. **Cross-browser Testing**
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers (iOS Safari, Android Chrome)

#### Example E2E Test
```typescript
// tests/e2e/journal-creation.spec.ts
import { test, expect } from '@playwright/test';

test('user can create and analyze journal entry', async ({ page }) => {
  // Navigate to app
  await page.goto('/');
  await page.click('text=Start Journaling');

  // Create journal entry
  await page.fill('[data-testid=journal-editor]', 'Today I felt really happy...');
  await page.click('text=Save');

  // Wait for AI analysis
  await expect(page.locator('[data-testid=ai-analysis]')).toBeVisible();
  await expect(page.locator('text=Summary')).toBeVisible();
  await expect(page.locator('[data-testid=emotion-tags]')).toBeVisible();
});
```

## Test Data Management

### Strategy
**Factory Pattern** with **Fixtures** for consistent test data generation

### Fixtures
**Location**: `tests/fixtures/`  
**Format**: JSON files with sample data  
**Usage**: Import and use in tests for consistent scenarios

### Factories
**Location**: `tests/factories/`  
**Purpose**: Generate test data programmatically  
**Libraries**: Factory-bot pattern implementation

#### Example Factory
```typescript
// tests/factories/journalEntryFactory.ts
import { JournalEntry } from '@/entities/journal';
import { nanoid } from 'nanoid';

export function createJournalEntry(overrides: Partial<JournalEntry> = {}): JournalEntry {
  return {
    id: nanoid(),
    content: 'Sample journal content...',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
}
```

### Cleanup Strategy
- **Unit Tests**: Automatic cleanup with Jest afterEach
- **Integration Tests**: Database/storage reset between tests
- **E2E Tests**: Test data isolation with unique identifiers

## Continuous Testing

### CI Integration
**Platform**: GitHub Actions (or equivalent)  
**Triggers**: Pull requests, main branch pushes  
**Stages**: Lint → Unit Tests → Integration Tests → E2E Tests

#### CI Pipeline Configuration
```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage

  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run test:e2e
```

### Performance Tests
**Tool**: Lighthouse CI for performance regression testing  
**Metrics**: Core Web Vitals, bundle size, load times  
**Thresholds**: LCP < 2.5s, FID < 100ms, CLS < 0.1

### Security Tests
**SAST Tool**: ESLint security plugins, Snyk  
**DAST Tool**: OWASP ZAP for deployed applications  
**Dependency Scanning**: npm audit, Dependabot

## Testing Tools and Configuration

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Testing Library Setup
```typescript
// tests/setup.ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Mock Service Worker Setup
```typescript
// tests/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.post('/api/ai/analyze', (req, res, ctx) => {
    return res(
      ctx.json({
        summary: 'Mock AI summary',
        sentiment: 'positive',
        emotions: [{ name: 'joy', intensity: 0.8 }]
      })
    );
  })
];
```

## Quality Gates

### Pre-commit Hooks
- **Linting**: ESLint must pass
- **Type Checking**: TypeScript compilation must succeed
- **Unit Tests**: All tests must pass
- **Coverage**: Must maintain minimum coverage

### Pull Request Requirements
- **All Tests Pass**: Unit, integration, and E2E tests
- **Coverage Maintained**: No decrease in overall coverage
- **Performance**: No significant performance regression
- **Security**: No new security vulnerabilities

### Deployment Gates
- **Full Test Suite**: All tests must pass in CI
- **Performance Budget**: Core Web Vitals within thresholds
- **Security Scan**: No high-severity vulnerabilities
- **Manual QA**: Critical paths manually verified

---

**Last Updated**: 2025-07-22  
**Test Framework Versions**: Jest 29.7.0, Testing Library 14.2.1  
**Next Review**: Quarterly or when adding new testing tools
