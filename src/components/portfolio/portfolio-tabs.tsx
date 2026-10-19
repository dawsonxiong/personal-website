"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import styles from "./portfolio.module.css";
import { syncScrollEdgeFade } from "./scroll-edge-fade";

const sections = ["about", "experience", "projects", "misc"] as const;
type Section = (typeof sections)[number];
const labels: Record<Section, string> = {
  about: "About",
  experience: "Experience",
  projects: "Projects",
  misc: "Misc",
};
const isSection = (value: string): value is Section =>
  sections.some((section) => section === value);
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// Longer than the card's height transition in portfolio.module.css, in case it never ends.
const RESIZE_FALLBACK_MS = 600;

export function PortfolioTabs({ panels }: { panels: Record<Section, ReactNode> }) {
  const [active, setActive] = useState<Section>("about");
  // Showing a hidden panel restarts its CSS animations, so once the reader has switched
  // tabs the About intro reveal must not replay (see portfolio.module.css).
  const [switched, setSwitched] = useState(false);
  const tabRefs = useRef<Partial<Record<Section, HTMLButtonElement>>>({});
  const panelRefs = useRef<Partial<Record<Section, HTMLDivElement>>>({});
  const navRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLElement>(null);
  // The card's height just before a switch, so it can ease to the new panel's height.
  const fromHeight = useRef<number | null>(null);
  const endResize = useRef<(() => void) | null>(null);

  const beforeSwitch = (next: Section) => {
    const column = columnRef.current;
    if (!column) return;
    fromHeight.current = column.getBoundingClientRect().height;
    // New panels slide in from the side of the tab you moved towards.
    column.dataset.direction =
      sections.indexOf(next) < sections.indexOf(active) ? "back" : "forward";
  };

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.slice(1);
      setActive(isSection(hash) ? hash : "about");
    };
    const onHistory = () => {
      const hash = window.location.hash.slice(1);
      beforeSwitchRef.current(isSection(hash) ? hash : "about");
      setSwitched(true);
      syncHash();
    };
    syncHash();
    window.addEventListener("hashchange", onHistory);
    window.addEventListener("popstate", onHistory);
    return () => {
      window.removeEventListener("hashchange", onHistory);
      window.removeEventListener("popstate", onHistory);
    };
  }, []);

  // Keeps the history listener above on the latest `active` without re-subscribing.
  const beforeSwitchRef = useRef(beforeSwitch);
  beforeSwitchRef.current = beforeSwitch;

  // Slide the underline to the selected tab, and follow it if the labels reflow.
  useLayoutEffect(() => {
    const nav = navRef.current;
    const tab = tabRefs.current[active];
    if (!nav || !tab) return;
    const place = () => {
      nav.style.setProperty("--indicator-x", `${tab.offsetLeft}px`);
      nav.style.setProperty("--indicator-width", `${tab.offsetWidth}px`);
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(nav);
    return () => observer.disconnect();
  }, [active]);

  // Ease the card from the old panel's height to the new one's.
  useLayoutEffect(() => {
    const column = columnRef.current;
    const from = fromHeight.current;
    fromHeight.current = null;
    if (!column || from === null || prefersReducedMotion()) return;
    endResize.current?.();
    column.style.height = "";
    const to = column.getBoundingClientRect().height;
    if (Math.abs(to - from) < 1) return;
    column.style.height = `${from}px`;
    // Flush the old height so the change to the new one transitions.
    void column.offsetHeight;
    column.dataset.resizing = "";
    column.style.height = `${to}px`;

    // Hand the height back to the layout once the resize finishes.
    const finish = () => {
      window.clearTimeout(timer);
      column.removeEventListener("transitionend", onEnd);
      delete column.dataset.resizing;
      column.style.height = "";
      endResize.current = null;
    };
    const onEnd = (event: TransitionEvent) => {
      if (event.target === column && event.propertyName === "height") finish();
    };
    const timer = window.setTimeout(finish, RESIZE_FALLBACK_MS);
    column.addEventListener("transitionend", onEnd);
    endResize.current = finish;
  }, [active]);

  useEffect(() => () => endResize.current?.(), []);

  useEffect(() => {
    const panel = panelRefs.current[active];
    const column = panel?.parentElement;
    if (!panel || !column) return;

    // Reset here, once the panel is visible: a hidden panel can't be scrolled,
    // so resetting from the click handler left stale offsets behind.
    panel.scrollTop = 0;

    const updateFade = () => {
      syncScrollEdgeFade(panel, "y", column, "fadeTop", "fadeBottom");
    };

    updateFade();
    const frame = requestAnimationFrame(updateFade);
    panel.addEventListener("scroll", updateFade, { passive: true });
    const observer = new ResizeObserver(updateFade);
    observer.observe(panel);
    if (panel.firstElementChild) observer.observe(panel.firstElementChild);

    return () => {
      cancelAnimationFrame(frame);
      panel.removeEventListener("scroll", updateFade);
      observer.disconnect();
      delete column.dataset.fadeTop;
      delete column.dataset.fadeBottom;
      delete panel.dataset.fadeTop;
      delete panel.dataset.fadeBottom;
    };
  }, [active]);

  const select = (section: Section) => {
    if (section === active) return;
    beforeSwitch(section);
    setActive(section);
    setSwitched(true);
    window.history.pushState(null, "", `#${section}`);
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, section: Section) => {
    const index = sections.indexOf(section);
    let next: Section;
    switch (event.key) {
      case "ArrowRight":
        next = sections[(index + 1) % sections.length];
        break;
      case "ArrowLeft":
        next = sections[(index + sections.length - 1) % sections.length];
        break;
      case "Home":
        next = sections[0];
        break;
      case "End":
        next = sections[sections.length - 1];
        break;
      default:
        return;
    }
    event.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div
      className={styles.portfolio}
      data-tab-switched={switched ? "" : undefined}
      onClick={(event) => {
        // Keep in-content links to another section inside the tab interface too.
        if (!(event.target instanceof Element)) return;
        const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
        const section = link?.getAttribute("href")?.slice(1);
        if (
          !section ||
          !isSection(section) ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        event.preventDefault();
        select(section);
        tabRefs.current[section]?.focus();
      }}
    >
      <header className={styles.header} data-pool-exclusion>
        {/* Visible headings live in the panels, which are hidden when not selected. */}
        <h1 className="sr-only">Dawson Xiong</h1>
        <div className={styles.barInner}>
          <div className={styles.nav} role="tablist" aria-label="Portfolio sections" ref={navRef}>
            {sections.map((section) => (
              <button
                key={section}
                type="button"
                role="tab"
                id={`tab-${section}`}
                aria-controls={`panel-${section}`}
                aria-selected={active === section}
                tabIndex={active === section ? 0 : -1}
                ref={(element) => {
                  if (element) tabRefs.current[section] = element;
                }}
                onClick={() => select(section)}
                onKeyDown={(event) => onTabKeyDown(event, section)}
              >
                {labels[section]}
              </button>
            ))}
            <span className={styles.indicator} aria-hidden="true" />
          </div>
        </div>
      </header>
      <main className={styles.column} data-pool-exclusion ref={columnRef}>
        {sections.map((section) => (
          <div
            key={section}
            role="tabpanel"
            id={`panel-${section}`}
            aria-labelledby={`tab-${section}`}
            tabIndex={0}
            hidden={active !== section}
            className={styles.panel}
            ref={(element) => {
              if (element) panelRefs.current[section] = element;
            }}
          >
            {panels[section]}
          </div>
        ))}
      </main>
    </div>
  );
}
