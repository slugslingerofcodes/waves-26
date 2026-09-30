"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import DoorLink from "../../_doors/DoorLink";
import Wordmark from "../Wordmark";
import { CONTENTS_PAGE, PAGES, PAGE_HEIGHT, RULEBOOK_PDF, TOC_LINKS, TOC_PAGE_SIZE } from "./pages";
import s from "./rulebook.module.css";

const pct = (value: number, of: number) => `${(value / of) * 100}%`;

/**
 * The rulebook as a presentation: one page per screen, scrolling freely. Each
 * page fades forward as it comes into view and sits back as it leaves. The
 * contents pages carry links over their entries, and every page has an id
 * (`#page-20`), so an event's rules are one click -- or one URL -- away.
 */
export default function Rulebook() {
  const deck = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const root = deck.current;
    if (!root) return;
    // Focused, the deck takes arrow keys and Page Up/Down straight away.
    root.focus({ preventScroll: true });

    // `data-shown` drives the fade (React never touches it); the page most in
    // view drives the counter.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const slide = entry.target as HTMLElement;
          slide.toggleAttribute("data-shown", entry.intersectionRatio >= 0.25);
          if (entry.intersectionRatio >= 0.55) setCurrent(Number(slide.dataset.index));
        }
      },
      { root, threshold: [0, 0.25, 0.55] },
    );
    root.querySelectorAll("[data-index]").forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, []);

  // Smooth or instant per the deck's CSS scroll-behavior (reduced motion aware).
  const go = (index: number) => {
    deck.current?.children[index]?.scrollIntoView();
  };

  return (
    <div className={s.wrap}>
      <main ref={deck} className={s.deck} tabIndex={0} aria-label="WAVES '26 rulebook">
        {PAGES.map((page, i) => (
          <section key={page.n} id={`page-${page.n}`} className={s.slide} data-index={i}>
            <div className={s.frame}>
              <Image
                className={s.sheet}
                src={page.src}
                alt={`Rulebook page ${page.n} of ${PAGES.length}`}
                width={page.width}
                height={PAGE_HEIGHT}
                unoptimized
                preload={i === 0}
              />
              {TOC_LINKS[page.n]?.map(([label, target, x0, y0, x1, y1]) => (
                <a
                  key={label}
                  className={s.tocLink}
                  href={`#page-${target}`}
                  aria-label={`${label} — page ${target}`}
                  style={{
                    left: pct(x0, TOC_PAGE_SIZE[0]),
                    top: pct(y0, TOC_PAGE_SIZE[1]),
                    width: pct(x1 - x0, TOC_PAGE_SIZE[0]),
                    height: pct(y1 - y0, TOC_PAGE_SIZE[1]),
                  }}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      <Wordmark className={s.logo} />
      <DoorLink className={s.back} href="/register">
        Back
      </DoorLink>

      <div className={s.hud}>
        <button
          className={s.step}
          type="button"
          onClick={() => go(current - 1)}
          disabled={current === 0}
          aria-label="Previous page"
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M6 15l6-6 6 6" />
          </svg>
        </button>
        <span className={s.count} aria-live="polite">
          {current + 1} / {PAGES.length}
        </span>
        <button
          className={s.step}
          type="button"
          onClick={() => go(current + 1)}
          disabled={current === PAGES.length - 1}
          aria-label="Next page"
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <a className={s.pill} href={`#page-${CONTENTS_PAGE}`}>
          Contents
        </a>
        <a className={s.pill} href={RULEBOOK_PDF} target="_blank" rel="noopener noreferrer">
          PDF
        </a>
      </div>

      <div
        className={s.progress}
        style={{ transform: `scaleX(${(current + 1) / PAGES.length})` }}
        aria-hidden
      />
    </div>
  );
}
