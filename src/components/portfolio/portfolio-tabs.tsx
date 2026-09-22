"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import styles from "./portfolio.module.css";
import { syncScrollEdgeFade } from "./scroll-edge-fade";

const sections = ["about", "experience", "projects", "misc"] as const;
type Section = (typeof sections)[number];
const isSection = (value: string): value is Section =>
  sections.some((section) => section === value);

export function PortfolioTabs({ panels }: { panels: Record<Section, ReactNode> }) {
  const [active, setActive] = useState<Section>("about");
  const tabRefs = useRef<Partial<Record<Section, HTMLButtonElement>>>({});
  const panelRefs = useRef<Partial<Record<Section, HTMLDivElement>>>({});

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.slice(1);
      setActive(isSection(hash) ? hash : "about");
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
    };
  }, []);

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
    setActive(section);
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
      <button className={styles.skip} onClick={() => panelRefs.current[active]?.focus()}>
        Skip to content
      </button>
      <header className={styles.header} data-pool-exclusion>
        {/* Visible headings live in the panels, which are hidden when not selected. */}
        <h1 className="sr-only">Dawson Xiong</h1>
        <div className={styles.barInner}>
          <div className={styles.nav} role="tablist" aria-label="Portfolio sections">
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
                {section}
              </button>
            ))}
          </div>
        </div>
      </header>
      <main className={styles.column} data-pool-exclusion>
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
      <footer className={styles.footer} data-pool-exclusion>
        <div className={styles.barInner}>
          {/* The page is prerendered, so the client's year can differ from the build's. */}
          <span suppressHydrationWarning>© {new Date().getFullYear()} Dawson Xiong</span>
        </div>
      </footer>
    </div>
  );
}
