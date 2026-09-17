import assert from "node:assert/strict";
import test from "node:test";
import { createDuckMotion } from "./duck-motion.ts";
import { MAX_FLOATIES } from "./floatie-catalog.ts";
import { createWaterEffects, MAX_RIPPLES, RIPPLE_LIFETIME, surfacePose } from "./water-effects.ts";

function body(x = 300, size = 60) {
  const movement = createDuckMotion(() => 0.5, { x: x / 1280, y: 0.5 });
  movement.resize(1280, 900, size);
  movement.applyImpulse(100 - movement.velocity.x, -movement.velocity.y);
  return movement;
}

const close = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < 0.001);

test("sideways motion leaves a wake behind velocity, independent of facing", () => {
  const movement = body();
  const effects = createWaterEffects();
  movement.pose.angle = -Math.PI / 2; // Faces left while sliding right.
  effects.update([movement], 0);
  movement.moveBy(30, 0);
  effects.update([movement], 0.3);
  const surface = surfacePose(movement.pose, 0.3);
  assert.ok(effects.ripples[0] < surface.x);
  close(effects.ripples[1], surface.y);
  assert.ok(effects.ripples[3] > 0);
});

test("all eight toys cast shadows at their rendered positions and emit correctly sized ripples", () => {
  const bodies = Array.from({ length: MAX_FLOATIES }, (_, i) => body(150 + i * 110, 28 + i * 8));
  const effects = createWaterEffects();
  effects.update(bodies, 0);
  for (const movement of bodies) movement.moveBy(30, 0);
  effects.update(bodies, 0.3);
  for (const [index, movement] of bodies.entries()) {
    const surface = surfacePose(movement.pose, 0.3);
    close(effects.floaties[index * 3], surface.x);
    close(effects.floaties[index * 3 + 1], surface.y);
    close(effects.floaties[index * 3 + 2], movement.radius);
    close(effects.rippleSizes[index], movement.radius);
    assert.ok(effects.ripples[index * 4 + 3] > 0);
  }
});

test("paused rendering and stationary toys do not emit ripples", () => {
  const movement = body();
  const effects = createWaterEffects();
  effects.update([movement], 0);
  movement.moveBy(30, 0);
  effects.update([movement], 0.3, false);
  assert.ok(effects.ripples.every((value) => value === 0));
  movement.applyImpulse(-100, 0);
  effects.update([movement], 0.6);
  assert.ok(effects.ripples.every((value) => value === 0));
});

test("clearing or resizing removes old shadows and wakes and resets emission history", () => {
  const movement = body();
  const effects = createWaterEffects();
  effects.update([movement], 0);
  movement.moveBy(30, 0);
  effects.update([movement], 0.3);
  effects.clear();
  assert.ok(effects.ripples.every((value) => value === 0));
  assert.ok(effects.floaties.every((value) => value === 0));
  assert.ok(effects.rippleSizes.every((value) => value === 0));
  effects.update([movement], 0.4);
  assert.ok(effects.ripples.every((value) => value === 0));
  effects.update([], 0.5);
  assert.ok(effects.floaties.every((value) => value === 0));
});

test("a full pool never overwrites a still-visible ripple", () => {
  const effects = createWaterEffects();
  const bodies = Array.from({ length: MAX_FLOATIES }, (_, i) => body(150 + i * 110, 28));
  effects.update(bodies, 0);
  let seen = new Float32Array(effects.ripples);
  for (let frame = 1; frame < 120; frame++) {
    const now = frame / 60;
    for (const movement of bodies) movement.moveBy(2, 0);
    effects.update(bodies, now);
    for (let slot = 0; slot < MAX_RIPPLES; slot++) {
      const offset = slot * 4;
      if (seen[offset + 3] > 0 && seen[offset + 2] !== effects.ripples[offset + 2])
        assert.ok(now - seen[offset + 2] >= RIPPLE_LIFETIME);
    }
    seen = new Float32Array(effects.ripples);
  }
});
