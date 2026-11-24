# Testing

Run the storefront checks from the repository root:

```powershell
npm run typecheck
npm run lint
npm run build:storefront
```

Backend integration and Playwright checkout tests require a running Medusa service and isolated test database; they are not marked as passed until those dependencies exist.
