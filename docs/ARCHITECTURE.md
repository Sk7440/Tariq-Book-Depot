# Architecture

The monorepo separates `apps/storefront` (Next.js presentation) from `apps/backend` (Medusa commerce truth). The storefront currently uses a typed demo catalog to keep the UI runnable without pretending a backend exists. The integration seam is documented in `apps/backend/README.md`.
