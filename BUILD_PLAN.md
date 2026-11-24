# Tariq Book Depot build plan

## Current scope

This repository starts as an architecture/specification workspace. Milestone 0 establishes a runnable monorepo contract and a storefront foundation with demo data. Medusa, PostgreSQL, payment credentials, real catalog assets, and business policies are external dependencies and are intentionally not fabricated.

## Sequence

1. Foundation: workspace scripts, environment templates, Docker PostgreSQL, design-system docs.
2. Storefront: Next.js App Router shell, editorial tokens, accessible navigation, catalog/product routes, demo cart.
3. Backend integration seam: Medusa environment contract, domain module boundaries, seed/data documentation.
4. Commerce integration: connect storefront reads and Server Actions to a configured Medusa instance.
5. Verification: typecheck, lint, production build, then API and Playwright coverage once the backend is available.

## Acceptance evidence

Every milestone is recorded in `IMPLEMENTATION_STATUS.md`. Features depending on credentials or a running Medusa/PostgreSQL service are marked as blocked rather than represented as successful.
