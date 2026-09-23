# personal-website

My personal site: a portfolio set over an interactive pool.

![The about page over the WebGL pool](public/portfolio/personal-website/home.webp)

## Features

- A WebGL2 shader draws the water, caustics, shadows and wakes, with no 3D engine.
- Floaties drift, bob and bump into each other using a small custom physics solver.
- They steer around the text so the content stays readable.
- About, experience, projects and misc tabs, with keyboard navigation and linkable hashes.
- Respects reduced motion, and pauses when the tab is hidden.

## Stack

Next.js 16, React 19, TypeScript, Tailwind v4, shadcn/ui, Base UI, WebGL2. Hosted on Vercel.

## Running locally

Requires Node 22 and pnpm.

Icons come from [Central Icons](https://centralicons.com/), which needs a license key
(`CENTRAL_LICENSE_KEY`) at install time.

```sh
pnpm install:deps   # installs with the key from 1Password
pnpm dev
```

Other scripts: `pnpm test`, `pnpm lint`, `pnpm format`, `pnpm typecheck`, `pnpm build`.

## Structure

- `src/content/portfolio.ts`: experience, projects and misc content.
- `src/components/pool-hero/`: water renderer, shaders and floatie physics.
- `src/components/portfolio/`: tabs and work sample carousels.
- `public/portfolio/`: screenshots and videos.

## Deploying

Import into Vercel and set `CENTRAL_LICENSE_KEY` and `ENABLE_EXPERIMENTAL_COREPACK=1`
(so Vercel uses the pinned pnpm version).
