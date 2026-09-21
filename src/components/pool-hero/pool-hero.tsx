"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PoolEditIcon } from "@/components/icons/pool-edit-icon";
import { createDuckMotion } from "./duck-motion";
import { createFrameClock } from "./frame-clock";
import {
  placeFloatie,
  placeFloatieAt,
  resolveFloatieCollisions,
  stepFloaties,
} from "./floatie-physics";
import { floatieCatalog, MAX_FLOATIES, type FloatieKind } from "./floatie-catalog";
import { createWaterEffects, surfacePose } from "./water-effects";
import { createWaterRenderer } from "./water-renderer";
import styles from "./pool-hero.module.css";

type DropPoint = { x: number; y: number };
const DRAG_THRESHOLD = 8;
// Milliseconds on the CSS intro clock, which also times the content reveal in the stylesheets.
const INTRO_DEPART = 700;
const INTRO_MIN_HOLD = 450;
const INTRO_LATEST_START = 500;

function FloatieArt({ kind }: { kind: FloatieKind }) {
  if (kind === "duck")
    return (
      <Image
        src="/pool/duck.webp"
        alt=""
        width={384}
        height={384}
        unoptimized
        loading="eager"
        draggable={false}
      />
    );
  if (kind === "turtle")
    return (
      <>
        <span className={styles.turtleFeet} />
        <span className={styles.turtleHead} />
        <span className={styles.turtleShell} />
      </>
    );
  return (
    <>
      <span className={styles.floatieBody} />
      <span className={styles.floatieGloss} />
    </>
  );
}

