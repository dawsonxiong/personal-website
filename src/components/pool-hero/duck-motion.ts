const TAU = Math.PI * 2;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export interface DuckPose {
  x: number;
  y: number;
  size: number;
  angle: number;
  speed: number;
}

/** Pixel-space motion, independent of React, the DOM, and the water renderer. */
export function createDuckMotion(random = Math.random) {
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

  const contain = () => {
    if (pose.x < minX || pose.x > maxX)
      vx = pose.x < minX ? Math.abs(vx) * 0.3 : -Math.abs(vx) * 0.3;
    if (pose.y < minY || pose.y > maxY)
      vy = pose.y < minY ? Math.abs(vy) * 0.3 : -Math.abs(vy) * 0.3;
    pose.x = clamp(pose.x, minX, maxX);
    pose.y = clamp(pose.y, minY, maxY);
  };

  return {
    pose,
    resize(nextWidth: number, nextHeight: number, size: number, contentBottom: number) {
      pose.x = width ? (pose.x / width) * nextWidth : nextWidth * 0.53;
      pose.y = height ? (pose.y / height) * nextHeight : nextHeight * 0.62;
      width = nextWidth;
      height = nextHeight;
      pose.size = size;
      const margin = size * 0.55 + 16;
      minX = Math.min(margin, width * 0.5);
      maxX = Math.max(minX, width - margin);
      minY = Math.min(Math.max(margin, contentBottom + size * 0.55), height * 0.5);
      maxY = Math.max(minY, height - margin);
      acceleration = clamp(Math.min(width, height) * 1.8, 950, 1550);
      contain();
    },

    flee(pointerX: number, pointerY: number, touch = false, force = false) {
      if (cooldown > 0) return false;
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
      while (remaining > 0) {
        const dt = Math.min(remaining, 1 / 120);
        remaining -= dt;
        time += dt;
        cooldown = Math.max(0, cooldown - dt);
        let ax = 0;
        let ay = 0;

        if (burst > 0) {
          burst -= dt;
          ax = escapeX * acceleration;
          ay = escapeY * acceleration;
        } else {
          ax = Math.sin(time * 0.31 + 0.7) * 8;
          ay = Math.cos(time * 0.27 + 1.4) * 7;
        }

        const margin = Math.min(pose.size * 1.25, (maxX - minX) * 0.4, (maxY - minY) * 0.4);
        if (margin > 0) {
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
