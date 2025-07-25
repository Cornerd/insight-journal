# Technology Stack

## Overview

This is the **DEFINITIVE** technology selection for the Insight Journal project. All development must adhere to these exact versions and choices.

## Core Technology Stack

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| **Language** | TypeScript | ^5 | Primary development language | Strong typing, excellent tooling, team expertise |
| **Runtime** | Node.js | >=18.18.0 | JavaScript runtime | LTS version, stable performance, wide ecosystem |
| **Framework** | Next.js | 15.4.2 | React full-stack framework | Latest stable, App Router, SSR/SSG, API routes, enhanced performance |
| **UI Library** | React | 19.1.0 | Component-based UI development | Latest stable with React 19 features and improvements |
| **Styling** | Tailwind CSS | ^4 | Utility-first CSS framework | Latest version with enhanced performance and new features |
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
| Node.js | 18.18.0 | 20.x.x | LTS versions only |
| Next.js | 15.4.2 | 15.x.x | App Router, React 19 support |
| React | 19.1.0 | 19.x.x | Latest stable with new features |
| TypeScript | 5.0.0 | 5.x.x | Latest stable |
| Tailwind CSS | 4.0.0 | 4.x.x | Latest with enhanced performance |

## Next.js 15 New Features

### Performance Improvements
- **Turbopack**: Enhanced bundler for faster development builds
- **Improved Tree Shaking**: Better dead code elimination
- **Optimized Bundle Splitting**: Smaller bundle sizes

### React 19 Integration
- **React Compiler**: Automatic optimization of React components
- **Server Components**: Enhanced server-side rendering capabilities
- **Concurrent Features**: Better handling of async operations

### Developer Experience
- **Enhanced Error Messages**: More detailed error reporting
- **Improved Hot Reload**: Faster development iteration
- **Better TypeScript Support**: Enhanced type checking and inference

---

**Last Updated**: 2025-07-23
**Next Review**: Before Epic 2 implementation
**Owner**: Architecture Team
**Major Changes**: Upgraded Next.js to 15.4.2, React to 19.1.0, Tailwind CSS to v4
