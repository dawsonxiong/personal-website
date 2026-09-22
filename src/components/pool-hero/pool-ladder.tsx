import styles from "./pool-hero.module.css";

// Each rail: a single hump where the handrail loops over the coping, then a straight run down
// into the water. Both bow the same way, as seen from slightly in front of the ladder.
const ELBOW = { top: { x: 186, y: 46 }, bottom: { x: 186, y: 126 } };
const END = { top: { x: 44, y: 46 }, bottom: { x: 44, y: 126 } };
const TOP_RAIL = `M 240 48 C 224 36, 204 42.5, ${ELBOW.top.x} ${ELBOW.top.y} L ${END.top.x} ${END.top.y}`;
const BOTTOM_RAIL = `M 240 128 C 224 116, 204 124.5, ${ELBOW.bottom.x} ${ELBOW.bottom.y} L ${END.bottom.x} ${END.bottom.y}`;
const RUNG_XS = [158, 124, 90, 56];
const RUNG_HALF = 7;
const RUNG_LEAN = 3;
// The art is cropped here so the arch runs off the right edge of the viewport.
const CROP = 172;

function railY(rail: "top" | "bottom", x: number) {
  const from = ELBOW[rail];
  const to = END[rail];
  return from.y + ((from.x - x) * (to.y - from.y)) / (from.x - to.x);
}

// A tread seen from above and slightly in front: a slanted bar between the rails.
function tread(x: number, inset = 0) {
  const top = railY("top", x) + 3;
  const bottom = railY("bottom", x) - 3;
  const half = RUNG_HALF - inset;
  return `M ${x - half - RUNG_LEAN} ${top} L ${x + half - RUNG_LEAN} ${top} L ${x + half} ${bottom} L ${x - half} ${bottom} Z`;
}

// A pool ladder seen from above at a slight angle: two handrails come in from the deck at the
// right edge, arch over the coping, then descend into the water where the treads sit. Shaded
// like the floaties: pale, lit from the upper left, with a soft contact shadow from CSS.
export function PoolLadder() {
  return (
    <svg
      className={styles.ladder}
      viewBox={`0 0 ${CROP} 180`}
      fill="none"
      shapeRendering="geometricPrecision"
      data-pool-exclusion
    >
      <defs>
        <linearGradient id="pool-ladder-rail" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b7c8d6" />
          <stop offset="0.3" stopColor="#fbfdfe" />
          <stop offset="0.6" stopColor="#e3ecf3" />
          <stop offset="1" stopColor="#9db1c3" />
        </linearGradient>
        <linearGradient id="pool-ladder-tread" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b9cddf" />
          <stop offset="0.3" stopColor="#fbfdfe" />
          <stop offset="0.65" stopColor="#e6eff6" />
          <stop offset="1" stopColor="#a6bccf" />
        </linearGradient>
      </defs>

      {/* Treads, under water: slightly translucent so the pool shows through. */}
      <g opacity="0.9">
        {RUNG_XS.map((x) => (
          <g key={x}>
            <path d={tread(x)} fill="url(#pool-ladder-tread)" />
            <path d={tread(x, 5.5)} fill="#fff" opacity="0.7" transform="translate(-3.5 0)" />
          </g>
        ))}
      </g>

      {/* Rails, with a soft highlight along the lit edge. */}
      <g strokeLinecap="round">
        <path d={TOP_RAIL} stroke="url(#pool-ladder-rail)" strokeWidth="9" />
        <path d={BOTTOM_RAIL} stroke="url(#pool-ladder-rail)" strokeWidth="9" />
        <path
          d={TOP_RAIL}
          stroke="#fff"
          strokeWidth="2"
          opacity="0.8"
          transform="translate(0 -2)"
        />
        <path
          d={BOTTOM_RAIL}
          stroke="#fff"
          strokeWidth="2"
          opacity="0.8"
          transform="translate(0 -2)"
        />
      </g>
    </svg>
  );
}
