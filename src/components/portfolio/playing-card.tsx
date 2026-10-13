import styles from "./portfolio.module.css";

export type Suit = "♥" | "♦" | "♣" | "♠";
export type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

const SUIT_FILE: Record<Suit, string> = { "♠": "S", "♥": "H", "♦": "D", "♣": "C" };

// Faces live in public/cards as <rank><suit>.webp (e.g. JH.webp, 10H.webp). Only the
// cards the site shows are kept there; add a face before using a new card.
export function PlayingCard({ rank, suit, name }: { rank: Rank; suit: Suit; name: string }) {
  return (
    <span className={styles.playingCard}>
      <img
        className={styles.cardFace}
        src={`/cards/${rank}${SUIT_FILE[suit]}.webp`}
        alt={name}
        draggable={false}
      />
    </span>
  );
}
