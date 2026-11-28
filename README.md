# Tariq Book Depot

Online store for Tariq Book Depot: a static Next.js site in `apps/storefront`, with Cash on Delivery orders sent to the shop on WhatsApp. Products are read from `Products/`.

Rules and architecture: see [CLAUDE.md](CLAUDE.md). The full setup and deployment guide will be added when the rebuild is finished.

## Run locally

Requires Node 22 (`.nvmrc`).

```sh
npm ci
npm run dev:storefront   # http://localhost:8000
```
