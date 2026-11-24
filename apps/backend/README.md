# Tariq Book Depot Medusa Backend

This workspace contains the Medusa.js v2 commerce backend. It owns products, regional PKR pricing, inventory, carts, promotions, shipping, payments, customers, and orders.

## Start

```powershell
Copy-Item ..\..\.env.example .env
npm install
npx medusa db:migrate
npx medusa exec ./src/scripts/seed-tariq-book-depot.ts
npm run dev
```

PostgreSQL and Docker Desktop must be running first. Medusa Admin is served at `http://localhost:9000/app`.
