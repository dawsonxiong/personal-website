"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { PlayingCard, type Rank, type Suit } from "./playing-card";
import styles from "./portfolio.module.css";

interface Card {
  rank: Rank;
  suit: Suit;
  name: string;
}

// Must match .hole in portfolio.module.css.
const CARD_WIDTH = 88;
const HINT = 8;
// Folds past this finish on their own; releases past COMMIT finish too.
const RELEASE = 26;
const COMMIT = 16;
// How far the card underneath slides out while squeezing.
const SPREAD = 34;
// Fold below which the flap is still fading in (see --flap-alpha in the CSS).
const FADE = 3;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Hole cards lie sideways and face down, the top one offset so the bottom one's corner
// shows. Dragging up squeezes both at once: the near edge folds over and the strip of face
// under it appears, corner indices first. Past halfway the fold unrolls into a full face,
// then the cards swing upright and stay that way.
//
// `--fold` is how much of a card (in its own, unrotated frame) is bent over; the CSS turns
// it into the clip and shift for the back and the flap. Cards sit a quarter turn clockwise,
// so the near edge on screen is a card's right edge.
export function PeelHand({ cards }: { cards: readonly Card[] }) {
  const [up, setUp] = useState(false);
  const stack = useRef<HTMLDivElement>(null);
  const fold = useRef(0);
  const spread = useRef(0);
  const frame = useRef(0);
  const drag = useRef<{ startY: number; moved: boolean } | null>(null);

  const apply = (nextFold: number, nextSpread: number) => {
    fold.current = nextFold;
    spread.current = nextSpread;
    stack.current?.style.setProperty("--fold", `${nextFold}px`);
    stack.current?.style.setProperty("--spread", `${nextSpread}px`);
    stack.current?.style.setProperty("--flap-alpha", `${Math.min(1, nextFold / FADE)}`);
  };

  // Under the pointer the card underneath slides out as far as the fold goes.
  const squeezeTo = (value: number) => apply(value, Math.min(value, SPREAD));

  const animateTo = (
    targetFold: number,
    targetSpread: number,
    duration: number,
    done?: () => void,
  ) => {
    cancelAnimationFrame(frame.current);
    if (prefersReducedMotion()) {
      apply(targetFold, targetSpread);
      done?.();
      return;
    }
    const fromFold = fold.current;
    const fromSpread = spread.current;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      apply(
        fromFold + (targetFold - fromFold) * eased,
        fromSpread + (targetSpread - fromSpread) * eased,
      );
      if (t < 1) frame.current = requestAnimationFrame(tick);
      else done?.();
    };
    frame.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  // Square the stack up while the fold unrolls, then swing upright.
  const complete = () => {
    drag.current = null;
    animateTo(CARD_WIDTH, 0, 520, () => setUp(true));
  };

  // Fold the faces away while swinging back sideways.
  const reset = () => {
    setUp(false);
    animateTo(0, 0, 500);
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!drag.current) return;
    const distance = drag.current.startY - event.clientY;
    if (Math.abs(distance) > 4) drag.current.moved = true;
    const value = Math.min(Math.max(distance / 2, HINT), RELEASE);
    cancelAnimationFrame(frame.current);
    squeezeTo(value);
    if (value >= RELEASE) complete();
  };

  const onPointerEnd = () => {
    if (!drag.current) return;
    const { moved } = drag.current;
    drag.current = null;
    if (!moved || fold.current > COMMIT) complete();
    else animateTo(0, 0, 260);
  };

  return (
    <>
      <div className={styles.cards} data-up={up || undefined} ref={stack}>
        {cards.map((card, index) => (
          <span className={styles.hole} key={card.name} style={{ "--i": index } as CSSProperties}>
            <span className={styles.holeInner}>
              <span className={styles.holeBack} aria-hidden="true" />
              <span className={styles.holeFlap} aria-hidden={!up}>
                <PlayingCard {...card} />
                <span className={styles.holeShade} aria-hidden="true" />
              </span>
            </span>
          </span>
        ))}
        {up ? null : (
          <button
            className={styles.squeeze}
            type="button"
            aria-label="Squeeze your cards"
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              drag.current = { startY: event.clientY, moved: false };
            }}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            onPointerEnter={() => {
              if (!drag.current && fold.current < HINT) animateTo(HINT, HINT, 200);
            }}
            onPointerLeave={() => {
              if (!drag.current && fold.current <= HINT) animateTo(0, 0, 200);
            }}
            onClick={(event) => {
              // Keyboard activation; pointer clicks are handled on pointer up.
              if (event.detail === 0) complete();
            }}
          />
        )}
      </div>
      {/* <button className={styles.reset} type="button" hidden={!up} onClick={reset}>
        Deal again
      </button> */}
    </>
  );
}
