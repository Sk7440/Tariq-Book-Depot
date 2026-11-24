# Tariq Book Depot build plan

## Current scope

This repository remediates an existing storefront foundation into a live Medusa commerce monorepo. Demonstration products are not valid commerce implementation and must be removed when Medusa APIs are configured.

## Sequence

1. Foundation: workspace scripts, environment templates, Docker PostgreSQL, design-system docs.
2. Storefront: Next.js App Router shell, editorial tokens, accessible navigation, catalog/product routes, demo cart.
3. Backend integration seam: Medusa environment contract, domain module boundaries, seed/data documentation.
4. Commerce integration: connect storefront reads and Server Actions to a configured Medusa instance.
5. Verification: typecheck, lint, production build, then API and Playwright coverage once the backend is available.

## Acceptance evidence

Every milestone is recorded in `IMPLEMENTATION_STATUS.md`. Features depending on credentials or a running Medusa/PostgreSQL service are marked as blocked rather than represented as successful.
