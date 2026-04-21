# TECHSTORE

Arabic RTL e-commerce web app with a dark navy / electric-blue lightning theme.

## Architecture

- **Monorepo**: pnpm workspace
- **Artifacts**:
  - `artifacts/api-server` — Express API on port 8080, mounted at `/api`
  - `artifacts/techstore` — React + Vite frontend (port 23741, base `/`)
  - `artifacts/mockup-sandbox` — design preview server
- **Database**: Replit Postgres via Drizzle ORM
- **Auth**: cookie-based session (`ts_sid`, `ts_admin`) signed with `SESSION_SECRET`
- **AI Chat**: Replit OpenAI integration (gpt-5.2)

## Backend (`artifacts/api-server`)

- Schema: categories, products, reviews, banners, orders, admins, coupons, customers, chatMessages, sessions
- Routes: catalog, cart, wishlist, orders, me, chat, admin (login/me/stats/sales-chart/orders/products/categories/customers/admins/coupons CRUD)
- Seeded with 12 products, categories, banners, admin `loay`/`11211`, 3 coupons, 8 customers, 10 orders, reviews
- Re-seed: `pnpm exec tsx artifacts/api-server/src/seed.ts`

## Frontend (`artifacts/techstore`)

- Routes (customer): `/`, `/products`, `/category/:slug`, `/product/:id`, `/cart`, `/checkout`, `/wishlist`, `/account`, `/chat`
- Routes (admin): `/admin/login`, `/admin`, `/admin/orders`, `/admin/products`, `/admin/categories`, `/admin/customers`, `/admin/coupons`, `/admin/admins`, `/admin/settings`
- Stack: React 19, Wouter, TanStack Query, Tailwind v4, shadcn/ui, framer-motion, sonner, recharts, lucide-react
- API client: `@workspace/api-client-react` (Orval-generated hooks)

## Admin

Login at `/admin/login` with `loay` / `11211`. Full CRUD for products, categories, coupons, admins; order status management; dashboard with KPIs, sales chart and category breakdown.

## Footer

"حقوق الملكية محفوظة لـ LOAY" + Android APK download link.
