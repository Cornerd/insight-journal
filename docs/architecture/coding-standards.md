# Coding Standards

## Overview

These standards are **MANDATORY** for all AI agents and human developers. This document contains only critical rules needed to prevent bad code and ensure consistency.

## Core Standards

### Languages & Runtimes
- **TypeScript 5.3.3**: All new code must be TypeScript
- **Node.js 20.11.0**: LTS version for all environments
- **Strict Mode**: TypeScript strict mode enabled
- **ES2022**: Target ES2022 for modern features

### Style & Linting
- **ESLint**: Use project configuration (.eslintrc.json)
- **Prettier**: Auto-format all code before commit
- **Husky**: Pre-commit hooks enforce linting
- **Import Order**: Use absolute imports with `@/` alias

### Test Organization
- **Location**: `tests/unit/` for unit tests, `tests/integration/` for integration
- **Naming**: `ComponentName.test.tsx` for components, `serviceName.test.ts` for services
- **Coverage**: Minimum 80% for new code

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| **Components** | PascalCase | `JournalEditor`, `AIAnalysisCard` |
| **Files** | kebab-case | `journal-editor.tsx`, `ai-analysis.ts` |
| **Variables** | camelCase | `journalEntry`, `isLoading` |
| **Constants** | SCREAMING_SNAKE_CASE | `API_ENDPOINTS`, `DEFAULT_CONFIG` |
| **Types/Interfaces** | PascalCase | `JournalEntry`, `AIAnalysis` |
| **Hooks** | camelCase with `use` prefix | `useJournalEntries`, `useAIAnalysis` |

## Critical Rules

### 🚫 Never Do This
- **Never use `console.log` in production code** - Use proper logging service
- **Never hardcode API keys or secrets** - Use environment variables only
- **Never use `any` type** - Use proper TypeScript types or `unknown`
- **Never commit `.env.local`** - Only commit `.env.example`
- **Never use direct DOM manipulation** - Use React patterns
- **Never ignore TypeScript errors** - Fix or properly suppress with explanation

### ✅ Always Do This
- **Always use TypeScript strict mode** - No implicit any, null checks
- **Always validate external inputs** - API requests, user inputs, environment variables
- **Always use error boundaries** - Wrap components that might fail
- **Always use proper loading states** - Show feedback during async operations
- **Always use semantic HTML** - Proper accessibility and SEO
- **Always use Tailwind classes** - No custom CSS unless absolutely necessary

## File Structure Rules

### Component Files
```typescript
// ComponentName.tsx structure
import React from 'react';
import { ComponentProps } from './types';

interface Props {
  // Props definition
}

export function ComponentName({ prop1, prop2 }: Props) {
  // Component implementation
}

export default ComponentName;
```

### Service Files
```typescript
// serviceName.ts structure
import { ServiceConfig } from '@/types';

export class ServiceName {
  // Service implementation
}

export const serviceInstance = new ServiceName();
```

### Hook Files
```typescript
// useHookName.ts structure
import { useState, useEffect } from 'react';

export function useHookName() {
  // Hook implementation
  return { data, loading, error };
}
```

## TypeScript Specific Guidelines

### Type Definitions
- **Interfaces for object shapes**: `interface User { name: string; }`
- **Types for unions/primitives**: `type Status = 'loading' | 'success' | 'error'`
- **Generic constraints**: Use `extends` for type safety
- **Utility types**: Leverage `Partial`, `Pick`, `Omit` when appropriate

### Error Handling
```typescript
// Proper error handling pattern
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error) {
  logger.error('Operation failed', { error, context });
  return { success: false, error: error.message };
}
```

## React Specific Guidelines

### Component Patterns
- **Functional components only** - No class components
- **Custom hooks for logic** - Extract reusable logic
- **Props destructuring** - Destructure props in function signature
- **Default props via destructuring** - `{ prop = defaultValue }`

### State Management
- **Local state**: `useState` for component-specific state
- **Global state**: Zustand store for shared state
- **Server state**: React Query or SWR for API data
- **Form state**: React Hook Form for complex forms

### Performance
- **React.memo** - For expensive components
- **useCallback** - For functions passed to children
- **useMemo** - For expensive calculations
- **Lazy loading** - For large components

## API Integration Rules

### Error Handling
```typescript
// API call pattern
export async function apiCall<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }
    return await response.json();
  } catch (error) {
    logger.error('API call failed', { endpoint, error });
    throw error;
  }
}
```

### Type Safety
- **Define response types** - Never use `any` for API responses
- **Validate responses** - Use runtime validation for external data
- **Handle loading states** - Always show loading indicators
- **Handle error states** - Provide user-friendly error messages

## Security Rules

### Input Validation
- **Validate all inputs** - User inputs, API responses, environment variables
- **Sanitize HTML** - Use DOMPurify for user-generated content
- **Escape SQL** - Use parameterized queries (when applicable)

### Authentication
- **Never store tokens in localStorage** - Use httpOnly cookies or secure storage
- **Always validate tokens** - Check expiration and signature
- **Use HTTPS only** - No HTTP in production

## Testing Rules

### Unit Tests
- **Test public interfaces** - Not implementation details
- **Mock external dependencies** - Use Jest mocks for APIs, services
- **Use descriptive test names** - `should return error when API fails`
- **Follow AAA pattern** - Arrange, Act, Assert

### Integration Tests
- **Test user workflows** - End-to-end user interactions
- **Use Testing Library** - Query by user-visible elements
- **Mock external services** - Use MSW for API mocking

## Import Rules

### Import Order
```typescript
// 1. React and external libraries
import React from 'react';
import { NextPage } from 'next';

// 2. Internal utilities and types
import { ApiResponse } from '@/types';
import { logger } from '@/lib/logger';

// 3. Components
import { Button } from '@/components/ui';
import { JournalEditor } from '@/features/journal';

// 4. Relative imports
import './styles.css';
```

### Path Aliases
- **Use `@/` for src root** - `@/components`, `@/lib`, `@/types`
- **Avoid relative imports** - Use absolute paths for better maintainability
- **Group by feature** - Keep related files together

## Performance Rules

### Bundle Size
- **Tree shake imports** - Import only what you need
- **Lazy load routes** - Use Next.js dynamic imports
- **Optimize images** - Use Next.js Image component
- **Minimize dependencies** - Audit bundle size regularly

### Runtime Performance
- **Avoid unnecessary re-renders** - Use React.memo, useCallback, useMemo
- **Optimize state updates** - Batch updates when possible
- **Use proper keys** - Stable keys for list items
- **Debounce expensive operations** - User input, API calls

---

**Last Updated**: 2025-07-22  
**Enforcement**: Automated via ESLint, Prettier, and pre-commit hooks  
**Violations**: Block deployment and require immediate fix
