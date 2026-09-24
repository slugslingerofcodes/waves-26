"use client";

import { useEffect, useState } from "react";
import s from "./sponsors.module.css";

/** Beat with the page still covered, before the clouds start to move. */
const HOLD_MS = 260;
/** Keep in step with the bank transition in sponsors.module.css. */
const PART_MS = 1800;
/** How long a page that reports itself hidden waits to be looked at. */
const WAIT_FOR_VIEW_MS = 2500;

/**
 * Survives client-side navigation: the clouds part on the first arrival and
 * the page opens directly after that, the way the home intro behaves.
 */
let parted = false;

/**
 * Two banks of cloud cover the page and draw back to either side. They are
 * opaque where they overlap, so the page is hidden until they actually move,
 * and they sit below the navbar, which the frame shows over the cloud.
 */
export default function SponsorsVeil() {
  const [phase, setPhase] = useState<"covering" | "parting" | "gone">(() =>
    parted ? "gone" : "covering",
  );

  useEffect(() => {
    if (parted) return;

    // reduced motion takes the same path, with the cloud taken away at once
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = reduce ? 0 : HOLD_MS;
    const part = reduce ? 0 : PART_MS;

    const timers: number[] = [];
    const start = () => {
      timers.push(window.setTimeout(() => setPhase("parting"), hold));
      timers.push(
        window.setTimeout(() => {
          parted = true;
          setPhase("gone");
        }, hold + part),
      );
    };

    /*
     * A hidden tab pauses the transition but keeps the timers running, so the
     * clouds would be taken away without ever having moved. Open in a
     * background tab and the reveal waits until the page is actually looked at.
     *
     * It only waits so long: some embedded browsers report hidden for a page
     * that is plainly on screen, and a page stuck behind cloud is far worse
     * than one that misses the reveal.
     */
    if (document.hidden) {
      const begin = () => {
        document.removeEventListener("visibilitychange", onVisible);
        clearTimeout(fallback);
        start();
      };
      const onVisible = () => {
        if (!document.hidden) begin();
      };
      const fallback = window.setTimeout(begin, WAIT_FOR_VIEW_MS);
      document.addEventListener("visibilitychange", onVisible);
      return () => {
        document.removeEventListener("visibilitychange", onVisible);
        clearTimeout(fallback);
        timers.forEach(clearTimeout);
      };
    }

    start();
    return () => timers.forEach(clearTimeout);
  }, []);

  if (phase === "gone") return null;

  return (
    <div className={`${s.veil} ${phase === "parting" ? s.veilParting : ""}`} aria-hidden>
      <div className={`${s.bank} ${s.bankLeft}`} />
      <div className={`${s.bank} ${s.bankRight}`} />
    </div>
  );
}
