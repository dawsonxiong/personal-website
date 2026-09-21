# personal-website

Dawson's personal site. Replaces `v1` (that repo is archive). Next.js on Vercel. This folder is the git root — open it, not `~/Developer`.

Inherits the `next16-app` house skill. Deltas and product decisions are here.

## Commands

```sh
pnpm dev
pnpm build
pnpm lint
pnpm format
pnpm format:check
pnpm typecheck
```

## Stack — locked

- Next.js 16 App Router, TypeScript strict, RSC
- Tailwind v4 + shadcn/ui (variants-first, semantic colors)
- Host: **Vercel only**. No Cloudflare bindings from this app.
- pnpm, Node 22, `packageManager` pinned
- oxlint + oxfmt (not ESLint/Prettier/Biome)
- API routes over server actions if any API appears later
- **No auth.** Public site.
- **No database in v1 of this repo.** Content is in the tree. Do not add Prisma, Supabase, D1, or a second host “just in case.”

## Product

- New site from scratch. Do not port `v1` pages, components, or the D1 collector unless asked.
- Start with a **single landing page**. Do not scaffold `projects`, `life`, blog, or other routes until asked.
- `v1` stays as archive. Do not delete or “clean up” that repo from here.

## Later: activity log

Sometime after launch, this site may grow an activity feed like `v1` (WakaTime / Monkeytype). That **will** need a store. When that ticket lands:

- This app is on Vercel, so it **cannot** use a Cloudflare D1 binding. Options then: Prisma + Postgres (house default) or HTTP to an existing store (how `v1` reads D1).
- Collector stays off the Next app. No runtime calls to WakaTime/Monkeytype from the web app.
- Do not create the table, worker, or Prisma schema until that work is explicit.

## Still open

- Domain
- Visual direction
- Central Icons license in 1Password (`.env.op` → `CENTRAL_LICENSE_KEY`; Vercel env for deploys)

## Hard rules

- Do not apply Go, Rust, or Cloudflare Worker defaults.
- Never commit `.env.local`.
- UI icons: Central Icons via `@/components/icons` — do not add `lucide-react` for app UI.
- Do not add a second host.
- Do not add auth, a database, or extra routes without being asked.
- Short/easy tweaks (copy, spacing, text size): edit only — no `pnpm build` / `typecheck` / `lint` unless asked or types may break.

## MCP

Vercel MCP in `.cursor/mcp.json` and `.mcp.json`. Context7 and 1Password stay user-global — do not duplicate them here.
