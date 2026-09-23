# personal-website

Dawson Xiong’s personal site. Next.js on Vercel. Replaces `v1` (archive).
Open this folder, not `~/Developer`. See `AGENTS.md`.

Use Node 22 and pnpm:

```sh
pnpm dev
pnpm test
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
```

### Central Icons (licensed)

Icons come from [Central Icons](https://centralicons.com/) (`round-filled-radius-2-stroke-2`), not Lucide.
The license key must be present when installing dependencies.

Install dependencies through 1Password so the preinstall license check passes:

```sh
pnpm install:deps
```

Plain `pnpm install` fails — the key is only in `.env.op`. For the same reason
`verifyDepsBeforeRun` is off in `pnpm-workspace.yaml`; otherwise pnpm would run an
implicit, keyless install before any script.

## Deploying (Vercel)

Import the repo in Vercel (framework preset: Next.js) and set two environment variables for
Production and Preview:

- `CENTRAL_LICENSE_KEY`: same value as in 1Password, so the icon package's preinstall check passes.
- `ENABLE_EXPERIMENTAL_COREPACK=1`: makes Vercel use the pinned `packageManager` (pnpm 11)
  instead of guessing pnpm 9/10 from the lockfile, which would ignore `allowBuilds`.

Node comes from `engines` in `package.json` (22.x). The domain's DNS lives on Cloudflare: add the
records Vercel shows under Domains, set to **DNS only** (grey cloud), not proxied.

Import icons only through `@/components/icons` (see `central-icons.ts` for the locked variant).

## Portfolio in the pool

A single persistent, viewport-sized WebGL scene sits behind a tabbed portfolio.
About, Experience, Selected projects, and Misc switch in the same main space;
the document does not scroll between sections. Only an active panel with content
taller than the available space scrolls internally. The narrow reading column
has a feathered translucent wash, without section cards.

Tab buttons support Left/Right arrows and Home/End, expose their selected state,
and label their corresponding panels. Section hashes support direct links and
browser back/forward without remounting the pool. Content stays server-rendered;
the small tab shell handles selection. Project details use native disclosures.

Edit `src/content/portfolio.ts` for experience, projects, and the misc tab's albums,
songs, and poker hand. Monkeytype bests come from the public profile endpoint in
`src/lib/monkeytype.ts`, cached for an hour with a static fallback. Experience and
contact details come from the archived `v1` portfolio; selected project copy comes
from the public project READMEs. No archived components or routes are imported.

## Scene and interaction

- `src/components/pool-hero/pool-hero.tsx`: one shared animation loop, floatie
  transforms, pointer input, exclusion measurement, and lifecycle cleanup.
- `duck-motion.ts`: drift, escape bursts, boundary steering, and content avoidance.
- `floatie-catalog.ts`: available toys, collision sizes, and the eight-item limit.
- `floatie-physics.ts`: safe spawn placement, shared substeps, size-aware contacts, momentum transfer,
  and separation that respects pool edges and readable content.
- `water-renderer.ts`: WebGL resources, uniforms, resolution limits, and disposal.
- `water-shaders.ts`: caustics, refraction, tiles, duck shadow, and bounded wakes.
- `pool-hero.module.css`: fixed scene, responsive floaties, and playback controls.
- `src/components/portfolio/`: editorial layout and accessible tab navigation.

The pool starts with one duck. The **Add a floatie** (+) control opens a picker
for extra ducks, buoys, beach balls, donut floats, watermelons, and turtles.
**Clear extras** returns to the original duck without restarting the water.
The scene holds up to eight floaties, and spawning checks for open water first;
if no safe position exists, the picker explains how to make room. The picker
closes on Escape or an outside click.

Move the pointer near any floatie, or tap nearby, to send it moving away. They
all drift and respond independently using the same motion system. Extra items
register with the running simulation without recreating the renderer or resetting
existing motion. They can also be added while paused. The new shapes use CSS;
the duck uses the existing transparent WebP. Water and the duck’s wake are rendered
in one WebGL2 shader pass, with no 3D engine or video.

The reading area, header, footer, and controls carry `data-pool-exclusion`. Their
viewport rectangles are measured on resize. The whole reading area stays clear
while tabs switch and the active panel scrolls or expands.
The simulation caches padded rectangles, steers away from them, and projects a
floatie into nearby clear water if a scroll jump suddenly covers its position.
Projection also runs while paused. No DOM geometry is read in the motion step.
At narrow widths, floaties shrink to fit the water beside the reading column.

All floaties collide as circles, with a smaller collision radius for the
duck’s transparent sprite. Mass scales with area and collisions use a soft,
inelastic bounce. Every body advances together in steps of at most 1/120 second;
bounded speeds prevent fast bursts from skipping over one another. The contact
solver separates overlaps after resizes too, even while paused. If scenery blocks
one body, the other takes the remaining separation; cramped side lanes can resolve
vertically. No physics library is required.

## Playback and fallbacks

The fixed bottom-right control pauses the whole scene. Keyboard users can Tab
from it to **Nudge the floaties**, which becomes visible on focus and nudges
every floatie. Reduced motion starts with a still scene; an explicit Play choice enables the animation. System preference changes reset that choice.

The canvas is capped at a 1.5 pixel ratio and approximately two million pixels,
regardless of document length. Animation suspends when the document is hidden or
the canvas is not visible. Listeners, observers, animation frames, and GPU resources
are released on unmount.

`public/pool/water-poster.webp` supplies the fallback before initialization, with
JavaScript disabled, or without WebGL2. Context loss restores the poster; context
restoration recreates the renderer. Links, content, and disclosures remain ordinary DOM elements. Without JavaScript,
the initial About panel and static pool remain visible; switching tabs requires
JavaScript.

## Assets

- `public/pool/duck.webp`: original generated overhead rubber-duck sprite, 384 × 384
  with alpha preserved.
- `public/pool/water-poster.webp`: 1600 × 1000 capture of the existing renderer at
  `draw(0)` with no duck or wake. Regenerate from the shader if its appearance changes.

## Verification

`pnpm test` uses Node’s built-in test runner and TypeScript stripping, with no
additional test dependency. It checks exclusion clearance through scrolling and
escape bursts at widths from 320 to 1920 pixels, immediate projection while paused,
desktop-to-phone resizing, and consistent motion at 30, 60, and 120 Hz.
Collision tests also cover momentum and energy, glancing and separating contacts,
three-body pileups, walls, narrow lanes, fast opposing motion, and repeated bursts
across desktop, mobile, and landscape viewports. Spawn tests fill the pool with
eight moving bodies, verify existing bodies are undisturbed during placement,
and check that a full scene rejects new bodies safely.

Browser verification covers tab selection, keyboard navigation, section hashes,
browser history, project disclosure expansion, and internal panel scrolling with
a stationary document. The persistent pool, pause/play, keyboard nudging, and
responsive layouts are also checked. Phone checks use viewport emulation, not a
physical device.
