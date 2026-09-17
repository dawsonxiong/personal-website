import type { createDuckMotion } from "./duck-motion";
import type { ExclusionZone } from "./duck-motion";

type Floatie = ReturnType<typeof createDuckMotion>;
const RESTITUTION = 0.45;
const BOUNCE_THRESHOLD = 10;
const CONTACT_TOLERANCE = 0.01;
const SPAWN_GAP = 6;

function isOpenWater(
  body: Floatie,
  others: readonly Floatie[],
  width: number,
  height: number,
  zones: readonly ExclusionZone[],
) {
  const { x, y } = body.pose;
  const radius = body.radius + SPAWN_GAP;
  if (x < radius || x > width - radius || y < radius || y > height - radius) return false;
  if (
    zones.some(
      (zone) =>
        x + radius > zone.left &&
        x - radius < zone.right &&
        y + radius > zone.top &&
        y - radius < zone.bottom,
    )
  )
    return false;
  return !others.some(
    (other) => Math.hypot(x - other.pose.x, y - other.pose.y) < radius + other.radius,
  );
}

/** Seat a dragged body where it was dropped; callers fall back to `placeFloatie`. */
export function placeFloatieAt(
  body: Floatie,
  others: readonly Floatie[],
  width: number,
  height: number,
  zones: readonly ExclusionZone[],
  x: number,
  y: number,
) {
  body.moveBy(x - body.pose.x, y - body.pose.y);
  return isOpenWater(body, others, width, height, zones);
}

/** Find free water before admitting a new body; never displace existing toys to spawn it. */
export function placeFloatie(
  body: Floatie,
  others: readonly Floatie[],
  width: number,
  height: number,
  zones: readonly ExclusionZone[],
) {
  const spacing = Math.max(32, body.radius * 2 + SPAWN_GAP);
  const candidates = [];
  for (const y of [0.3, 0.55, 0.75]) {
    for (const x of [0.86, 0.14]) candidates.push({ x: width * x, y: height * y });
  }
  for (let y = 120; y <= height - 80; y += spacing) {
    for (let x = body.radius + 8; x <= width - body.radius - 8; x += spacing) {
      candidates.push({ x, y });
    }
  }
  for (const candidate of candidates) {
    body.moveBy(candidate.x - body.pose.x, candidate.y - body.pose.y);
    if (isOpenWater(body, others, width, height, zones)) return true;
  }
  return false;
}

/** Resolve contacts after motion and after layout changes, including while paused. */
export function resolveFloatieCollisions(bodies: readonly Floatie[]) {
  // Revisit contacts because a wall or a third floatie may block a correction.
  for (let iteration = 0; iteration < 16; iteration++) {
    let overlapping = false;
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i];
        const b = bodies[j];
        const dx = b.pose.x - a.pose.x;
        const dy = b.pose.y - a.pose.y;
        const distance = Math.hypot(dx, dy);
        const contactDistance = a.radius + b.radius;
        if (distance > contactDistance) continue;

        // A vertical normal also separates coincident bodies in narrow side lanes.
        const nx = distance > 0.0001 ? dx / distance : 0;
        const ny = distance > 0.0001 ? dy / distance : 1;
        const inverseMassA = 1 / (a.radius * a.radius);
        const inverseMassB = 1 / (b.radius * b.radius);
        const inverseMass = inverseMassA + inverseMassB;
        const weightA = inverseMassA / inverseMass;
        const weightB = inverseMassB / inverseMass;
        const velocityA = a.velocity;
        const velocityB = b.velocity;
        const closingSpeed = (velocityB.x - velocityA.x) * nx + (velocityB.y - velocityA.y) * ny;

        // Only approaching bodies bounce; separating contacts must not gain energy.
        if (closingSpeed < 0) {
          // Slow drift should settle into contact instead of chattering.
          const restitution = closingSpeed < -BOUNCE_THRESHOLD ? RESTITUTION : 0;
          const impulse = -(1 + restitution) * closingSpeed;
          a.applyImpulse(-nx * impulse * weightA, -ny * impulse * weightA);
          b.applyImpulse(nx * impulse * weightB, ny * impulse * weightB);
        }

        const penetration = contactDistance - distance;
        if (penetration < CONTACT_TOLERANCE) continue;
        overlapping = true;
        const correction = penetration + CONTACT_TOLERANCE;
        const startAX = a.pose.x;
        const startAY = a.pose.y;
        const startBX = b.pose.x;
        const startBY = b.pose.y;
        a.moveBy(-nx * correction * weightA, -ny * correction * weightA);
        b.moveBy(nx * correction * weightB, ny * correction * weightB);

        // If scenery blocks one toy, give its unused separation to the other.
        const movedA = (startAX - a.pose.x) * nx + (startAY - a.pose.y) * ny;
        const movedB = (b.pose.x - startBX) * nx + (b.pose.y - startBY) * ny;
        const blockedA = Math.max(0, correction * weightA - movedA);
        const blockedB = Math.max(0, correction * weightB - movedB);
        if (blockedA > 0) b.moveBy(nx * blockedA, ny * blockedA);
        if (blockedB > 0) a.moveBy(-nx * blockedB, -ny * blockedB);

        const separatedDistance = Math.hypot(b.pose.x - a.pose.x, b.pose.y - a.pose.y);
        if (separatedDistance <= distance + 0.0001) {
          // Both normal directions are blocked by scenery. Separate along the
          // tangent instead of leaving two toys stuck inside one another.
          a.moveBy(-ny * contactDistance * weightA, nx * contactDistance * weightA);
          b.moveBy(ny * contactDistance * weightB, -nx * contactDistance * weightB);
        }
      }
    }
    if (!overlapping) break;
  }
}

/** Advance every body together so fast bursts cannot skip a collision at low FPS. */
export function stepFloaties(bodies: readonly Floatie[], delta: number) {
  let remaining = Math.min(delta, 0.05);
  while (remaining > 0) {
    const step = Math.min(remaining, 1 / 120);
    remaining -= step;
    for (const body of bodies) body.step(step);
    resolveFloatieCollisions(bodies);
  }
}
