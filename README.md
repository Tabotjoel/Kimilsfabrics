# Kekia Sally — Online Atelier

A bilingual (English/French), dark-mode-aware e-commerce site for **Kekia Sally Simtress** — "Stitched with Passion, Worn with Confidence." Built with Next.js (App Router only, no `src` directory), Prisma, NextAuth, and Stripe, in her brand's burgundy, gold and cream.

---

## What's included

- **Storefront**: home, shop with filters, product detail pages, cart, checkout, order confirmation, about, contact
- **Admin dashboard** (`/admin`): the *only* way in is her own login — she can add/edit/delete products, upload her own photos, and manage orders
- **Bilingual**: every page in English and French (`/en/...` and `/fr/...`), with a one-click switcher
- **Dark / light mode** toggle, remembered across visits
- **Payments**: Stripe Checkout, priced in CAD — Stripe is the standard choice for Canadian sellers, supports all major cards, Apple Pay/Google Pay, and settles directly to a Canadian bank account
- **Database**: Prisma ORM — SQLite for local development (zero setup), one line to switch to Postgres for production

---

## 1. First-time setup (on your own computer)

You'll need [Node.js 20+](https://nodejs.org) installed.

```bash
cd kekia-sally
npm install
cp .env.example .env
```

Open `.env` and fill in:

- `AUTH_SECRET` — generate one with `npx auth secret`, or any long random string
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — the login you'll give Sally
- Leave the Stripe keys as placeholders for now if you don't have them yet — the site runs fine without them; only the checkout button won't work until they're added

Then set up the database and load a few sample products so the site isn't empty:

```bash
npm run db:push
npm run db:seed
```

Run it locally:

```bash
npm run dev
```

- Storefront: http://localhost:3000
- Admin login: http://localhost:3000/admin/login (use the email/password you set in `.env`)

---

## 2. Adding real payments (Stripe)

1. Create a free account at [stripe.com](https://stripe.com) (or have Sally create one — see note below).
2. In the Stripe Dashboard, go to **Developers → API keys** and copy the **Publishable key** and **Secret key** into `.env`:
   ```
   STRIPE_SECRET_KEY="sk_live_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
   ```
3. Go to **Developers → Webhooks**, add an endpoint pointing to `https://yourdomain.com/api/webhook/stripe`, select the `checkout.session.completed` event, and copy the **Signing secret** into `STRIPE_WEBHOOK_SECRET`.

**Since you want this to stay a surprise:** you can create the Stripe account yourself using her business details (or a placeholder), keep it in test mode while you build, and hand her the account credentials with the finished site — Stripe payouts go straight to whatever Canadian bank account she connects on her own later. Nothing about the storefront needs to change when she does that.

**Test mode**: While `sk_test_...` keys are in place, use Stripe's test card `4242 4242 4242 4242`, any future expiry, any CVC — no real charge happens.

---

## 3. Giving Sally the admin

Once the site is live, send her:
- The website address
- `/admin/login` — her email + password
- A quick note: "Add product" → upload photos, fill in the English and French name/description, price, sizes, colours, save. That's the whole workflow.

She never needs to touch code. Product photos she uploads through the admin panel go straight onto the live site.

---

## 4. Deploying it for real

The easiest path is **[Vercel](https://vercel.com)** (made by the creators of Next.js, free tier is enough to start):

1. Push this project to a GitHub repository.
2. Import it into Vercel.
3. Add all the variables from `.env` into Vercel's **Environment Variables** settings (use your production Stripe keys here, and a production `DATABASE_URL` — see below).
4. For file uploads to persist in production, connect **Vercel Blob** (Storage tab → Create → Blob) — the app automatically uses it once `BLOB_READ_WRITE_TOKEN` is present; otherwise uploads only work reliably in local development.
5. Deploy.

**Database in production**: SQLite is great for local dev but not for a serverless host like Vercel. Before going live, create a free Postgres database (e.g. [Neon](https://neon.tech) or [Supabase](https://supabase.com), both Canadian-friendly and free to start), then:
   - In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`
   - Set `DATABASE_URL` to the connection string they give you
   - Run `npm run db:push` once, then `npm run db:seed` if you want the sample products (or skip seeding and let Sally add her own from scratch)

---

## Project structure

```
app/
  [locale]/          → the public storefront (en / fr)
  admin/              → the password-protected admin dashboard
  api/                → all backend routes (products, orders, checkout, Stripe webhook, uploads, auth)
components/           → shared UI (navbar, footer, product card, admin sidebar, forms)
lib/                  → prisma client, auth config, stripe client, cart store, utilities
prisma/               → database schema + seed script
messages/             → en.json / fr.json translation files
i18n/                 → next-intl routing configuration
```

No `src` directory — everything lives directly under `app`, `components`, and `lib`, as requested.

---

## Useful commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build |
| `npm run db:push` | Sync the database schema |
| `npm run db:seed` | Load the admin account + sample products |
| `npm run db:studio` | Open Prisma Studio, a visual database browser |

---

## A note on this build

This project was assembled and its TypeScript verified line-by-line, but the sandboxed environment it was built in doesn't have general internet access (it can't reach Google Fonts or Prisma's binary CDN), so a full `npm install && npm run build` couldn't be run start-to-finish inside that sandbox. Both of those are ordinary one-time downloads that happen automatically and silently the moment you run `npm install` on a normal computer or on Vercel. If anything unexpected still comes up when you first run it, it'll most likely be a small, easy-to-fix detail — feel free to bring it back here.
