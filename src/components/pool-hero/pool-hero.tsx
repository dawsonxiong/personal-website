"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createDuckMotion } from "./duck-motion";
import { createWaterRenderer } from "./water-renderer";
import styles from "./pool-hero.module.css";

export function PoolHero({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const duckRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<{ toggle: () => void; nudge: () => void } | null>(null);
  const [mode, setMode] = useState<"loading" | "playing" | "paused" | "fallback">("loading");

  useEffect(() => {
    const canvas = canvasRef.current;
    const duck = duckRef.current;
    const hero = heroRef.current;
    const content = contentRef.current;
    if (!canvas || !duck || !hero || !content) return;

    let renderer = createWaterRenderer(canvas);

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let elapsed = 0;
    let previousTime: number | null = null;
    let inView = true;
    // An explicit play/pause choice can override the system preference for this visit.
    let userMotion: boolean | null = null;
    const motionEnabled = () => userMotion ?? !motion.matches;
    const duckMotion = createDuckMotion();
    const duckPose = duckMotion.pose;
    const ripples = new Float32Array(24);
    let rippleIndex = 0;
    let lastRippleTime = 0;
    let lastRippleX = 0;
    let lastRippleY = 0;
    let pointer: { x: number; y: number } | null = null;

    const render = () => {
      const angle = duckPose.angle + Math.sin(elapsed * 0.63) * 0.04;
      const bob = Math.sin(elapsed * 1.6) * 0.8;
      const scale = 1 + Math.sin(elapsed * 1.3) * 0.008;
      duck.style.transform = `translate3d(${duckPose.x}px, ${duckPose.y + bob}px, 0) translate(-50%, -50%) rotate(${angle}rad) scale(${scale})`;
      renderer?.draw(elapsed, duckPose, ripples);
    };

    const draw = (now: number) => {
      if (previousTime !== null) {
        const delta = Math.min((now - previousTime) / 1000, 0.05);
        elapsed += delta;
        if (pointer) duckMotion.flee(pointer.x, pointer.y);
        duckMotion.step(delta);
        if (
          duckPose.speed > 45 &&
          elapsed - lastRippleTime > 0.09 &&
          Math.hypot(duckPose.x - lastRippleX, duckPose.y - lastRippleY) > duckPose.size * 0.2
        ) {
          const index = (rippleIndex++ % 6) * 4;
          ripples[index] = duckPose.x - Math.sin(duckPose.angle) * duckPose.size * 0.24;
          ripples[index + 1] = duckPose.y + Math.cos(duckPose.angle) * duckPose.size * 0.24;
          ripples[index + 2] = elapsed;
          ripples[index + 3] = Math.min(1, duckPose.speed / 220);
          lastRippleTime = elapsed;
          lastRippleX = duckPose.x;
          lastRippleY = duckPose.y;
        }
      }
      previousTime = now;
      render();
      frame = requestAnimationFrame(draw);
    };

    const updateMotion = () => {
      cancelAnimationFrame(frame);
      previousTime = null;
      pointer = null;
      setMode(renderer ? (motionEnabled() ? "playing" : "paused") : "fallback");
      if (!document.hidden && inView) render();
      if (renderer && motionEnabled() && !document.hidden && inView) {
        frame = requestAnimationFrame(draw);
      }
    };

    const onMotionPreference = () => {
      userMotion = null;
      updateMotion();
    };

    const resize = () => {
      renderer?.resize();
      ripples.fill(0);
      duckMotion.resize(
        canvas.clientWidth,
        canvas.clientHeight,
        duck.offsetWidth,
        content.offsetHeight,
      );
      duck.style.left = "0";
      duck.style.top = "0";
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
        (content.contains(target) || target.closest("button, a, input, textarea, select"))
      ) {
        pointer = null;
        return;
      }
      if (event.pointerType === "touch" && event.type !== "pointerdown") return;
      const rect = hero.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (event.pointerType === "touch") {
        // A tap can emit pointerleave before the next animation frame.
        duckMotion.flee(x, y, true);
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
      ripples.fill(0);
      updateMotion();
    };
    const onContextRestored = () => {
      renderer = createWaterRenderer(canvas);
      resize();
      updateMotion();
    };

    controllerRef.current = {
      toggle() {
        userMotion = !motionEnabled();
        updateMotion();
      },
      nudge() {
        if (!renderer || !motionEnabled()) return;
        pointer = null;
        // A fixed keyboard target offers the same playful burst without chasing focus.
        duckMotion.flee(duckPose.x, duckPose.y, false, true);
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
    visibility.observe(hero);

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    observer.observe(content);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
    hero.addEventListener("pointermove", onPointer, { passive: true });
    hero.addEventListener("pointerdown", onPointer, { passive: true });
    hero.addEventListener("pointerleave", clearPointer);
    hero.addEventListener("pointercancel", clearPointer);
    motion.addEventListener("change", onMotionPreference);
    document.addEventListener("visibilitychange", updateMotion);
    window.addEventListener("resize", resize);
    watchDensity();
    resize();
    updateMotion();

    return () => {
      cancelAnimationFrame(frame);
      controllerRef.current = null;
      observer.disconnect();
      visibility.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      hero.removeEventListener("pointermove", onPointer);
      hero.removeEventListener("pointerdown", onPointer);
      hero.removeEventListener("pointerleave", clearPointer);
      hero.removeEventListener("pointercancel", clearPointer);
      motion.removeEventListener("change", onMotionPreference);
      document.removeEventListener("visibilitychange", updateMotion);
      window.removeEventListener("resize", resize);
      density.removeEventListener("change", onDensityChange);
      renderer?.dispose();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className={styles.hero}
      aria-label="Introduction"
      data-water-ready={mode === "playing" || mode === "paused" ? "" : undefined}
    >
      <canvas ref={canvasRef} className={styles.water} aria-hidden="true" />
      <div ref={duckRef} className={styles.duck} aria-hidden="true">
        <Image
          src="/pool/duck.webp"
          alt=""
          width={384}
          height={384}
          unoptimized
          loading="eager"
          draggable={false}
        />
      </div>
      <div ref={contentRef} className={styles.content}>
        {children}
      </div>
      {(mode === "playing" || mode === "paused") && (
        <div className={styles.controls}>
          <Button
            variant="outline"
            size="icon-lg"
            className={styles.pause}
            aria-label={mode === "playing" ? "Pause animation" : "Play animation"}
            onClick={() => controllerRef.current?.toggle()}
          >
            {mode === "playing" ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          </Button>
          {mode === "playing" && (
            <Button
              variant="outline"
              className={styles.nudge}
              onClick={() => controllerRef.current?.nudge()}
            >
              Nudge the duck
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
