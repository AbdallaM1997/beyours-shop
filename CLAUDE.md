# BeYours Shop

Bilingual (Arabic / English) e-commerce site for BeYours, a kids' clothing brand (ages 2–14) in Egypt.
Customers buy ready-made tees or design their own print in an AI Design Studio (Google Nano Banana).
Orders are managed in an admin dashboard.

Design source: Figma file "BeYours — E-commerce Site Draft"
(https://www.figma.com/design/hiq26vcRt1E2uWXXo1z3um). Frames: 01 Home, 02 Product page,
03 AI Design Studio, 03b AI Design Studio — 3D view, 04 Admin — Orders, plus the Components board.
Plan: "BeYours E-commerce Site — Plan & Milestones" doc.

## Stack
- Next.js 15 (App Router) + TypeScript (strict) + Tailwind CSS v4 (tokens live in `src/app/globals.css` under `@theme`, no tailwind.config)
- Fonts are self-hosted with @fontsource (Fredoka, Nunito, Cairo, Baloo Bhaijaan 2), imported in `src/app/[locale]/layout.tsx`
- next-intl v4 for ar / en (`src/i18n/`, messages in `messages/*.json`, Arabic is the default locale), with full RTL for Arabic (use logical classes: ms-, me-, ps-, pe-, start-, end-)
- Supabase: Postgres, Auth, Storage; row-level security on every table
- Fabric.js for the 2D shirt editor; React Three Fiber (three.js) for the 3D preview
- Gemini API (Nano Banana 2, model `gemini-3.1-flash-image`) via `@google/genai`, server-side only
- Paymob (cards, wallets) + cash on delivery
- Vitest for unit tests (`tests/`); Playwright for end-to-end is added in M3
- Deploy on Vercel

## Commands
- `npm run dev` start the app
- `npm run lint` / `npm run typecheck` / `npm test` / `npm run build`
- `npx supabase db push` apply migrations in `supabase/migrations`

## Brand tokens (Tailwind theme: bg-brand-blue, bg-brand-pink, text-muted, shadow-sticker, font-display ...)
- blue #2403B8, blue-light #3417C9, pink #F60883, yellow #FFBF03, lime #98F800, ink #000000, paper #FFFFFF
- Headings: Fredoka (EN) / Baloo Bhaijaan 2 (AR); body: Nunito (EN) / Cairo (AR)
- Sticker look: 3px black borders, offset shadow `4px 4px 0 #000`, rounded 16–24px, pill buttons
- Brand images live in `public/brand/` (logo, bolt, lips, peace hand)

## Rules
- Mobile-first. Every page must work at 375px wide and in RTL.
- Never call Gemini, Paymob or the Supabase service key from the browser. Use route handlers or server actions in `src/server/`.
- Every AI request goes through `src/server/ai/generate.ts`: check rate limit, moderate the prompt, wrap it with the brand style prompt, call the model, moderate the result, log cost in the `generations` table.
- Block prompts that ask for real brands, logos or known cartoon characters; return a friendly message.
- Custom designs are never printed automatically: they start in status `design_check` and need admin approval.
- Print files: transparent PNG, 300 DPI at print size (front area 25 × 30 cm), stored in Supabase Storage bucket `print-files` (private).
- Uploaded kids' photos go to bucket `uploads` (private) and are deleted after 30 days if no order uses them.
- Prices are integers in piasters (EGP × 100). Format with the locale.
- Keep components small; shared UI in `src/components/ui`. Match the Figma frames; reuse tokens, don't hardcode colors.
- Write tests for server logic (pricing, order status changes, AI guard). Run lint, typecheck and tests before saying a task is done.
- Never commit `.env*` files or keys. Ask before adding a new paid service or dependency.

## Order statuses
new → design_check (custom only) → printing → ready → shipped → delivered; side exits: cancelled, returned.

## Progress
- [x] M1 starter: Next.js, tokens, fonts, i18n (ar/en, RTL), Nav/Footer, Home page with sample products, Supabase schema + RLS + seed, AI guard + /api/ai/generate, price helpers + tests, CI
- [x] M1 remaining: /dev/ui component page (dev only), Home "New drop" reads Supabase products (`src/server/products.ts`, falls back to sample data without keys), Supabase session refresh in `src/middleware.ts`, `products.display_color` (migration 0002)
- [x] M2 Storefront: shop (`?c=boys|girls|baby`, unisex shows in boys + girls), product page (colour/size/qty → variant), cart in localStorage (`src/components/cart/cart-store.ts`, display prices only — server must recalculate at checkout), size guide, shipping & returns (fees from `shipping_zones`), FAQ. Open: real size-chart numbers (`src/lib/size-guide.ts`), returns policy wording, WhatsApp number, match Figma frame 02
- [ ] M3 Checkout, Paymob + COD, accounts, admin Orders + Products
- [ ] M4 Design Studio: editor, Nano Banana generate/edit, print export, 3D preview
- [ ] M5 Admin: overview, custom designs queue, customers, settings
- [ ] M6 QA, performance, SEO, beta
