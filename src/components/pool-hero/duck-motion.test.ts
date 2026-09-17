import assert from "node:assert/strict";
import { test } from "node:test";
import { createDuckMotion, type DuckPose, type ExclusionZone } from "./duck-motion.ts";
import { placeFloatie, resolveFloatieCollisions, stepFloaties } from "./floatie-physics.ts";

function randomSource() {
  let seed = 42;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function assertClear(pose: DuckPose, zones: ExclusionZone[], width: number, height: number) {
  const radius = pose.size / 2;
  assert.ok(pose.x >= radius && pose.x <= width - radius, "contained horizontally");
  assert.ok(pose.y >= radius && pose.y <= height - radius, "contained vertically");
  for (const zone of zones) {
    assert.ok(
      pose.x + radius <= zone.left ||
        pose.x - radius >= zone.right ||
        pose.y + radius <= zone.top ||
        pose.y - radius >= zone.bottom,
      `floatie at ${pose.x}, ${pose.y} overlaps readable content`,
    );
  }
}

for (const width of [320, 390, 640, 641, 700, 800, 1280, 1920]) {
  test(`floaties avoid scrolling and expanding content at ${width}px`, () => {
    const height = 844;
    const columnWidth = Math.min(550, width - (width <= 640 ? 96 : 112));
    const left = (width - columnWidth) / 2;
    const size = Math.max(28, Math.min(96, (width - 600) * 0.24));
    const movement = createDuckMotion(randomSource(), { x: 0.5, y: 0.5 });
    movement.resize(width, height, size);

    for (let scroll = 0; scroll < 2400; scroll += 37) {
      const zones = [
        { left: 0, top: 0, right: width, bottom: 92 },
        { left, top: 185 - scroll, right: width - left, bottom: 550 - scroll },
        { left, top: 650 - scroll, right: width - left, bottom: 1300 - scroll },
        { left, top: 1400 - scroll, right: width - left, bottom: 2600 - scroll },
        { left: width - 60, top: height - 60, right: width - 16, bottom: height - 16 },
      ];
      movement.setExclusions(zones);
      // Layout changes must be safe even when animation is paused.
      assertClear(movement.pose, zones, width, height);
      movement.flee(movement.pose.x, movement.pose.y, false, true);
      for (let frame = 0; frame < 60; frame++) {
        movement.step(1 / 60);
        assertClear(movement.pose, zones, width, height);
      }
    }
  });
}

test("resizing from desktop to phone keeps the floatie outside text", () => {
  const movement = createDuckMotion(randomSource());
  movement.resize(1440, 900, 96);
  movement.setExclusions([{ left: 445, top: -400, right: 995, bottom: 1200 }]);
  movement.resize(390, 844, 28);
  const zones = [{ left: 48, top: -600, right: 342, bottom: 1200 }];
  movement.setExclusions(zones);
  assertClear(movement.pose, zones, 390, 844);
});

test("motion stays consistent across 30, 60, and 120 Hz", () => {
  const poses = [30, 60, 120].map((fps) => {
    const movement = createDuckMotion(randomSource());
    movement.resize(1280, 900, 96);
    movement.setExclusions([{ left: 365, top: 100, right: 915, bottom: 900 }]);
    movement.flee(movement.pose.x, movement.pose.y, false, true);
    for (let frame = 0; frame < fps * 10; frame++) movement.step(1 / fps);
    return movement.pose;
  });
  for (const pose of poses.slice(1)) {
    assert.ok(Math.hypot(pose.x - poses[0].x, pose.y - poses[0].y) < 1);
  }
});

function body(x: number, y: number, size = 60, vx = 0, vy = 0) {
  const movement = createDuckMotion(randomSource(), { x: x / 1280, y: y / 900 });
  movement.resize(1280, 900, size);
  movement.applyImpulse(vx - movement.velocity.x, vy - movement.velocity.y);
  return movement;
}

function assertSeparated(bodies: ReturnType<typeof body>[]) {
  for (let i = 0; i < bodies.length; i++) {
    assert.ok(Number.isFinite(bodies[i].pose.x) && Number.isFinite(bodies[i].pose.y));
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i];
      const b = bodies[j];
      assert.ok(
        Math.hypot(a.pose.x - b.pose.x, a.pose.y - b.pose.y) >= a.radius + b.radius - 0.05,
        `bodies ${i} and ${j} overlap`,
      );
    }
  }
}

