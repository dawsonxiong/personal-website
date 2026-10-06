"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type Ref } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
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
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // One modal per gallery, so the arrows can step through its samples. `index` outlives
  // `open` so the closing fade still shows the last sample.
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  // Focus only returns to the card after a keyboard-driven open. A pointer user who clicks
  // a thumbnail and closes the modal would otherwise be left with a focus ring on the card.
  const openedByKeyboard = useRef(false);

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

  const lastIndex = samples.length - 1;
  const canPage = lastIndex > 0;
  // Stops at the ends: the first sample has no previous arrow, the last no next arrow.
  const page = (direction: -1 | 1) => {
    setIndex((current) => Math.min(lastIndex, Math.max(0, current + direction)));
  };
  const previousArrowRef = useRef<HTMLButtonElement>(null);
  const nextArrowRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open || !canPage) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key === "ArrowLeft") page(-1);
      else if (event.key === "ArrowRight") page(1);
      else return;
      event.preventDefault();
    };
    // Capture, so the arrows page even when a video's controls have focus instead of seeking.
    document.addEventListener("keydown", onKeyDown, { capture: true });
    return () => document.removeEventListener("keydown", onKeyDown, { capture: true });
  });

  // Keep the open sample's card in view behind the modal, so closing lands on it.
  useEffect(() => {
    const scroller = scrollerRef.current;
    const card = cardRefs.current[index];
    if (!open || !scroller || !card) return;
    const view = scroller.getBoundingClientRect();
    const box = card.getBoundingClientRect();
    if (box.left < view.left) scroller.scrollBy({ left: box.left - view.left });
    else if (box.right > view.right) scroller.scrollBy({ left: box.right - view.right });
  }, [open, index]);

  const sample = samples[index];

  return (
    <div ref={shellRef} className={styles.workSamplesShell}>
      <div ref={scrollerRef} className={styles.workSamples} aria-label="Selected work">
        {samples.map((sample, i) => (
          <WorkSampleCard
            key={sample.src}
            ref={(card) => {
              cardRefs.current[i] = card;
            }}
            sample={sample}
            onOpen={(byKeyboard) => {
              openedByKeyboard.current = byKeyboard;
              setIndex(i);
              setOpen(true);
            }}
          />
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
      {sample ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            className={`${styles.workModal} ring-0`}
            // The modal takes the image's shape, so a phone screenshot gets a narrow frame.
            style={{ "--aspect": sample.width / sample.height } as CSSProperties}
            showCloseButton={false}
            finalFocus={() => (openedByKeyboard.current ? cardRefs.current[index] : false)}
          >
            <DialogDescription className="sr-only">{sample.alt}</DialogDescription>
            <div className={styles.workModalFrame}>
              <WorkSampleMedia key={sample.src} sample={sample} />
              {/* An arrow that is about to disappear hands focus to the other one. */}
              {index > 0 ? (
                <button
                  ref={previousArrowRef}
                  type="button"
                  className={styles.workModalArrow}
                  data-direction="previous"
                  aria-label="Previous image"
                  onClick={() => {
                    if (index === 1) nextArrowRef.current?.focus();
                    page(-1);
                  }}
                >
                  <ChevronLeftIcon aria-hidden />
                </button>
              ) : null}
              {index < lastIndex ? (
                <button
                  ref={nextArrowRef}
                  type="button"
                  className={styles.workModalArrow}
                  data-direction="next"
                  aria-label="Next image"
                  onClick={() => {
                    if (index === lastIndex - 1) previousArrowRef.current?.focus();
                    page(1);
                  }}
                >
                  <ChevronRightIcon aria-hidden />
                </button>
              ) : null}
            </div>
            <DialogTitle className={styles.workModalCaption}>{sample.caption}</DialogTitle>
            <DialogClose className={styles.workModalClose} aria-label="Close">
              <XMarkIcon aria-hidden />
            </DialogClose>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}

function WorkSampleCard({
  ref,
  sample,
  onOpen,
}: {
  ref: Ref<HTMLButtonElement>;
  sample: WorkSample;
  onOpen: (byKeyboard: boolean) => void;
}) {
  return (
    <button
      ref={ref}
      type="button"
      className={styles.workSample}
      data-fade-item
      aria-haspopup="dialog"
      // A keyboard click reports `detail` 0; a pointer click counts its clicks.
      onClick={(event) => onOpen(event.detail === 0)}
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
    </button>
  );
}

function WorkSampleMedia({ sample }: { sample: WorkSample }) {
  return sample.video ? (
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
  );
}
