# Technology Stack

## Overview

This is the **DEFINITIVE** technology selection for the Insight Journal project. All development must adhere to these exact versions and choices.

## Core Technology Stack

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| **Language** | TypeScript | 5.3.3 | Primary development language | Strong typing, excellent tooling, team expertise |
| **Runtime** | Node.js | 20.11.0 | JavaScript runtime | LTS version, stable performance, wide ecosystem |
| **Framework** | Next.js | 14.2.5 | React full-stack framework | App Router, SSR/SSG, API routes, Vercel optimization |
| **UI Library** | React | 18.2.0 | Component-based UI development | Stable version with extensive ecosystem |
| **Styling** | Tailwind CSS | 3.4.1 | Utility-first CSS framework | Rapid development, consistent design system |
| **Animation** | Framer Motion | 11.0.3 | Declarative animations | Smooth interactions, enhanced UX |
| **State Management** | Zustand | 4.5.0 | Lightweight global state | Simple, TypeScript-friendly, performant |
| **State Helper** | Immer | 10.0.3 | Immutable state updates | Simplifies complex state logic |

## AI Integration

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| **AI SDK** | OpenAI SDK | 4.28.0 | Official OpenAI client | Stability, TypeScript support, full feature access |
| **HTTP Client** | Axios | 1.6.7 | API request handling | Advanced features, interceptors, error handling |

## Editor & Content

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| **Markdown Editor** | @uiw/react-md-editor | 4.0.0 | Rich text editing | Feature-rich, React integration, Markdown support |

## Utilities

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| **Date Handling** | date-fns | 3.3.1 | Date manipulation | Lightweight, modular, immutable, TypeScript support |
| **Unique ID** | nanoid | 5.0.5 | ID generation | Small, fast, secure unique identifiers |
| **CSS Utilities** | clsx | 2.1.0 | Conditional class names | Simplifies Tailwind class combinations |
| **Tailwind Merge** | tailwind-merge | 2.2.1 | Intelligent class merging | Prevents style conflicts |

## Development Tools

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| **Linting** | ESLint | 8.56.0 | Code quality checking | Industry standard, extensive rules |
| **Formatting** | Prettier | 3.2.5 | Code formatting | Consistent style, team collaboration |
| **Git Hooks** | Husky | 9.0.10 | Pre-commit automation | Quality gates, automated checks |
| **Staged Files** | lint-staged | 15.2.2 | Efficient linting | Only check modified files |
| **Testing** | Jest | 29.7.0 | JavaScript testing | Mature, stable, React ecosystem standard |
| **React Testing** | Testing Library | 14.2.1 | Component testing | Best practices, user behavior focus |

## Cloud Infrastructure

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| **Hosting** | Vercel | - | Deployment platform | Native Next.js support, automatic optimizations |
| **Functions** | Vercel Functions | - | Serverless functions | Next.js API Routes runtime |
| **Config** | Vercel Edge Config | - | Configuration management | Secure environment variable management |

## Data Storage

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| **Storage (MVP)** | localStorage | - | Local data persistence | Zero-config, rapid prototyping, browser native |
| **Storage (Future)** | Supabase | - | Cloud database | PostgreSQL, real-time, authentication services |

## Future Considerations

### Internationalization
- **next-intl** (latest stable) - Next.js 14 App Router i18n support

### Theme Management
- **next-themes** (latest stable) - Dark mode and theme switching

### Performance Monitoring
- **Vercel Analytics** - Performance metrics and monitoring
- **@next/bundle-analyzer** - Bundle size analysis

## Version Management

### Node.js Version
- **Required**: Node.js 20.11.0 (LTS)
- **Package Manager**: npm (default), yarn, or pnpm supported
- **Engine Requirement**: Specified in package.json

### Dependency Updates
- **Major Updates**: Require architecture review
- **Minor Updates**: Allowed with testing
- **Patch Updates**: Automatic via dependabot
- **Security Updates**: Immediate priority

## Environment Requirements

### Development
- Node.js 20.11.0+
- npm 10.0.0+
- Git 2.40.0+
- VS Code (recommended) with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - Prettier - Code formatter
  - ESLint

### Production
- Vercel platform
- Node.js 20.x runtime
- Environment variables configured
- HTTPS enforced

## Critical Dependencies

### Must Not Change Without Architecture Review
- Next.js (affects routing, rendering, deployment)
- React (affects entire component system)
- TypeScript (affects type safety across project)
- Tailwind CSS (affects entire design system)

### Safe to Update
- Utility libraries (date-fns, nanoid, clsx)
- Development tools (ESLint, Prettier, Jest)
- Testing libraries

## Compatibility Matrix

| Technology | Minimum Version | Maximum Version | Notes |
|------------|----------------|-----------------|-------|
| Node.js | 20.11.0 | 20.x.x | LTS only |
| Next.js | 14.2.5 | 14.x.x | App Router required |
| React | 18.2.0 | 18.x.x | Concurrent features |
| TypeScript | 5.3.3 | 5.x.x | Latest stable |

---

**Last Updated**: 2025-07-22  
**Next Review**: Before Epic 2 implementation  
**Owner**: Architecture Team
