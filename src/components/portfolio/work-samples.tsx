"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import styles from "./portfolio.module.css";
import { syncScrollEdgeFade } from "./scroll-edge-fade";

export type WorkSample = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  fit?: "cover" | "contain";
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

  return (
    <div ref={shellRef} className={styles.workSamplesShell}>
      <div ref={scrollerRef} className={styles.workSamples} aria-label="Selected work">
        {samples.map((sample) => (
          <Dialog key={sample.src}>
            <DialogTrigger className={styles.workSample} data-fade-item>
              <Image
                className={styles.workImage}
                src={sample.src}
                alt={sample.alt}
                width={sample.width}
                height={sample.height}
                sizes="(max-width: 640px) 72vw, 220px"
                data-fit={sample.fit ?? "cover"}
              />
              <span>{sample.caption}</span>
            </DialogTrigger>
            <DialogContent
              className={`${styles.workModal} w-[min(92vw,860px)] gap-0 p-0 ring-0 sm:max-w-4xl`}
              showCloseButton
            >
              <DialogDescription className="sr-only">{sample.alt}</DialogDescription>
              <div className={styles.workModalFrame}>
                <Image
                  className={styles.workModalImage}
                  src={sample.src}
                  alt={sample.alt}
                  width={sample.width}
                  height={sample.height}
                  sizes="(max-width: 900px) 92vw, 860px"
                  priority
                />
              </div>
              <DialogTitle
                className={`${styles.workModalCaption} text-[15px] leading-snug font-medium`}
              >
                {sample.caption}
              </DialogTitle>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
