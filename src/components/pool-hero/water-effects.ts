import type { createDuckMotion, DuckPose } from "./duck-motion";
import { MAX_FLOATIES } from "./floatie-catalog.ts";

export const MAX_RIPPLES = MAX_FLOATIES * 3;
export const RIPPLE_LIFETIME = 0.7;
const RIPPLE_INTERVAL = 0.24;

type Body = ReturnType<typeof createDuckMotion>;

/** A small traveling swell: nearby toys share a wave without bobbing in lockstep. */
export function surfacePose(pose: DuckPose, seconds: number) {
  const phase = pose.x * 0.009 + pose.y * 0.006;
  return {
    x: pose.x,
    y: pose.y + Math.sin(seconds * 1.6 + phase) * Math.min(0.8, pose.size * 0.012),
    angle: pose.angle + Math.sin(seconds * 0.9 + phase) * 0.035,
  };
}

/** Fixed buffers shared with WebGL; every toy displaces water, not just the first duck. */
export function createWaterEffects() {
  const floaties = new Float32Array(MAX_FLOATIES * 3);
  const ripples = new Float32Array(MAX_RIPPLES * 4);
  const rippleSizes = new Float32Array(MAX_RIPPLES);
  let trails = new WeakMap<Body, { x: number; y: number; time: number }>();
  let nextRipple = 0;

  return {
    floaties,
    ripples,
    rippleSizes,
    clear() {
      floaties.fill(0);
      ripples.fill(0);
      rippleSizes.fill(0);
      trails = new WeakMap();
      nextRipple = 0;
    },
    update(bodies: readonly Body[], seconds: number, emit = true) {
      floaties.fill(0);
      for (let index = 0; index < Math.min(bodies.length, MAX_FLOATIES); index++) {
        const body = bodies[index];
        const pose = surfacePose(body.pose, seconds);
        floaties[index * 3] = pose.x;
        floaties[index * 3 + 1] = pose.y;
        floaties[index * 3 + 2] = body.radius;
        if (!emit) continue;
        const previous = trails.get(body);
        // Establish a fresh origin after spawning, resizing or clearing the pool.
        if (!previous) {
          trails.set(body, { x: body.pose.x, y: body.pose.y, time: seconds });
          continue;
        }
        const distance = Math.hypot(body.pose.x - previous.x, body.pose.y - previous.y);
        const velocity = body.velocity;
        const speed = Math.hypot(velocity.x, velocity.y);
        if (speed < 25 || seconds - previous.time < RIPPLE_INTERVAL || distance < body.radius * 0.3)
          continue;
        // A turning toy can slide sideways. Its wake trails velocity, not its nose.
        const slot = nextRipple++ % MAX_RIPPLES;
        ripples.set(
          [
            pose.x - (velocity.x / speed) * body.radius * 0.6,
            pose.y - (velocity.y / speed) * body.radius * 0.6,
            seconds,
            Math.min(1, speed / 180),
          ],
          slot * 4,
        );
        rippleSizes[slot] = body.radius;
        trails.set(body, { x: body.pose.x, y: body.pose.y, time: seconds });
      }
    },
  };
}
