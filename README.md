# BeYours Shop

Bilingual (Arabic / English) online store for **BeYours** — bold kids' tees (ages 2–14) with an AI Design Studio powered by Google Nano Banana, plus an admin dashboard for orders.

> **Be Different.**

## What's in this starter

| Area | Status |
| --- | --- |
| Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 | ✅ set up |
| Arabic (default, RTL) / English with `next-intl` | ✅ `/ar`, `/en`, language switch |
| Brand tokens, fonts (Fredoka, Nunito, Cairo, Baloo Bhaijaan 2), logo and stickers | ✅ `src/app/globals.css`, `public/brand/` |
| Home page (hero, categories, new drop, how it works, footer) | ✅ products from Supabase (sample data if no keys) |
| Component gallery at `/ar/dev/ui` / `/en/dev/ui` | ✅ dev only |
| Supabase session refresh in middleware | ✅ `src/middleware.ts` |
| UI: Button, Badge, ProductCard, TeeShape, Nav, Footer | ✅ `src/components` |
| Supabase clients + schema with RLS + seed (products, variants, Egypt shipping zones) | ✅ `supabase/` |
| AI route `POST /api/ai/generate` with prompt guard (brands, characters, unsafe words, daily limit) | ✅ server-only |
| Price helpers in piasters + unit tests | ✅ `tests/` |
| Admin shell at `/admin` | 🟡 placeholder |
| Design Studio at `/studio` | 🟡 placeholder (M4) |
| Shop, product, cart, checkout, Paymob | ⏳ M2–M3 |

The full plan, milestones and step-by-step Claude Code prompts are in the **BeYours E-commerce Site — Plan & Milestones** doc. Designs: [Figma draft](https://www.figma.com/design/hiq26vcRt1E2uWXXo1z3um).

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your keys
npm run dev                  # http://localhost:3000 → redirects to /ar
```

Database (needs the [Supabase CLI](https://supabase.com/docs/guides/cli)):

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push          # applies supabase/migrations
psql "$DATABASE_URL" -f supabase/seed.sql   # optional sample data
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm test` | Unit tests (Vitest) |

## Project structure

```
src/
  app/[locale]/        storefront pages (ar / en)
  app/[locale]/studio/ AI Design Studio (M4)
  app/admin/           admin dashboard (English)
  app/api/ai/generate/ Nano Banana image generation endpoint
  components/          ui/ and layout/
  i18n/                routing, navigation, request config
  lib/                 price helpers, Supabase clients, sample data
  server/ai/           prompt guard + Gemini call (server only)
messages/              ar.json, en.json
supabase/              migrations + seed
public/brand/          logo and stickers
```

## Working with Claude Code

`CLAUDE.md` holds the project rules, brand tokens and progress list. Open Claude Code in this folder and follow the prompts in the plan doc, one task per session.
