Tasks for Collections + Filters

- Add `Collection` model and `ProductCollection` join model to `prisma/schema.prisma`.
- Run `npx prisma migrate dev --name add-collections`.
- Update `prisma/seed.ts` to create example collections and link to existing products.
- Create API routes under `app/api/collections` for CRUD and `app/api/products` filter support.
- Add admin UI at `app/admin/collections` to create/edit/delete collections and assign products.
- Add filter UI to `app/products` to filter by collection, size, category, and search.
