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

## Product catalog and current limitation

The storefront catalog is populated from the product descriptions and photographs in `Products/`. It currently contains 10 stationery products, 36 product images, and category pages for paper, erasers, pencils, scales, and sharpeners. Product details, galleries, catalog search, and category browsing use this supplied source material.

The Medusa.js v2 backend is not configured in this workspace. The supplied PKR prices are displayed in the catalog, but authoritative prices, inventory, shipping, order totals, payment, and order completion must come from Medusa before checkout can be enabled. See `IMPLEMENTATION_STATUS.md`.

Set `NEXT_PUBLIC_SITE_URL` to the deployed storefront origin so product Open Graph image URLs resolve correctly.
