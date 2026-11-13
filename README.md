# Jewellery E-commerce

A React and TypeScript storefront with Supabase integration, product imagery, database schema, and server-side API handlers for payment and email-related operations.

## Features represented in source

- Storefront and customer account pages, including wishlist, address, and referral-related flows.
- Product imagery under `src/assets/products/`.
- Supabase schema in `supabase_schema.sql`.
- Serverless handlers under `api/`, including PayU callback/hash and email modules.

## Architecture and layout

- `src/` — storefront UI and styling.
- `api/` — server-side functions; payment secrets belong only in server configuration.
- `supabase/` and `supabase_schema.sql` — database assets/schema.
- `public/` — static assets.

## Run locally

```bash
npm ci
npm run dev
```

Run `npm run build` for a production build and `npm run preview` to inspect it. The package also defines a lint script.

## Configuration and security

Configure Supabase and payment/email settings in the server environment expected by the handlers. No `.env.example` is present. Do not expose PayU secrets in `VITE_` or other client-visible variables. Review the callback and hash validation before enabling live payments.

## Deployment and next steps

Vite is configured; the repository does not declare a specific production host. Document database setup and payment callback URLs. No repository-level `LICENSE` file was found, so reuse terms for project code are unspecified.
