# API contract

The intended backend contract is the Medusa Store API plus:

- `GET /store/catalog/search`
- `GET /store/catalog/featured-hero`
- `GET /store/products/:handle/bundle-suggestions`

These endpoints must return calculated regional prices and linked book/stationery metadata. They are not represented as fake success responses in the current foundation.
