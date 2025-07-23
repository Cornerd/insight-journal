# Insight Journal Architecture Documentation

## Overview

This directory contains the complete architecture documentation for the Insight Journal project, organized as a sharded architecture document structure for better maintainability and collaborative development.

## Document Structure

### Core Architecture Documents

1. **[Introduction](./introduction.md)** - Project overview and architectural context
2. **[Tech Stack](./tech-stack.md)** - Definitive technology selections and versions
3. **[High-Level Architecture](./high-level-architecture.md)** - System overview and architectural patterns
4. **[Data Models](./data-models.md)** - Core business entities and relationships
5. **[Components](./components.md)** - System components and their responsibilities
6. **[Source Tree](./source-tree.md)** - Project structure and organization

### Development Guidelines

7. **[Coding Standards](./coding-standards.md)** - Mandatory coding rules for AI and human developers
8. **[Testing Strategy](./testing-strategy.md)** - Comprehensive testing approach and standards
9. **[Error Handling](./error-handling.md)** - Error handling patterns and strategies

### Integration & APIs

10. **[External APIs](./external-apis.md)** - Third-party service integrations
11. **[REST API Spec](./rest-api-spec.md)** - Internal API specifications
12. **[Core Workflows](./core-workflows.md)** - Key system workflows and interactions

### Infrastructure

13. **[Database Schema](./database-schema.md)** - Data storage design
14. **[Infrastructure](./infrastructure.md)** - Deployment and infrastructure setup
15. **[Security](./security.md)** - Security requirements and patterns

### Performance & Optimization

16. **[Performance](./performance.md)** - Performance optimization guidelines
17. **[Frontend Architecture](./frontend-architecture.md)** - Frontend-specific architectural decisions

## Reading Order for Different Roles

### For AI Development Agents
**Must Read (Always Loaded):**
- [Coding Standards](./coding-standards.md)
- [Tech Stack](./tech-stack.md)
- [Source Tree](./source-tree.md)

**Context Dependent:**
- [Data Models](./data-models.md) - When working with data
- [Components](./components.md) - When implementing features
- [Testing Strategy](./testing-strategy.md) - When writing tests

### For Product Owners
1. [Introduction](./introduction.md)
2. [High-Level Architecture](./high-level-architecture.md)
3. [Core Workflows](./core-workflows.md)
4. [External APIs](./external-apis.md)

### For DevOps/Infrastructure
1. [Tech Stack](./tech-stack.md)
2. [Infrastructure](./infrastructure.md)
3. [Security](./security.md)
4. [Database Schema](./database-schema.md)

### For QA Engineers
1. [Testing Strategy](./testing-strategy.md)
2. [Error Handling](./error-handling.md)
3. [Core Workflows](./core-workflows.md)
4. [REST API Spec](./rest-api-spec.md)

## Document Maintenance

- **Version**: 2.0 (Sharded Architecture)
- **Last Updated**: 2025-07-22
- **Maintained By**: Architecture Team
- **Review Cycle**: Before each major release

## Usage Guidelines

1. **For Story Development**: Reference relevant sections based on story requirements
2. **For Code Reviews**: Use coding standards and architectural patterns as guidelines
3. **For New Team Members**: Start with Introduction → Tech Stack → High-Level Architecture
4. **For External Integrations**: Focus on External APIs and Security sections

## Change Management

When updating architecture documents:
1. Update the relevant sharded document
2. Update this index if structure changes
3. Notify affected team members
4. Update related story documentation if needed

---

*This architecture documentation follows the BMad framework for collaborative AI-driven development.*
