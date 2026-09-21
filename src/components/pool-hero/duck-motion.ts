const TAU = Math.PI * 2;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const MAX_SPEED = 360;
// An entrance is a purposeful swim, quicker than anything the pointer can provoke.
const ENTRANCE_SPEED = 620;
const ARRIVAL_DISTANCE = 6;

export interface DuckPose {
  x: number;
  y: number;
  size: number;
  angle: number;
  speed: number;
}

export interface ExclusionZone {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/** Pixel-space motion, independent of React, the DOM, and the water renderer. */
export function createDuckMotion(
  random = Math.random,
  start = { x: 0.16, y: 0.32 },
  collisionScale = 0.5,
) {
  const pose: DuckPose = { x: 0, y: 0, size: 60, angle: -0.2, speed: 0 };
  let width = 0;
  let height = 0;
  let minX = 0;
  let maxX = 0;
  let minY = 0;
  let maxY = 0;
  let vx = 2;
  let vy = -1;
  let time = 0;
  let cooldown = 0;
  let burst = 0;
  let escapeX = 0;
  let escapeY = 0;
  let acceleration = 0;
  let exclusions: ExclusionZone[] = [];
  // A scripted entrance: the toy swims to `seek`, crossing content it would otherwise avoid.
  let seek: { x: number; y: number } | null = null;
  let held = false;

  const limitSpeed = () => {
    const speed = Math.hypot(vx, vy);
    const limit = seek ? ENTRANCE_SPEED : MAX_SPEED;
    if (speed > limit) {
      vx *= limit / speed;
      vy *= limit / speed;
    }
    pose.speed = Math.hypot(vx, vy);
  };

  const inside = (x: number, y: number, zone: ExclusionZone) =>
    x > zone.left && x < zone.right && y > zone.top && y < zone.bottom;

  const openWaterNear = (point: { x: number; y: number }) => {
    if (!exclusions.some((zone) => inside(point.x, point.y, zone))) return point;
    let nearest: { x: number; y: number; distance: number } | null = null;
    // Project onto the nearest valid edge. This also handles instant anchor jumps,
    // resizes, and paused scenes without letting a sprite obscure readable text.
    const candidates = exclusions.flatMap((zone) => [
      { x: zone.left, y: point.y },
      { x: zone.right, y: point.y },
      { x: point.x, y: zone.top },
      { x: point.x, y: zone.bottom },
    ]);
    for (const x of [minX, maxX]) {
      for (const y of [minY, maxY]) candidates.push({ x, y });
    }
    for (const candidate of candidates) {
      const x = clamp(candidate.x, minX, maxX);
      const y = clamp(candidate.y, minY, maxY);
      if (exclusions.some((zone) => inside(x, y, zone))) continue;
      const distance = Math.hypot(x - point.x, y - point.y);
      if (!nearest || distance < nearest.distance) nearest = { x, y, distance };
    }
    return nearest ?? point;
  };

  const avoidContent = () => {
    // The destination stays in open water; the swimmer itself may cross content to reach it.
    if (seek) {
      seek = openWaterNear(seek);
      return;
    }
    const open = openWaterNear(pose);
    if (pose.x !== open.x) vx = 0;
    if (pose.y !== open.y) vy = 0;
    pose.x = open.x;
    pose.y = open.y;
  };

  const contain = (checkContent = true) => {
    // Contact correction can cross a wall while velocity already points away.
    // Only an incoming velocity should lose energy to a wall impact.
    if ((pose.x < minX && vx < 0) || (pose.x > maxX && vx > 0)) vx *= -0.3;
    if ((pose.y < minY && vy < 0) || (pose.y > maxY && vy > 0)) vy *= -0.3;
    pose.x = clamp(pose.x, minX, maxX);
    pose.y = clamp(pose.y, minY, maxY);
    if (checkContent) avoidContent();
  };

  return {
    pose,
    // The duck's transparent sprite needs a smaller circle than the round toys.
    get radius() {
      return pose.size * collisionScale + 1;
    },
    get velocity() {
      return { x: vx, y: vy };
    },
    get entering() {
      return seek !== null;
    },
    /** Start away from the resting spot and wait there; `depart` begins the swim back to it. */
    enterFrom(x: number, y: number) {
      seek = { x: pose.x, y: pose.y };
      held = true;
      pose.x = x;
      pose.y = y;
      vx = 0;
      vy = 0;
      contain(false);
      pose.speed = 0;
    },
    depart() {
      held = false;
    },
    applyImpulse(x: number, y: number) {
      vx += x;
      vy += y;
      burst = 0;
      limitSpeed();
    },
    moveBy(x: number, y: number) {
      pose.x += x;
      pose.y += y;
      contain();
      limitSpeed();
    },
    setExclusions(zones: ExclusionZone[]) {
      const padding = pose.size * 0.55 + 8;
      exclusions = zones.map((zone) => ({
        left: zone.left - padding,
        right: zone.right + padding,
        top: zone.top - padding,
        bottom: zone.bottom + padding,
      }));
      contain();
    },

    resize(nextWidth: number, nextHeight: number, size: number) {
      pose.x = width ? (pose.x / width) * nextWidth : nextWidth * start.x;
      pose.y = height ? (pose.y / height) * nextHeight : nextHeight * start.y;
      if (seek && width && height) {
        seek = { x: (seek.x / width) * nextWidth, y: (seek.y / height) * nextHeight };
      }
      width = nextWidth;
      height = nextHeight;
      pose.size = size;
      const margin = size * 0.55 + 8;
      minX = Math.min(margin, width * 0.5);
      maxX = Math.max(minX, width - margin);
      minY = Math.min(Math.max(margin, 120), height * 0.5);
      maxY = Math.max(minY, height - Math.max(margin, 80));
      acceleration = clamp(Math.min(width, height) * 1.8, 950, 1550);
      // The layout owner calls setExclusions with fresh rectangles after resize.
      // Projecting against the previous viewport first can move a toy across the pool.
      contain(false);
    },

    flee(pointerX: number, pointerY: number, touch = false, force = false) {
      if (cooldown > 0 || seek) return false;
      const dx = pose.x - pointerX;
      const dy = pose.y - pointerY;
      const radius = Math.max(touch ? 120 : 90, pose.size * 1.3);
      if (!force && dx * dx + dy * dy > radius * radius) return false;

      const away = Math.abs(dx) + Math.abs(dy) < 1 ? random() * TAU : Math.atan2(dy, dx);
      let bestScore = -Infinity;
      // Prefer moving away, but choose open water when the pointer boxes us in.
      for (let i = 0; i < 8; i++) {
        const angle = i < 5 ? away + (random() - 0.5) * 1.9 : random() * TAU;
        const x = Math.cos(angle);
        const y = Math.sin(angle);
        const spaceX = Math.abs(x) < 0.001 ? Infinity : (x > 0 ? maxX - pose.x : minX - pose.x) / x;
        const spaceY = Math.abs(y) < 0.001 ? Infinity : (y > 0 ? maxY - pose.y : minY - pose.y) / y;
        const clearance = Math.min(spaceX, spaceY) / Math.min(width, height);
        const score =
          Math.cos(angle - away) * 0.85 + Math.min(clearance, 0.55) * 2.5 + random() * 0.24;
        if (score > bestScore) {
          bestScore = score;
          escapeX = x;
          escapeY = y;
        }
      }
      burst = 0.26 + random() * 0.09;
      cooldown = 0.5 + random() * 0.18;
      return true;
    },

    step(delta: number) {
      // Small fixed upper-bound steps keep edge steering consistent at 30–120 Hz.
      let remaining = Math.min(delta, 0.05);
      while (remaining > 0 && !held) {
        const dt = Math.min(remaining, 1 / 120);
        remaining -= dt;
        time += dt;
        cooldown = Math.max(0, cooldown - dt);
        let ax = 0;
        let ay = 0;

        if (seek) {
          const dx = seek.x - pose.x;
          const dy = seek.y - pose.y;
          const distance = Math.hypot(dx, dy);
          if (distance < ARRIVAL_DISTANCE) {
            seek = null;
          } else {
            // Ease off near the destination so the toy drifts in rather than braking.
            const cruise = Math.min(ENTRANCE_SPEED, distance * 2.4 + 30);
            ax += ((dx / distance) * cruise - vx) * 7;
            ay += ((dy / distance) * cruise - vy) * 7;
          }
        }

        // Steer gently away before the hard exclusion boundary is reached.
        for (const zone of seek ? [] : exclusions) {
          const nearestX = clamp(pose.x, zone.left, zone.right);
          const nearestY = clamp(pose.y, zone.top, zone.bottom);
          const dx = pose.x - nearestX;
          const dy = pose.y - nearestY;
          const distance = Math.hypot(dx, dy);
          const reach = pose.size * 0.8 + 20;
          if (distance > 0 && distance < reach) {
            const force = (1 - distance / reach) ** 2 * 700;
            ax += (dx / distance) * force;
            ay += (dy / distance) * force;
          }
        }

        if (seek) {
          burst = 0;
        } else if (burst > 0) {
          burst -= dt;
          ax += escapeX * acceleration;
          ay += escapeY * acceleration;
        } else {
          ax += Math.sin(time * 0.31 + 0.7) * 8;
          ay += Math.cos(time * 0.27 + 1.4) * 7;
        }

        const margin = Math.min(pose.size * 1.25, (maxX - minX) * 0.4, (maxY - minY) * 0.4);
        // A destination beside a wall would otherwise be pushed out of reach.
        if (margin > 0 && !seek) {
          const nextX = pose.x + vx * 0.24;
          const nextY = pose.y + vy * 0.24;
          ax +=
            (clamp((minX + margin - nextX) / margin, 0, 1) ** 2 -
              clamp((nextX - maxX + margin) / margin, 0, 1) ** 2) *
            1100;
          ay +=
            (clamp((minY + margin - nextY) / margin, 0, 1) ** 2 -
              clamp((nextY - maxY + margin) / margin, 0, 1) ** 2) *
            1100;
        }

        const drag = Math.exp(-1.7 * dt);
        vx = (vx + ax * dt) * drag;
        vy = (vy + ay * dt) * drag;
        limitSpeed();
        pose.x += vx * dt;
        pose.y += vy * dt;
        contain();
        pose.speed = Math.hypot(vx, vy);

        if (pose.speed > 12) {
          const target = Math.atan2(vy, vx) + Math.PI / 2;
          const turn = Math.atan2(Math.sin(target - pose.angle), Math.cos(target - pose.angle));
          pose.angle += clamp(turn * 5, -3.8, 3.8) * dt;
          pose.angle = Math.atan2(Math.sin(pose.angle), Math.cos(pose.angle));
        }
      }
    },
  };
}
