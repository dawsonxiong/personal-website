"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { PlayingCard, type Rank, type Suit } from "./playing-card";
import styles from "./portfolio.module.css";

interface Card {
  rank: Rank;
  suit: Suit;
  name: string;
}

interface Spring {
  value: number;
  velocity: number;
  target: number;
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
// Fold past which the crease shadow fades out, so it's gone by the time the card is over.
const SHADE_FADE = 50;
// The swing upright starts once the fold is this far through, so the two read as one motion.
const SWING = 0.8 * CARD_WIDTH;
// Critically damped (damping = 2√stiffness): eases in, never overshoots.
const STIFFNESS = 200;
const DAMPING = 2 * Math.sqrt(STIFFNESS);
const STEP = 1 / 240;
// How far ahead a release looks when deciding whether a flick finishes the fold.
const PROJECT = 0.12;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const spring = (value: number): Spring => ({ value, velocity: 0, target: value });

// Hole cards lie sideways and face down, the top one offset so the bottom one's corner
// shows. Dragging up squeezes both at once: the near edge folds over and the strip of face
// under it appears, corner indices first. Past halfway the fold unrolls into a full face,
// then the cards swing upright and stay that way.
//
// `--fold` is how much of a card (in its own, unrotated frame) is bent over; the CSS turns
// it into the clip and shift for the back and the flap. Cards sit a quarter turn clockwise,
// so the near edge on screen is a card's right edge.
//
// Fold and spread run on springs rather than fixed-length tweens, so letting go, hovering
// or finishing mid-drag carries on at the speed things were already moving.
export function PeelHand({ cards }: { cards: readonly Card[] }) {
  const [up, setUp] = useState(false);
  const [flat, setFlat] = useState(false);
  const stack = useRef<HTMLDivElement>(null);
  const fold = useRef(spring(0));
  const spread = useRef(spring(0));
  const frame = useRef(0);
  const settle = useRef<{ swing: boolean; done?: () => void }>({ swing: false });
  const drag = useRef<{
    startY: number;
    moved: boolean;
    samples: { time: number; fold: number }[];
  } | null>(null);

  const apply = () => {
    const value = fold.current.value;
    stack.current?.style.setProperty("--fold", `${value}px`);
    stack.current?.style.setProperty("--spread", `${spread.current.value}px`);
    stack.current?.style.setProperty("--flap-alpha", `${Math.min(1, value / FADE)}`);
    stack.current?.style.setProperty(
      "--shade-alpha",
      `${Math.max(0, 1 - Math.max(0, value - SHADE_FADE) / (CARD_WIDTH - SHADE_FADE))}`,
    );
  };

  const settleTo = (targetFold: number, targetSpread: number, swing = false, done?: () => void) => {
    cancelAnimationFrame(frame.current);
    fold.current.target = targetFold;
    spread.current.target = targetSpread;
    settle.current = { swing, done };
    if (prefersReducedMotion()) {
      for (const s of [fold.current, spread.current]) Object.assign(s, spring(s.target));
      apply();
      if (swing) setUp(true);
      done?.();
      return;
    }
    let last = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min(0.05, (now - last) / 1000);
      last = now;
      for (let t = 0; t < elapsed; t += STEP) {
        const dt = Math.min(STEP, elapsed - t);
        for (const s of [fold.current, spread.current]) {
          s.velocity += (STIFFNESS * (s.target - s.value) - DAMPING * s.velocity) * dt;
          s.value += s.velocity * dt;
        }
      }
      if (settle.current.swing && fold.current.value >= SWING) {
        settle.current.swing = false;
        setUp(true);
      }
      const resting = [fold.current, spread.current].every(
        (s) => Math.abs(s.target - s.value) < 0.05 && Math.abs(s.velocity) < 0.05,
      );
      if (resting) {
        for (const s of [fold.current, spread.current]) Object.assign(s, spring(s.target));
      }
      apply();
      if (resting) settle.current.done?.();
      else frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  // Square the stack up while the fold unrolls, swinging upright near the end.
  const complete = (velocity = 0) => {
    drag.current = null;
    fold.current.velocity = Math.max(fold.current.velocity, velocity);
    settleTo(CARD_WIDTH, 0, true, () => setFlat(true));
  };

  // Fold speed over the last few pointer moves, in px/s.
  const dragVelocity = () => {
    const samples = drag.current?.samples ?? [];
    const first = samples[0];
    const last = samples.at(-1);
    if (!first || !last || last.time <= first.time) return 0;
    return ((last.fold - first.fold) / (last.time - first.time)) * 1000;
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!drag.current) return;
    const distance = drag.current.startY - event.clientY;
    if (Math.abs(distance) > 4) drag.current.moved = true;
    const value = Math.min(Math.max(distance / 2, HINT), RELEASE);
    const now = performance.now();
    const { samples } = drag.current;
    samples.push({ time: now, fold: value });
    while (samples.length > 2 && now - samples[0].time > 90) samples.shift();
    const velocity = dragVelocity();
    cancelAnimationFrame(frame.current);
    fold.current = { value, velocity, target: value };
    spread.current = { value: Math.min(value, SPREAD), velocity, target: Math.min(value, SPREAD) };
    apply();
    if (value >= RELEASE) complete(velocity);
  };

  const onPointerEnd = () => {
    if (!drag.current) return;
    const { moved } = drag.current;
    const velocity = dragVelocity();
    drag.current = null;
    if (!moved || fold.current.value + Math.max(0, velocity) * PROJECT > COMMIT) complete(velocity);
    else settleTo(0, 0);
  };

  return (
    <div
      className={styles.cards}
      data-up={up || undefined}
      data-flat={flat || undefined}
      ref={stack}
    >
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
            drag.current = { startY: event.clientY, moved: false, samples: [] };
          }}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onPointerEnter={() => {
            if (!drag.current && fold.current.value < HINT) settleTo(HINT, HINT);
          }}
          onPointerLeave={() => {
            if (!drag.current && fold.current.value <= HINT) settleTo(0, 0);
          }}
          onClick={(event) => {
            // Keyboard activation; pointer clicks are handled on pointer up.
            if (event.detail === 0) complete();
          }}
        />
      )}
    </div>
  );
}