test("head-on contact transfers momentum with a damped bounce", () => {
  const a = body(500, 400, 80, 120);
  const b = body(560, 400, 60, -80);
  const momentumBefore = a.radius ** 2 * a.velocity.x + b.radius ** 2 * b.velocity.x;
  const energyBefore = a.radius ** 2 * a.velocity.x ** 2 + b.radius ** 2 * b.velocity.x ** 2;
  resolveFloatieCollisions([a, b]);
  assertSeparated([a, b]);
  assert.ok(b.velocity.x > a.velocity.x, "bodies move apart after impact");
  assert.ok(
    Math.abs(momentumBefore - (a.radius ** 2 * a.velocity.x + b.radius ** 2 * b.velocity.x)) <
      0.0001,
  );
  assert.ok(a.radius ** 2 * a.velocity.x ** 2 + b.radius ** 2 * b.velocity.x ** 2 < energyBefore);
});

test("separating contacts are not bounced back together", () => {
  const a = body(500, 400, 60, -20);
  const b = body(550, 400, 60, 20);
  resolveFloatieCollisions([a, b]);
  assertSeparated([a, b]);
  assert.equal(a.velocity.x, -20);
  assert.equal(b.velocity.x, 20);
});

test("glancing contact preserves tangential velocity", () => {
  const a = body(500, 400, 60, 100, 30);
  const b = body(550, 400, 60, -100, -15);
  resolveFloatieCollisions([a, b]);
  assertSeparated([a, b]);
  assert.equal(a.velocity.y, 30);
  assert.equal(b.velocity.y, -15);
});

test("coincident three-body contacts separate without NaNs", () => {
  const bodies = [body(500, 400), body(500, 400), body(500, 400)];
  resolveFloatieCollisions(bodies);
  assertSeparated(bodies);
});

test("contacts at a wall do not push floaties outside the pool", () => {
  const bodies = [body(41, 400), body(72, 400), body(105, 400)];
  resolveFloatieCollisions(bodies);
  assertSeparated(bodies);
  for (const movement of bodies) assertClear(movement.pose, [], 1280, 900);
});

test("mobile lane contacts separate vertically while preserving text clearance", () => {
  const zones = [{ left: 48, top: 100, right: 342, bottom: 800 }];
  const bodies = [body(200, 400, 28), body(210, 400, 28), body(220, 400, 24)];
  for (const movement of bodies) {
    movement.resize(390, 844, movement.pose.size);
    movement.setExclusions(zones);
  }
  resolveFloatieCollisions(bodies);
  assertSeparated(bodies);
  for (const movement of bodies) assertClear(movement.pose, zones, 390, 844);
});

test("fast opposing bursts cannot tunnel through each other at low FPS", () => {
  const a = body(500, 400, 24, 10000);
  const b = body(530, 400, 24, -10000);
  for (let frame = 0; frame < 20; frame++) {
    stepFloaties([a, b], 0.05);
    assertSeparated([a, b]);
    assert.ok(a.pose.x < b.pose.x, "bodies never pass through one another");
  }
});

test("collision paths agree at 30, 60, and 120 Hz", () => {
  const results = [30, 60, 120].map((fps) => {
    const bodies = [body(500, 400, 60, 200), body(580, 400, 60, -200)];
    for (let frame = 0; frame < fps * 3; frame++) stepFloaties(bodies, 1 / fps);
    return bodies.map((movement) => movement.pose);
  });
  for (const result of results.slice(1)) {
    for (let i = 0; i < result.length; i++) {
      assert.ok(Math.hypot(result[i].x - results[0][i].x, result[i].y - results[0][i].y) < 0.01);
    }
  }
});

