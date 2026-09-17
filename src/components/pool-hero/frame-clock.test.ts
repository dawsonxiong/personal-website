import assert from "node:assert/strict";
import test from "node:test";
import { createFrameClock } from "./frame-clock.ts";

for (const hz of [30, 60, 75, 90, 120, 144]) {
  test(`steady ${hz} Hz preserves quality and renders at up to 60 FPS`, () => {
    const clock = createFrameClock();
    let draws = 0;
    let elapsed = 0;
    for (let frame = 0; frame <= hz * 20; frame++) {
      const delta = clock.next((frame * 1000) / hz);
      if (delta !== null) {
        draws++;
        elapsed += delta;
      }
    }
    assert.equal(clock.quality, 1);
    assert.equal(clock.stopped, false);
    assert.ok(Math.abs(draws - (Math.min(hz, 60) * 20 + 1)) <= 1, `${draws} draws`);
    assert.ok(Math.abs(elapsed - 20) < 1 / hz, `${elapsed} seconds of motion`);
  });
}

test("sustained slowdown reduces quality before throttling and falling back", () => {
  const clock = createFrameClock();
  let now = 0;
  clock.next(now);
  for (let frame = 0; frame < 135; frame++) clock.next((now += 1000 / 60));
  assert.equal(clock.quality, 1);

  for (let frame = 0; frame < 270; frame++) clock.next((now += 1000 / 30));
  assert.equal(clock.quality, 0.45);
  assert.equal(clock.stopped, false);

  // Once throttled, faster callbacks should still produce only 30 draws/sec.
  let draws = 0;
  for (let frame = 0; frame < 120; frame++) {
    if (clock.next((now += 1000 / 120)) !== null) draws++;
  }
  assert.ok(Math.abs(draws - 30) <= 1, `${draws} draws`);

  for (let frame = 0; frame < 90; frame++) clock.next((now += 100));
  assert.equal(clock.stopped, true);
  assert.equal(clock.next(now + 100), null);
});

test("resume ignores time spent paused and recalibrates for a different display", () => {
  const clock = createFrameClock();
  for (let frame = 0; frame < 180; frame++) clock.next((frame * 1000) / 144);
  clock.reset();
  assert.equal(clock.next(60_000), 0);
  for (let frame = 1; frame <= 600; frame++) {
    const delta = clock.next(60_000 + (frame * 1000) / 30);
    assert.ok(delta !== null && Math.abs(delta - 1 / 30) < 0.0001);
  }
  assert.equal(clock.quality, 1);
  assert.equal(clock.stopped, false);
});

test("a single long frame does not degrade quality or create catch-up draws", () => {
  const clock = createFrameClock();
  for (let frame = 0; frame <= 180; frame++) clock.next((frame * 1000) / 60);
  assert.equal(clock.next(4000), 0.05);
  assert.equal(clock.next(4001), null);
  for (let frame = 1; frame <= 180; frame++) clock.next(4000 + (frame * 1000) / 60);
  assert.equal(clock.quality, 1);
  assert.equal(clock.stopped, false);
});
