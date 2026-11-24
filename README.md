# Tariq Book Depot

Editorial bookstore and stationery storefront foundation for a Medusa.js v2 commerce backend.

## Prerequisites

- Node.js 22 LTS (the current machine reports Node `v24.13.1`, which is within the `<25` project constraint but is not the documented target)
- npm
- Docker Desktop for PostgreSQL

## Local setup (PowerShell)

```powershell
Copy-Item .env.example .env
docker compose up -d postgres
npm install
npm run dev:storefront
```

Open `http://localhost:8000`. The Medusa Admin URL will be `http://localhost:9000/app` after the backend milestone is installed and configured.

## Current limitation

The repository currently contains a runnable storefront foundation with clearly labeled demonstration products. Medusa, real inventory/prices, customer authentication, payments, shipping rates, admin operations, and order completion require a configured backend and business credentials. See `IMPLEMENTATION_STATUS.md`.
