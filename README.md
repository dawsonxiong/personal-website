# personal-website

Dawson Xiong's personal site. Next.js on Vercel. Replaces `v1` (archive).

```sh
pnpm dev
pnpm build
pnpm lint
pnpm format
pnpm format:check
pnpm typecheck
```

Open this folder, not `~/Developer`. See `AGENTS.md`.

## Pool hero

Run `pnpm dev` with Node 22 to view the pool. Move the pointer near the duck, or
tap nearby on a touch screen, to send it swimming away.

`src/components/pool-hero/` contains the isolated hero. `PoolHero` accepts ordinary
DOM children; the page remains a Server Component. A single WebGL2 fragment shader
draws the water without textures or additional dependencies. The shaded duck is
a small transparent WebP above the canvas; its soft floor shadow and six bounded
wake rings are part of the same shader pass. No video or 3D engine is used.

### Structure and tuning

- `pool-hero.tsx`: composition, pointer input, one shared animation loop, and
  lifecycle handling. React state changes only for playback controls.
- `water-renderer.ts`: WebGL resources, uniforms, resolution limits, and disposal.
- `water-shaders.ts`: blue light fields, caustics, refraction, tiles, shadow, wake.
- `duck-motion.ts`: acceleration, coasting, randomized escape direction, and
  boundary steering. It accepts an optional random source for deterministic checks.
- `pool-hero.module.css`: isolated layout and responsive duck sizing.

Visual tuning lives in `water-shaders.ts`: `cloudLight` shapes the broad light,
`refracted` bends the tile floor, and the two `cellEdge` fields add fine caustics.
The main refraction amplitude is `0.42`, reduced from the initial `0.78` after
visual review. The view uses the shorter viewport dimension to preserve water
proportions on resize. Duck image-box size is `clamp(3.75rem, 14.5vmin, 6rem)`;
the transparent sprite padding makes the visible duck smaller than that box.

Escape bursts last about 0.3 seconds, then drag returns the duck to gentle drift.
Candidate directions favor moving away from the pointer and into open water.
Soft steering precedes hard containment, including a clear area below the DOM
heading. Position and orientation update through a transform, without layout
reads or React updates in the animation loop.

### Playback and fallbacks

The renderer caps its pixel ratio at 1.5 and its drawing buffer at approximately
two million pixels. Resizing preserves the duck's relative position. Animation
suspends when the hero leaves the viewport or the document is hidden. All
observers, listeners, animation frames, and GPU resources are released on unmount.

The bottom-right button pauses both water and duck. Keyboard users can Tab to a
fixed **Nudge the duck** control; it becomes visible on focus and does not move
away. Reduced-motion users start on a still frame with no evasion, and can choose
Play explicitly. A change to the system preference resets that explicit choice.

The static water poster appears before initialization, with JavaScript disabled,
or when WebGL2 is unavailable. Context loss returns to the poster; context
restoration recreates the GPU resources. Text remains selectable DOM content,
pointer listeners are passive, and ordinary page scrolling is preserved. Future
sections belong after `PoolHero`; no placeholder sections are shipped.

### Assets

- `public/pool/duck.webp`: original imagegen asset, resized to 384 × 384 and
  encoded at WebP quality 90 with alpha preserved (about 16 KB).
- `public/pool/water-poster.webp`: 1600 × 1000 capture of this exact renderer at
  `draw(0)` with no duck or wake uniforms, encoded at WebP quality 87 (about 50 KB).
  Regenerate from the renderer after changing the shader; do not substitute an
  independently generated pool image.

Duck generation prompt:

> Use case: product-mockup. Asset type: a single transparent-background rubber-duck
> sprite for a high-quality overhead swimming-pool website. Create one classic
> small yellow bath duck viewed from DIRECTLY ABOVE, orthographic top-down camera,
> its orange beak pointing straight toward 12 o'clock. The rounded head sits at
> the top of the plump pear-shaped body; both tiny black eyes are visible beside
> the head, with subtle sculpted wing bulges and a little tail at the bottom.
> Render it as a convincing real molded rubber toy, soft warm sunflower yellow,
> modest satin sheen, delicate dimensional shading, diffuse sunlight from the
> upper left and a little cool blue reflected fill. Friendly and simple but not
> a flat illustration, not an emoji, not a cartoon face. The whole duck is
> centered, isolated, tightly framed at about 82 percent of a square canvas.
> Use genuine transparent alpha around its clean silhouette. No water, pool,
> floor, cast shadow outside the duck, background, checkerboard pixels, text,
> logos, extra objects, or feet. Preserve enough natural highlights and shape
> that it reads beautifully when displayed at 45–90 CSS pixels.

### Verification

Checked in the actual browser at desktop, portrait, and landscape sizes, including
repeated pursuit, selection, pause/play, keyboard nudging, nearby touch input,
reduced motion, and scrolling into a temporary following section. The temporary
section was removed. Forced WebGL loss/restoration, missing WebGL, and disabled
JavaScript all retain a usable page. Movement checks exercised 800 escapes and
confirmed matching paths at 30, 60, and 120 Hz with a seeded random source.

A six-second production Chrome sample on Apple M4, at 1440 × 900 CSS pixels with
DPR 2, rendered 360 frames: 16.7 ms median interval, 16.8 ms p95, no long tasks.
The capped buffer was 1789 × 1118; sampled GPU work averaged 4.7 ms. These are
local desktop measurements; phone layout/touch was checked with browser device
emulation, not physical-device performance testing. No adaptive quality system
was needed for this measured target.

`pnpm lint`, `pnpm format:check`, `pnpm typecheck`, and `pnpm build` pass under
Node 22. No pool-related console errors were observed; the starter's absent
`favicon.ico` still returns 404 when Chrome requests it.
