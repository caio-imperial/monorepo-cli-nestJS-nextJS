# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS CLI generator that creates complete CRUD modules with advanced filtering capabilities. The CLI generates Controller → Service → Repository architecture with DTOs, pagination, and advanced filtering systems based on Prisma schema models.

## Core Commands

### CLI Usage
```bash
# Generate a basic module
node packages/cli/cli.js make <model-name>

# Generate a full CRUD module with all endpoints
node packages/cli/cli.js make <model-name> --crud

# Interactive mode
node packages/cli/cli.js interactive

# Database commands
node packages/cli/cli.js db
```

### Development Commands
```bash
# Install dependencies
pnpm install

# Link CLI globally for testing
cd packages/cli && pnpm link --global

# Unlink CLI
cd packages/cli && pnpm unlink --global
```

## Architecture

### Monorepo Structure
- `packages/cli/` - Main CLI package with source code
- `packages/cli/src/templates/` - Handlebars templates for code generation
- `packages/cli/src/utils/` - Utility modules (config, prisma, template, string, fs)
- `packages/cli/src/commands/` - CLI command definitions
- `prisma/` - Prisma schema and database configuration
- `examples/` - Example generated code

### Template System
The CLI uses Handlebars templates to generate NestJS modules:
- `controller.hbs` - REST API controllers with pagination and filtering
- `service.hbs` - Service layer with business logic
- `repository.hbs` - Data access layer with Prisma integration
- `dto.hbs` - Data Transfer Objects with class-validator
- `module.hbs` - NestJS module definitions
- `filter.types.hbs` - TypeScript interfaces for filtering system
- `filter.utils.hbs` - Advanced filtering utility class

### Configuration
The CLI requires a `cli.config.json` file in the project root:
```json
{
  "basePath": "src",
  "templatesPath": "packages/cli/src/templates",
  "prismaPath": "prisma"
}
```

### Generated Architecture
Each generated module follows this pattern:
```
src/
├── <module-name>/
│   ├── <module-name>.controller.ts
│   ├── <module-name>.service.ts
│   ├── <module-name>.repository.ts
│   ├── <module-name>.module.ts
│   └── dto/
│       ├── create-<module-name>.dto.ts
│       ├── update-<module-name>.dto.ts
│       └── <module-name>-response.dto.ts
└── common/
    ├── types/
    │   ├── pagination.ts
    │   └── filter.types.ts
    └── utils/
        └── filter.utils.ts
```

## Advanced Features

### Filtering System
The CLI generates an advanced filtering system supporting Prisma operators:
- Field-based filtering with operators (`name_contains`, `age_gte`, `createdAt_lte`)
- Type-safe filter configurations automatically generated from Prisma schema
- Support for string, number, boolean, and date field types
- Automatic type conversion and validation

### Pagination
All list endpoints include mandatory pagination with metadata:
- Page-based pagination with configurable limits
- Pagination metadata (total pages, has next/prev, etc.)
- Integrated with filtering system

### Query Parameter Support
Controllers support dynamic query parameters:
- `?page=1&limit=10` - Pagination
- `?sort=field:desc` - Sorting
- `?field_operator=value` - Advanced filtering (e.g., `name_contains=john`)

## Key Utilities

### Prisma Integration (`prisma-utils.js`)
- Extracts model definitions and field types from schema.prisma
- Maps Prisma types to TypeScript types
- Provides both original Prisma types and TypeScript equivalents for filtering

### Template System (`template-utils.js`)
- Handlebars helpers for dynamic content generation
- `generateFilterConfig` helper creates field configurations automatically
- Import optimization for DTOs based on field types

### String Utilities (`string-utils.js`)
- Case conversion (camelCase, PascalCase, kebab-case)
- Pluralization and naming conventions

## Development Notes

### Template Development
- Templates are in `packages/cli/src/templates/`
- Use `{{{helper}}}` (triple braces) for unescaped HTML output
- Field information includes both `type` (TypeScript) and `prismaType` (original Prisma type)

### Adding New Features
1. Create/modify templates in `src/templates/`
2. Add utility functions to appropriate utils files
3. Register new Handlebars helpers in `template-utils.js`
4. Update the main generation logic in `index.js`

### Testing Generated Code
Generated code assumes:
- NestJS framework setup
- Prisma client configuration
- Class-validator for DTO validation
- Proper module imports and dependency injection