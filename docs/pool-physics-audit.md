# Pool physics audit

Reviewed 2026-09-17.

## Assessment

The existing custom solver is appropriate for this decorative, interactive pool: at most eight
small, roughly round sprites, damped motion, and readability constraints. A general rigid-body
engine or fluid solver would add complexity without a corresponding benefit here.

The scene is a stylized approximation. Circular collision bounds, prescribed drift and steering,
soft elliptical floor shadows, and procedural caustics are intentional. It does not simulate
buoyancy, fluid volume, rotational inertia, or refraction through individual toy silhouettes.
Content exclusion takes priority over realism when layout changes require repositioning a toy.

## Findings resolved

| Finding                                                                                | Refinement                                                                                                                     |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Only the original duck had a floor shadow and wake.                                    | Every admitted toy supplies a surface position and collision radius to the renderer.                                           |
| Wakes followed the duck's angle even during sideways motion.                           | Ripples originate behind the actual velocity vector. Each stores its own emitter radius; wave propagation uses a shared speed. |
| All toys bobbed together and periodically changed size.                                | Small traveling-wave offsets vary with position, without scaling. DOM sprites and floor shadows use the same surface pose.     |
| Slow contacts bounced repeatedly.                                                      | Contacts below 10 px/s relative approach speed use zero restitution; faster impacts retain the damped bounce.                  |
| Wall correction damped velocity even when a toy already moved away.                    | Only incoming wall velocity receives restitution.                                                                              |
| Resize could move a right-lane toy across the pool using old content rectangles.       | Resize applies viewport containment; the immediately following exclusion measurement projects against the new layout.          |
| A closed picker retained measurable descendant rectangles and blocked invisible water. | Closed detail panels are excluded from the obstacle set; toggle events refresh the set.                                        |

## Bounds and lifecycle

- The existing maximum 1/120-second simulation substep, 50 ms frame clamp, speed limit,
  mass-weighted impulses, and iterative contact separation remain.
- Existing adaptive drawing resolution, frame cap, visibility suspension, reduced-motion handling,
  and WebGL fallback remain.
- Wake storage is fixed at 24 records for eight toys. A 0.24-second minimum emission interval and
  0.7-second lifetime let even a full pool fade ripples before their slots are reused.
- Clearing toys, resizing, and context loss reset wake history. Rendering a paused scene does not
  emit new ripples. Per-frame updates stay outside React state.
- More toys now add shader work for their shadows and wakes. The tested desktop scene retained
  its normal pixel budget; this is not a benchmark of low-end mobile GPUs.

## Validation

- 38 unit tests pass on Node 22, including the original collision, content-clearance, spawning,
  frame-clock, and repeated-burst tests. New regressions cover incoming versus outgoing wall
  contacts, slow-contact settling, resize lane preservation, sideways wakes, all eight emitters,
  pause/clear behavior, and ripple-slot lifetime.
- Lint, TypeScript, formatting, and the production build pass.
- Real browser interactions exercised all six toy types, the eight-toy limit, keyboard nudging,
  clear/re-add, drag-and-drop without a duplicate spawn, section switching, and resizing across
  desktop, 390 px, and 320 px widths. The 320 px full-pool check found no overlapping rendered
  collision circles beyond the small bob allowance. Visual inspection confirmed text clearance.
- No browser warning or error logs were reported during the checks; the WebGL scene remained active.
- Reduced-motion and WebGL-loss lifecycle paths were reviewed in code. The water-effects pause
  and reset behavior is unit-tested; OS reduced-motion and GPU context loss were not emulated in
  the browser session.

## References

The simulation uses bounded substeps rather than an unbounded variable timestep; see
[Fix Your Timestep](https://gafferongames.com/post/fix_your_timestep/) for the stability tradeoff.
Renderer buffers use WebGL vector uniforms as described in the
[WebGL uniform reference](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform).
