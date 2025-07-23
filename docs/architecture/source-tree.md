# Source Tree Structure

## Overview

This document defines the **definitive** project folder structure following Feature-Sliced Design principles, Next.js 14 App Router conventions, and TypeScript best practices.

## Project Root Structure

```
insight-journal/
├── .bmad-core/                 # BMad framework configuration
│   ├── agents/                 # AI agent definitions
│   ├── tasks/                  # Executable workflows
│   ├── templates/              # Document templates
│   ├── checklists/             # Quality checklists
│   └── core-config.yaml        # Core configuration
├── .ai/                        # AI development logs
│   └── debug-log.md            # Development debug log
├── docs/                       # Project documentation
│   ├── architecture/           # Sharded architecture docs
│   ├── stories/                # User stories
│   ├── prd.md                  # Product requirements
│   └── README.md               # Project overview
├── public/                     # Static assets
│   ├── images/                 # Image assets
│   ├── icons/                  # Icon files
│   └── favicons/               # Favicon variants
├── src/                        # Source code (main application)
├── tests/                      # Test files
├── .env.example                # Environment template
├── .env.local                  # Local environment (not tracked)
├── .gitignore                  # Git ignore rules
├── .eslintrc.json              # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── next.config.mjs             # Next.js configuration
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## Source Code Structure (`src/`)

```
src/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Future: Authentication routes
│   │   └── login/
│   │       └── page.tsx
│   ├── api/                    # API Routes (Serverless Functions)
│   │   ├── ai/
│   │   │   └── analyze/
│   │   │       └── route.ts    # POST /api/ai/analyze
│   │   └── config/
│   │       └── route.ts        # GET/POST /api/config
│   ├── journal/                # Journal routes
│   │   ├── [id]/
│   │   │   ├── page.tsx        # Individual entry view/edit
│   │   │   └── loading.tsx     # Loading state
│   │   ├── page.tsx            # Journal list/dashboard
│   │   └── layout.tsx          # Journal-specific layout
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── not-found.tsx           # 404 page
│   ├── error.tsx               # Error boundary
│   └── loading.tsx             # Global loading
├── features/                   # Business features (Feature-Sliced Design)
│   ├── journal/
│   │   ├── components/         # Journal-specific UI
│   │   │   ├── JournalCard.tsx
│   │   │   ├── JournalList.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── hooks/              # Journal hooks
│   │   │   ├── useJournalEntries.ts
│   │   │   └── useAutoSave.ts
│   │   ├── services/           # Journal business logic
│   │   │   ├── journalService.ts
│   │   │   └── storageService.ts
│   │   ├── types/              # Journal types
│   │   │   └── journal.types.ts
│   │   └── index.ts            # Feature exports
│   ├── ai-insights/
│   │   ├── components/         # AI analysis UI
│   │   │   ├── AIAnalysisCard.tsx
│   │   │   ├── EmotionTags.tsx
│   │   │   └── SuggestionsList.tsx
│   │   ├── hooks/              # AI hooks
│   │   │   ├── useAIAnalysis.ts
│   │   │   └── useStreamingResponse.ts
│   │   ├── services/           # AI services
│   │   │   ├── openaiService.ts
│   │   │   └── promptTemplates.ts
│   │   ├── types/              # AI types
│   │   │   └── analysis.types.ts
│   │   └── index.ts
│   └── editor/
│       ├── components/         # Editor components
│       │   ├── MarkdownEditor.tsx
│       │   ├── EditorToolbar.tsx
│       │   └── WordCount.tsx
│       ├── hooks/              # Editor hooks
│       │   └── useEditorContent.ts
│       ├── utils/              # Editor utilities
│       │   └── markdownHelpers.ts
│       └── index.ts
├── shared/                     # Shared utilities and components
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Basic UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Toast.tsx
│   │   ├── layout/             # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Container.tsx
│   │   ├── feedback/           # User feedback components
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   └── SuccessMessage.tsx
│   │   └── icons/              # Icon components
│   ├── hooks/                  # Generic hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   └── useTheme.ts
│   ├── lib/                    # Utility functions
│   │   ├── api/                # API utilities
│   │   │   ├── client.ts       # Axios instance
│   │   │   ├── endpoints.ts    # API endpoints
│   │   │   └── errors.ts       # Error handling
│   │   ├── utils/              # General utilities
│   │   │   ├── date.ts         # Date helpers
│   │   │   ├── storage.ts      # Storage utilities
│   │   │   └── validation.ts   # Validation helpers
│   │   └── constants.ts        # Global constants
│   ├── store/                  # Global state (Zustand)
│   │   ├── journalStore.ts     # Journal state
│   │   ├── uiStore.ts          # UI state
│   │   └── configStore.ts      # App configuration
│   └── types/                  # Global types
│       ├── global.d.ts         # Global declarations
│       └── api.types.ts        # API types
├── entities/                   # Data models/schemas
│   ├── journal.ts              # Journal entry model
│   └── aiAnalysis.ts           # AI analysis model
├── config/                     # Application configuration
│   ├── site.ts                 # Site configuration
│   ├── env.ts                  # Environment handling
│   └── openai.ts               # OpenAI configuration
└── middleware.ts               # Next.js middleware
```

## Test Structure (`tests/`)

```
tests/
├── unit/                       # Unit tests
│   ├── features/
│   │   ├── journal/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── services/
│   │   ├── ai-insights/
│   │   └── editor/
│   ├── shared/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── lib/
│   └── entities/
├── integration/                # Integration tests
│   ├── api/
│   ├── workflows/
│   └── features/
├── e2e/                        # End-to-end tests
│   ├── journal/
│   └── ai-analysis/
├── fixtures/                   # Test data
├── mocks/                      # Test mocks
└── setup.ts                    # Test setup
```

## File Naming Conventions

### Components
- **React Components**: PascalCase with `.tsx` extension
  - `JournalEditor.tsx`, `AIAnalysisCard.tsx`
- **Component Tests**: Same name with `.test.tsx`
  - `JournalEditor.test.tsx`

### Services and Utilities
- **Services**: camelCase with `.ts` extension
  - `journalService.ts`, `openaiService.ts`
- **Utilities**: camelCase with `.ts` extension
  - `dateHelpers.ts`, `storageUtils.ts`

### Types and Interfaces
- **Type Files**: camelCase with `.types.ts` extension
  - `journal.types.ts`, `api.types.ts`
- **Global Types**: descriptive names
  - `global.d.ts`, `environment.d.ts`

### Hooks
- **Custom Hooks**: camelCase starting with `use`
  - `useJournalEntries.ts`, `useAIAnalysis.ts`

## Import Path Rules

### Absolute Imports (Preferred)
```typescript
// Use @ alias for src root
import { Button } from '@/shared/components/ui';
import { JournalEntry } from '@/entities/journal';
import { useJournalEntries } from '@/features/journal/hooks';
```

### Relative Imports (Limited Use)
```typescript
// Only for files in same directory or immediate subdirectories
import { JournalCard } from './JournalCard';
import { types } from '../types';
```

## Feature Organization Rules

### Feature Boundaries
- **Self-contained**: Each feature should be independently deployable
- **Clear interfaces**: Features communicate through well-defined APIs
- **Minimal coupling**: Avoid direct imports between features

### Shared Code
- **UI Components**: Reusable across features
- **Utilities**: Generic helper functions
- **Types**: Shared data structures
- **Stores**: Global application state

## API Route Organization

### Route Structure
```
src/app/api/
├── ai/
│   ├── analyze/route.ts        # POST /api/ai/analyze
│   └── test/route.ts           # POST /api/ai/test
├── config/
│   └── route.ts                # GET /api/config
└── health/
    └── route.ts                # GET /api/health
```

### Route File Pattern
```typescript
// route.ts structure
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // GET handler
}

export async function POST(request: NextRequest) {
  // POST handler
}
```

## Configuration Files Location

### Root Level
- **Next.js**: `next.config.mjs`
- **TypeScript**: `tsconfig.json`
- **Tailwind**: `tailwind.config.js`
- **ESLint**: `.eslintrc.json`
- **Prettier**: `.prettierrc`

### Source Level
- **Environment**: `src/config/env.ts`
- **Site Config**: `src/config/site.ts`
- **API Config**: `src/config/openai.ts`

## Asset Organization

### Public Assets
```
public/
├── images/
│   ├── hero/                   # Landing page images
│   ├── icons/                  # App icons
│   └── illustrations/          # UI illustrations
├── favicons/
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   └── manifest.json
└── robots.txt
```

### Component Assets
- **Co-located**: Keep component-specific assets near components
- **Shared**: Common assets in `public/` directory

---

**Last Updated**: 2025-07-22  
**Enforcement**: Automated via ESLint import rules  
**Changes**: Require architecture team approval
