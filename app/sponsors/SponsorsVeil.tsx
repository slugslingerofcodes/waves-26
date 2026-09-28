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
     * A page that isn't being painted -- a background tab -- runs its timers
     * but not its transitions, so starting there would take the cloud away
     * without it ever having moved, or snap it aside the moment the page came
     * back. A frame callback is the signal that the page is actually on
     * screen: it doesn't run until then, and it runs at once when it is.
     *
     * The timer behind it is the backstop for a browser that never gets round
     * to painting: a page stuck behind cloud is worse than one that misses the
     * reveal.
     */
    const begin = () => {
      cancelAnimationFrame(frame);
      clearTimeout(backstop);
      start();
    };
    const frame = requestAnimationFrame(begin);
    const backstop = window.setTimeout(begin, WAIT_FOR_VIEW_MS);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(backstop);
      timers.forEach(clearTimeout);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div className={`${s.veil} ${phase === "parting" ? s.veilParting : ""}`} aria-hidden>
      <div className={`${s.bank} ${s.bankLeft}`} />
      <div className={`${s.bank} ${s.bankRight}`} />
    </div>
  );
}