export function PoolHero({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const duckRef = useRef<HTMLDivElement>(null);
  const extrasRef = useRef(
    new Map<number, { element: HTMLDivElement; kind: FloatieKind; drop?: DropPoint }>(),
  );
  const pickerRef = useRef<HTMLDetailsElement>(null);
  const nextId = useRef(1);
  const [items, setItems] = useState<{ id: number; kind: FloatieKind; drop?: DropPoint }[]>([]);
  const [announcement, setAnnouncement] = useState("");
  const [spawnError, setSpawnError] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<{
    nudge: () => void;
    syncFloaties: () => void;
  } | null>(null);
  const [mode, setMode] = useState<"loading" | "playing" | "paused" | "fallback">("loading");
  // The duck waits mid-pool ("hold"), then swims home ("swim") while the content eases in.
  const [intro, setIntro] = useState<"pending" | "hold" | "swim" | "done">("pending");
  const [dragKind, setDragKind] = useState<FloatieKind | null>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    kind: FloatieKind;
    pointerId: number;
    startX: number;
    startY: number;
    x: number;
    y: number;
    active: boolean;
  } | null>(null);
  // A drag ends with a click on the tile it started from; that click must not spawn a second toy.
  // Timed rather than flagged, so a keyboard activation later is never swallowed.
  const dragEndRef = useRef(0);

  const poolIsFull = items.length >= MAX_FLOATIES - 1;

  const addFloatie = (kind: FloatieKind, drop?: DropPoint) => {
    const id = nextId.current++;
    setItems((current) =>
      current.length < MAX_FLOATIES - 1 ? [...current, { id, kind, drop }] : current,
    );
  };

  const moveGhost = (x: number, y: number) => {
    if (ghostRef.current) ghostRef.current.style.translate = `${x}px ${y}px`;
  };

  useLayoutEffect(() => {
    const drag = dragRef.current;
    if (dragKind && drag) moveGhost(drag.x, drag.y);
  }, [dragKind]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const duck = duckRef.current;
    const hero = heroRef.current;
    const content = contentRef.current;
    if (!canvas || !duck || !hero || !content) return;

    let renderer = createWaterRenderer(canvas);

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let layoutFrame = 0;
    let elapsed = 0;
    let inView = true;
    const clock = createFrameClock();
    let quality = 1;
    const motionEnabled = () => !motion.matches;
    const duckMotion = createDuckMotion(Math.random, { x: 0.16, y: 0.32 }, 0.42);
    let floaties = [{ element: duck, motion: duckMotion }];
    let bodies = floaties.map(({ motion: movement }) => movement);
    const exclusionElements = Array.from(
      hero.querySelectorAll<HTMLElement>("[data-pool-exclusion]"),
    );
    const waterEffects = createWaterEffects();
    let pointer: { x: number; y: number } | null = null;

    const render = (emitWake = false) => {
      for (const { element, motion: movement } of floaties) {
        const pose = surfacePose(movement.pose, elapsed);
        element.style.transform = `translate3d(${pose.x}px, ${pose.y}px, 0) translate(-50%, -50%) rotate(${pose.angle}rad)`;
      }
      waterEffects.update(bodies, elapsed, emitWake);
      renderer?.draw(elapsed, waterEffects);
    };

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      const delta = clock.next(now);
      if (clock.stopped) {
        renderer?.dispose();
        renderer = null;
        waterEffects.clear();
        updateMotion();
        return;
      }
      if (delta === null) return;
      if (quality !== clock.quality) {
        quality = clock.quality;
        renderer?.setQuality(quality);
        renderer?.resize();
      }
      if (departAt !== null && introClock.currentTime >= departAt) {
        departAt = null;
        duckMotion.depart();
        setIntro("swim");
      }
      if (delta > 0) {
        elapsed += delta;
        for (const { motion: movement } of floaties) {
          if (pointer) movement.flee(pointer.x, pointer.y);
        }
        stepFloaties(bodies, delta);
      }
      render(delta > 0);
    };

    const updateMotion = () => {
      cancelAnimationFrame(frame);
      clock.reset();
      pointer = null;
      setMode(renderer ? (motionEnabled() ? "playing" : "paused") : "fallback");
      if (!document.hidden && inView) render();
      if (renderer && motionEnabled() && !document.hidden && inView) {
        frame = requestAnimationFrame(draw);
      }
    };

    const readExclusions = () =>
      exclusionElements
        .filter((element) => {
          // Closed details can retain nonzero descendant rectangles. Only the
          // disclosure itself occupies water while its panel is hidden.
          const closedPicker = element.closest("details:not([open])");
          return !closedPicker || element === closedPicker;
        })
        .map((element) => element.getBoundingClientRect())
        .filter((rect) => rect.width > 0 && rect.height > 0);

    const measureExclusions = () => {
      const zones = readExclusions();
      for (const { motion: movement } of floaties) movement.setExclusions(zones);
      resolveFloatieCollisions(bodies);
    };

    const onLayout = () => {
      cancelAnimationFrame(layoutFrame);
      layoutFrame = requestAnimationFrame(() => {
        measureExclusions();
        if (!document.hidden && inView) render();
      });
    };

    const resize = () => {
      renderer?.resize();
      waterEffects.clear();
      for (const { element, motion: movement } of floaties) {
        movement.resize(canvas.clientWidth, canvas.clientHeight, element.offsetWidth);
        element.style.left = "0";
        element.style.top = "0";
      }
      measureExclusions();
      if (!document.hidden && inView) render();
    };

    let density: MediaQueryList;
    const watchDensity = () => {
      density = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      density.addEventListener("change", onDensityChange, { once: true });
    };
    const onDensityChange = () => {
      resize();
      watchDensity();
    };

    const onPointer = (event: PointerEvent) => {
      if (!renderer || !motionEnabled()) return;
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest("[data-pool-exclusion], button, a, input, textarea, select, summary")
      ) {
        pointer = null;
        return;
      }
      if (event.pointerType === "touch" && event.type !== "pointerdown") return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (event.pointerType === "touch") {
        // A tap can emit pointerleave before the next animation frame.
        for (const { motion: movement } of floaties) movement.flee(x, y, true);
        pointer = null;
      } else {
        pointer = { x, y };
      }
    };
    const clearPointer = () => {
      pointer = null;
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      renderer?.dispose();
      renderer = null;
      waterEffects.clear();
      updateMotion();
    };
    const onContextRestored = () => {
      renderer = createWaterRenderer(canvas);
      renderer?.setQuality(quality);
      resize();
      updateMotion();
    };

    controllerRef.current = {
      syncFloaties() {
        const liveElements = new Set([...extrasRef.current.values()].map(({ element }) => element));
        const remaining = floaties.filter(
          ({ element }) => element === duck || liveElements.has(element),
        );
        if (remaining.length !== floaties.length) waterEffects.clear();
        floaties = remaining;
        bodies = floaties.map(({ motion: movement }) => movement);
        const zones = readExclusions();
        for (const [id, { element, kind, drop }] of extrasRef.current) {
          if (floaties.some((floatie) => floatie.element === element)) continue;
          const definition = floatieCatalog.find((item) => item.kind === kind)!;
          const movement = createDuckMotion(
            Math.random,
            { x: 0.86, y: 0.3 },
            definition.collisionScale,
          );
          movement.resize(canvas.clientWidth, canvas.clientHeight, element.offsetWidth);
          movement.setExclusions(zones);
          const dropped =
            drop !== undefined &&
            placeFloatieAt(
              movement,
              bodies,
              canvas.clientWidth,
              canvas.clientHeight,
              zones,
              drop.x,
              drop.y,
            );
          if (
            !dropped &&
            !placeFloatie(movement, bodies, canvas.clientWidth, canvas.clientHeight, zones)
          ) {
            setItems((current) => current.filter((item) => item.id !== id));
            setAnnouncement("No open water here. Clear the extras to make room.");
            setSpawnError("No open water here. Clear the extras to make room.");
            continue;
          }
          element.style.left = "0";
          element.style.top = "0";
          floaties.push({ element, motion: movement });
          bodies.push(movement);
          setSpawnError("");
          setAnnouncement(`${definition.label} added. ${bodies.length} floaties in the pool.`);
        }
        render();
        for (const { element } of floaties) element.style.visibility = "visible";
      },
      nudge() {
        if (!renderer || !motionEnabled()) return;
        pointer = null;
        // A fixed keyboard target offers the same playful burst without chasing focus.
        for (const { motion: movement } of floaties) {
          movement.flee(movement.pose.x, movement.pose.y, false, true);
        }
      },
    };

    const visibility = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio > 0;
        if (inView === visible) return;
        inView = visible;
        updateMotion();
      },
      { threshold: [0, 0.001] },
    );
    // The canvas sits in a position: fixed scene, so it never leaves the viewport.
    // The hero itself is in normal flow and can.
    visibility.observe(hero);

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    observer.observe(content);
    for (const element of exclusionElements) observer.observe(element);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
    hero.addEventListener("pointermove", onPointer, { passive: true });
    hero.addEventListener("pointerdown", onPointer, { passive: true });
    hero.addEventListener("pointerleave", clearPointer);
    hero.addEventListener("pointercancel", clearPointer);
    motion.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateMotion);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onLayout, { passive: true });
    const picker = pickerRef.current;
    picker?.addEventListener("toggle", onLayout);
    const closePicker = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !pickerRef.current?.contains(event.target) &&
        pickerRef.current
      )
        pickerRef.current.open = false;
    };
    document.addEventListener("pointerdown", closePicker);
    watchDensity();
    resize();

    // The reveal runs on a CSS clock, so content still appears if this script never does.
    // The duck joins in only when it can start on time; otherwise it simply rests at home.
    const introClock = {
      animation: renderer && motionEnabled() ? hero.getAnimations()[0] : undefined,
      get currentTime() {
        return Number(this.animation?.currentTime ?? Infinity);
      },
    };
    let departAt: number | null = null;
    if (introClock.currentTime < INTRO_LATEST_START) {
      duckMotion.enterFrom(canvas.clientWidth / 2, canvas.clientHeight / 2);
      departAt = Math.max(INTRO_DEPART, introClock.currentTime + INTRO_MIN_HOLD);
      setIntro("hold");
    } else {
      setIntro("done");
    }
    const onIntroEnd = (event: AnimationEvent) => {
      if (event.target !== hero) return;
      setIntro("done");
      // The content has settled out of its entrance transforms; measure where it really is.
      onLayout();
    };
    hero.addEventListener("animationend", onIntroEnd);
    updateMotion();

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(layoutFrame);
      controllerRef.current = null;
      observer.disconnect();
      visibility.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      hero.removeEventListener("animationend", onIntroEnd);
      hero.removeEventListener("pointermove", onPointer);
      hero.removeEventListener("pointerdown", onPointer);
      hero.removeEventListener("pointerleave", clearPointer);
      hero.removeEventListener("pointercancel", clearPointer);
      motion.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateMotion);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onLayout);
      picker?.removeEventListener("toggle", onLayout);
      document.removeEventListener("pointerdown", closePicker);
      density.removeEventListener("change", onDensityChange);
      renderer?.dispose();
    };
  }, []);

  useEffect(() => {
    controllerRef.current?.syncFloaties();
  }, [items]);

  return (
    <div
      ref={heroRef}
      className={styles.hero}
      data-intro={intro === "done" ? undefined : intro}
      data-water-ready={mode === "playing" || mode === "paused" ? "" : undefined}
    >
      <div className={styles.scene} aria-hidden="true">
        <canvas ref={canvasRef} className={styles.water} />
        <div ref={duckRef} className={styles.duck} data-floatie="duck">
          <FloatieArt kind="duck" />
        </div>
        {items.map(({ id, kind, drop }) => (
          <div
            key={id}
            data-floatie={kind}
            className={`${styles.floatie} ${styles[kind]} ${styles.spawned}`}
            ref={(element) => {
              if (element) extrasRef.current.set(id, { element, kind, drop });
              else extrasRef.current.delete(id);
            }}
          >
            <FloatieArt kind={kind} />
          </div>
        ))}
      </div>
      {dragKind && (
        <div
          ref={ghostRef}
          className={`${styles.floatie} ${styles[dragKind]} ${styles.dragGhost}`}
          aria-hidden="true"
        >
          <FloatieArt kind={dragKind} />
        </div>
      )}
      <div ref={contentRef} className={styles.content}>
        {children}
      </div>
      <div
        className={styles.controls}
        data-pool-exclusion
        hidden={mode !== "playing" && mode !== "paused"}
      >
        <details
          ref={pickerRef}
          className={styles.picker}
          data-pool-exclusion
          onKeyDown={(event) => {
            if (event.key === "Escape" && pickerRef.current?.open) {
              pickerRef.current.open = false;
              pickerRef.current.querySelector("summary")?.focus();
              event.preventDefault();
            }
          }}
        >
          <summary className={styles.addButton} aria-label="Edit the pool" title="Edit the pool">
            <PoolEditIcon className={styles.controlIcon} />
          </summary>
          <div className={styles.pickerPanel} data-pool-exclusion>
            <div className={styles.pickerHeading}>Add to the pool</div>
            <div className={styles.pickerGrid}>
              {floatieCatalog.map(({ kind, label }) => (
                <button
                  key={kind}
                  type="button"
                  disabled={poolIsFull}
                  aria-label={label}
                  draggable={false}
                  // A native drag would swallow the pointer stream this gesture runs on.
                  onDragStart={(event) => event.preventDefault()}
                  onPointerDown={(event) => {
                    if (poolIsFull || (event.pointerType === "mouse" && event.button !== 0)) return;
                    dragRef.current = {
                      kind,
                      pointerId: event.pointerId,
                      startX: event.clientX,
                      startY: event.clientY,
                      x: event.clientX,
                      y: event.clientY,
                      active: false,
                    };
                    event.currentTarget.setPointerCapture(event.pointerId);
                  }}
                  onPointerMove={(event) => {
                    const drag = dragRef.current;
                    if (!drag || drag.pointerId !== event.pointerId) return;
                    drag.x = event.clientX;
                    drag.y = event.clientY;
                    if (!drag.active) {
                      const travelled = Math.hypot(
                        event.clientX - drag.startX,
                        event.clientY - drag.startY,
                      );
                      if (travelled < DRAG_THRESHOLD) return;
                      drag.active = true;
                      setDragKind(drag.kind);
                      return;
                    }
                    moveGhost(event.clientX, event.clientY);
                  }}
                  onPointerUp={(event) => {
                    const drag = dragRef.current;
                    dragRef.current = null;
                    if (!drag || drag.pointerId !== event.pointerId) return;
                    if (!drag.active) return;
                    dragEndRef.current = performance.now();
                    setDragKind(null);
                    const rect = canvasRef.current?.getBoundingClientRect();
                    addFloatie(
                      drag.kind,
                      rect && {
                        x: event.clientX - rect.left,
                        y: event.clientY - rect.top,
                      },
                    );
                  }}
                  onPointerCancel={() => {
                    dragRef.current = null;
                    setDragKind(null);
                  }}
                  onClick={() => {
                    if (performance.now() - dragEndRef.current < 300) return;
                    addFloatie(kind);
                  }}
                >
                  <span className={`${styles[kind]} ${styles.preview}`} aria-hidden="true">
                    <FloatieArt kind={kind} />
                  </span>
                </button>
              ))}
            </div>
            {(spawnError || poolIsFull) && (
              <p className={styles.pickerHint}>{spawnError || "Pool’s full!"}</p>
            )}
            <button
              className={styles.clearButton}
              type="button"
              disabled={items.length === 0}
              onClick={() => {
                setItems([]);
                setSpawnError("");
                setAnnouncement("Extras cleared. Just the duck again.");
              }}
            >
              Clear
            </button>
          </div>
        </details>
        {mode === "playing" && (
          <Button
            variant="outline"
            className={styles.nudge}
            onClick={() => controllerRef.current?.nudge()}
          >
            Nudge the floaties
          </Button>
        )}
      </div>
      <p role="status" className={styles.srOnly}>
        {announcement}
      </p>
    </div>
  );
}
