import styles from "./portfolio.module.css";

export type Suit = "♥" | "♦" | "♣" | "♠";
export type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

// Standard pip positions as [x, y] percentages of the pip area.
// Pips below the middle are drawn upside down, like a real deck.
const L = 0;
const C = 50;
const R = 100;
const sides = (...rows: number[]) => rows.flatMap((y) => [[L, y] as const, [R, y] as const]);

const pips: Partial<Record<Rank, readonly (readonly [number, number])[]>> = {
  "2": [
    [C, 0],
    [C, 100],
  ],
  "3": [
    [C, 0],
    [C, 50],
    [C, 100],
  ],
  "4": sides(0, 100),
  "5": [...sides(0, 100), [C, 50]],
  "6": sides(0, 50, 100),
  "7": [...sides(0, 50, 100), [C, 25]],
  "8": [...sides(0, 50, 100), [C, 25], [C, 75]],
  "9": [...sides(0, 33.3, 66.7, 100), [C, 50]],
  "10": [...sides(0, 33.3, 66.7, 100), [C, 16.7], [C, 83.3]],
};

const RED = "#d3222f";
const BLUE = "#2b479d";
const GOLD = "#e0ad45";
const GOLD_DARK = "#b98a2c";

// Court jack drawn as one half, then repeated upside down. The diagonal sash sits
// over the seam so the two halves read as a single figure.
function JackHalf({ suit }: { suit: Suit }) {
  return (
    <g>
      {/* halberd */}
      <rect x="44" y="2" width="1.6" height="43" fill={GOLD_DARK} />
      <path d="M44 3 L35.5 9.5 L44 17 Z" fill={GOLD} stroke={GOLD_DARK} strokeWidth="0.5" />
      {/* hat */}
      <rect x="17" y="1" width="16" height="7.5" fill={RED} />
      <rect x="17" y="6.2" width="16" height="2.3" fill="#a81824" />
      {/* hair and face */}
      <path d="M16 8.5 H24 V22 C19 22 15.5 19 16 8.5 Z" fill={GOLD_DARK} />
      <path d="M21 8.5 H33 V15 L35 17.5 L33 18.5 V22 C33 24 30 25 27 25 H21 Z" fill={GOLD} />
      <path d="M29 12.2 h2.6" stroke="#6b4a12" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M29.5 21 h2.4" stroke="#6b4a12" strokeWidth="0.8" strokeLinecap="round" />
      {/* collar and shoulders */}
      <path d="M13 27 L25 23 L37 27 L33 33 H17 Z" fill={BLUE} />
      <path d="M3 45 V36 C3 29 10 26 17 27 L25 33 L33 27 C40 26 47 29 47 36 V45 Z" fill={RED} />
      <path d="M3 45 V37 C6 33 10 32 13 33 L9 45 Z" fill="#a81824" />
      <path d="M17 27 L25 33 L33 27" fill="none" stroke={GOLD} strokeWidth="1.2" />
      <text x="9.5" y="13" fontSize="11" textAnchor="middle" fill={RED}>
        {suit}
      </text>
    </g>
  );
}

function JackArt({ suit }: { suit: Suit }) {
  return (
    <svg className={styles.cardArt} viewBox="0 0 50 90" aria-hidden="true">
      <rect x="0.5" y="0.5" width="49" height="89" fill="#fff" stroke="#9aa0a8" />
      <JackHalf suit={suit} />
      <g transform="rotate(180 25 45)">
        <JackHalf suit={suit} />
      </g>
      {/* sash */}
      <clipPath id="jack-frame">
        <rect x="0.5" y="0.5" width="49" height="89" />
      </clipPath>
      <g clipPath="url(#jack-frame)">
        <g transform="rotate(-24 25 45)">
          <rect x="-4" y="35" width="58" height="20" fill={BLUE} stroke={GOLD} strokeWidth="1.4" />
          <rect
            x="15.5"
            y="37.5"
            width="19"
            height="15"
            fill={RED}
            stroke={GOLD}
            strokeWidth="1.2"
          />
          <rect
            x="18.5"
            y="40.2"
            width="13"
            height="9.6"
            fill="none"
            stroke={GOLD}
            strokeWidth="0.6"
          />
          {[22, 25, 28].map((x) => (
            <circle key={x} cx={x} cy="45" r="0.9" fill={GOLD} />
          ))}
          <circle cx="5" cy="45" r="2.2" fill={RED} stroke={GOLD} strokeWidth="0.7" />
          <circle cx="45" cy="45" r="2.2" fill={RED} stroke={GOLD} strokeWidth="0.7" />
        </g>
      </g>
      <rect x="0.5" y="0.5" width="49" height="89" fill="none" stroke="#9aa0a8" />
    </svg>
  );
}

function Index({ rank, suit, flipped }: { rank: Rank; suit: Suit; flipped?: boolean }) {
  return (
    <span className={styles.cardIndex} data-flipped={flipped || undefined}>
      <span className={styles.cardRank}>{rank}</span>
      <span className={styles.cardIndexSuit}>{suit}</span>
    </span>
  );
}

export function PlayingCard({ rank, suit, name }: { rank: Rank; suit: Suit; name: string }) {
  const layout = pips[rank];

  return (
    <span
      className={styles.playingCard}
      data-color={suit === "♥" || suit === "♦" ? "red" : "black"}
      role="img"
      aria-label={name}
    >
      <span className={styles.cardFace} aria-hidden="true">
        <Index rank={rank} suit={suit} />
        <Index rank={rank} suit={suit} flipped />
        {layout ? (
          <span className={styles.cardPips}>
            {layout.map(([x, y]) => (
              <span
                className={styles.cardPip}
                data-flipped={y > 50 || undefined}
                key={`${x}-${y}`}
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {suit}
              </span>
            ))}
          </span>
        ) : rank === "A" ? (
          <span className={styles.cardAce}>{suit}</span>
        ) : rank === "J" ? (
          <JackArt suit={suit} />
        ) : (
          <span className={styles.cardCourt}>
            <span className={styles.cardCourtHalf}>
              <span>{rank}</span>
              <span>{suit}</span>
            </span>
            <span className={styles.cardCourtHalf} data-flipped>
              <span>{rank}</span>
              <span>{suit}</span>
            </span>
          </span>
        )}
      </span>
    </span>
  );
}
