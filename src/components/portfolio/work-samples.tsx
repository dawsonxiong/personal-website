"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, XMarkIcon } from "@/components/icons";
import styles from "./portfolio.module.css";
import { syncScrollEdgeFade } from "./scroll-edge-fade";

export type WorkSample = {
  /** The image, or the poster frame when `video` is set. */
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  fit?: "cover" | "contain";
  /** An MP4 to play in the modal instead of the image. */
  video?: string;
};

export function WorkSamples({ samples }: { samples: WorkSample[] }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const shell = shellRef.current;
    if (!scroller || !shell) return;

    const updateFade = () => {
      syncScrollEdgeFade(scroller, "x", shell, "fadeLeft", "fadeRight");
    };

    updateFade();
    scroller.addEventListener("scroll", updateFade, { passive: true });
    const observer = new ResizeObserver(updateFade);
    observer.observe(scroller);
    for (const child of scroller.children) observer.observe(child);

    return () => {
      scroller.removeEventListener("scroll", updateFade);
      observer.disconnect();
      delete shell.dataset.fadeLeft;
      delete shell.dataset.fadeRight;
    };
  }, [samples]);

  const step = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    const card = scroller?.querySelector<HTMLElement>("[data-fade-item]");
    if (!scroller || !card) return;
    const gap = parseFloat(getComputedStyle(scroller).columnGap) || 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scroller.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <div ref={shellRef} className={styles.workSamplesShell}>
      <div ref={scrollerRef} className={styles.workSamples} aria-label="Selected work">
        {samples.map((sample) => (
          <WorkSampleDialog key={sample.src} sample={sample} />
        ))}
      </div>
      <button
        type="button"
        className={styles.workSamplesArrow}
        data-direction="previous"
        aria-label="Previous work sample"
        onClick={() => step(-1)}
      >
        <ChevronLeftIcon aria-hidden />
      </button>
      <button
        type="button"
        className={styles.workSamplesArrow}
        data-direction="next"
        aria-label="Next work sample"
        onClick={() => step(1)}
      >
        <ChevronRightIcon aria-hidden />
      </button>
    </div>
  );
}

function WorkSampleDialog({ sample }: { sample: WorkSample }) {
  // Focus only returns to the card after a keyboard-driven open. A pointer user who clicks
  // a thumbnail and closes the modal would otherwise be left with a focus ring on the card.
  const openedByKeyboard = useRef(false);

  return (
    <Dialog>
      <DialogTrigger
        className={styles.workSample}
        data-fade-item
        onPointerDown={() => {
          openedByKeyboard.current = false;
        }}
        onKeyDown={() => {
          openedByKeyboard.current = true;
        }}
      >
        {/* The badge is centred on this wrapper, so it tracks the image box, not a height. */}
        <span className={styles.workMedia}>
          <Image
            className={styles.workImage}
            src={sample.src}
            alt={sample.alt}
            width={sample.width}
            height={sample.height}
            sizes="(max-width: 640px) 72vw, 220px"
            data-fit={sample.fit ?? "cover"}
          />
          {sample.video ? (
            // A solid triangle on its own circle: filled play-circle icons cut the triangle out,
            // which let the thumbnail show through.
            <span aria-hidden className={styles.workPlayIcon}>
              <PlayIcon />
            </span>
          ) : null}
        </span>
        <span className={styles.workCaption}>{sample.caption}</span>
      </DialogTrigger>
      <DialogContent
        className={`${styles.workModal} ring-0`}
        // The modal takes the image's shape, so a phone screenshot gets a narrow frame.
        style={{ "--aspect": sample.width / sample.height } as CSSProperties}
        showCloseButton={false}
        finalFocus={() => openedByKeyboard.current}
      >
        <DialogDescription className="sr-only">{sample.alt}</DialogDescription>
        <div className={styles.workModalFrame}>
          {sample.video ? (
            // Muted and looping, so autoplay is allowed and the clip reads as a live preview.
            <video
              // React sets `muted` as a property, not an attribute, which some browsers ignore
              // for autoplay. Set it on the element and start playback here.
              ref={(video) => {
                if (!video) return;
                video.muted = true;
                video.defaultMuted = true;
                void video.play().catch(() => {});
              }}
              className={styles.workModalImage}
              src={sample.video}
              poster={sample.src}
              width={sample.width}
              height={sample.height}
              preload="auto"
              autoPlay
              muted
              loop
              playsInline
              controls
              aria-label={sample.alt}
            />
          ) : (
            <Image
              className={styles.workModalImage}
              src={sample.src}
              alt={sample.alt}
              width={sample.width}
              height={sample.height}
              sizes="(max-width: 900px) 92vw, 860px"
              priority
            />
          )}
        </div>
        <DialogTitle className={styles.workModalCaption}>{sample.caption}</DialogTitle>
        <DialogClose className={styles.workModalClose} aria-label="Close">
          <XMarkIcon aria-hidden />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