test("repeated three-floatie bursts stay separated and clear of text across viewports", () => {
  for (const [width, height] of [
    [320, 740],
    [390, 844],
    [641, 740],
    [844, 390],
    [1280, 720],
  ]) {
    const columnWidth = Math.min(550, width - (width <= 640 ? 96 : 112));
    const left = (width - columnWidth) / 2;
    const zones = [
      { left: 0, top: 0, right: width, bottom: 92 },
      { left, top: 110, right: width - left, bottom: height - 75 },
    ];
    const bodies = [
      { size: Math.max(28, Math.min(96, (width - 600) * 0.24)), scale: 0.42 },
      { size: Math.max(28, Math.min(80, (width - 600) * 0.2)), scale: 0.5 },
      { size: Math.max(24, Math.min(60, (width - 600) * 0.15)), scale: 0.5 },
    ].map(({ size, scale }) => {
      const movement = createDuckMotion(randomSource(), { x: 0.08, y: 0.45 }, scale);
      movement.resize(width, height, size);
      movement.setExclusions(zones);
      return movement;
    });
    resolveFloatieCollisions(bodies);
    assertSeparated(bodies);
    for (let frame = 0; frame < 1800; frame++) {
      if (frame % 45 === 0) {
        for (const movement of bodies) movement.flee(movement.pose.x, movement.pose.y, false, true);
      }
      stepFloaties(bodies, 1 / 60);
      assertSeparated(bodies);
      for (const movement of bodies) assertClear(movement.pose, zones, width, height);
    }
  }
});

test("new floaties find open water without moving existing bodies", () => {
  for (const width of [390, 1280]) {
    const height = 844;
    const left = (width - Math.min(550, width - 96)) / 2;
    const zones = [{ left, top: 100, right: width - left, bottom: height - 75 }];
    const bodies: ReturnType<typeof body>[] = [];
    for (let i = 0; i < 8; i++) {
      const movement = body(500, 400, width === 390 ? 28 : 60);
      movement.resize(width, height, width === 390 ? 28 : 60);
      movement.setExclusions(zones);
      const before = bodies.map((other) => ({ ...other.pose }));
      assert.ok(placeFloatie(movement, bodies, width, height, zones));
      assert.deepEqual(
        bodies.map((other) => other.pose),
        before,
      );
      bodies.push(movement);
      assertSeparated(bodies);
      assertClear(movement.pose, zones, width, height);
    }
    for (let frame = 0; frame < 1200; frame++) {
      if (frame % 60 === 0) {
        for (const movement of bodies) movement.flee(movement.pose.x, movement.pose.y, false, true);
      }
      stepFloaties(bodies, 1 / 60);
      assertSeparated(bodies);
      for (const movement of bodies) assertClear(movement.pose, zones, width, height);
    }
  }
});

test("spawning fails safely when no open water remains", () => {
  const movement = body(100, 300, 28);
  const existing = body(200, 400, 28);
  const before = { ...existing.pose };
  movement.resize(390, 844, 28);
  const zones = [{ left: 0, top: 0, right: 390, bottom: 844 }];
  movement.setExclusions(zones);
  assert.equal(placeFloatie(movement, [existing], 390, 844, zones), false);
  assert.deepEqual(existing.pose, before);
});

test("wall correction preserves velocity already pointing back into the pool", () => {
  const movement = body(42, 400, 60, 30, 12);
  movement.moveBy(-20, 0);
  assert.equal(movement.velocity.x, 30);
  assert.equal(movement.velocity.y, 12);
  assertClear(movement.pose, [], 1280, 900);
});

test("slow contacts settle without a restitution bounce", () => {
  const a = body(500, 400, 60, 2);
  const b = body(560, 400, 60, -2);
  resolveFloatieCollisions([a, b]);
  assertSeparated([a, b]);
  assert.ok(Math.abs(a.velocity.x - b.velocity.x) < 0.0001);
});

test("resizing does not project a right-lane toy against stale desktop exclusions", () => {
  const movement = createDuckMotion(randomSource(), { x: 0.87, y: 0.5 });
  movement.resize(1024, 1039, 96);
  movement.setExclusions([{ left: 237, right: 787, top: 100, bottom: 1000 }]);
  movement.resize(390, 844, 28);
  const zones = [{ left: 48, right: 342, top: 100, bottom: 800 }];
  movement.setExclusions(zones);
  assert.ok(movement.pose.x > 342, "the toy stays in the right lane after resizing");
  assertClear(movement.pose, zones, 390, 844);
});
