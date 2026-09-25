"use client";

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";
import { DESIGN_H, DESIGN_W, LAYERS } from "./design";
import Landing from "./Landing";
import styles from "./home.module.css";

export type Phase = "intro" | "landing";

// Figma holds the intro frame for 0.8s before smart-animating into the landing.
const INTRO_HOLD_MS = 800;
const LOGO_CENTER_X = LAYERS.logo.final.x + LAYERS.logo.final.w / 2;

// Survives client-side navigation: once the intro has played, returning home goes straight to the landing page.
let introPlayed = false;

function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

function useViewport() {
  const w = useSyncExternalStore(subscribe, () => window.innerWidth, () => DESIGN_W);
  const h = useSyncExternalStore(subscribe, () => window.innerHeight, () => DESIGN_H);
  return { w, h };
}

export default function HomeExperience() {
  const { w, h } = useViewport();
  const [phase, setPhase] = useState<Phase>(() => (introPlayed ? "landing" : "intro"));

  useEffect(() => {
    if (introPlayed) return;
    const toLanding = () => {
      introPlayed = true;
      setPhase("landing");
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      toLanding();
      return;
    }
    // The layers only animate if they have painted at their intro transform
    // first, so wait for a frame before starting the hold.
    let timer = 0;
    const frame = requestAnimationFrame(() => {
      timer = window.setTimeout(toLanding, INTRO_HOLD_MS);
    });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, []);

  // On viewports narrower than the design, pan the cropped stage toward the logo
  // instead of the centre, and shrink the logo if it still can't fit.
  const cover = Math.max(w / DESIGN_W, h / DESIGN_H);
  const visibleW = w / cover;
  const focusX = Math.min(Math.max(LOGO_CENTER_X, visibleW / 2), DESIGN_W - visibleW / 2);
  const vars = {
    "--cover": cover,
    "--ui": Math.min(w / DESIGN_W, h / DESIGN_H),
    "--stage-x": `${(DESIGN_W / 2 - focusX) * cover}px`,
    "--stage-top": `${(h - DESIGN_H * cover) / 2}px`,
    "--logo-fit": Math.min(1, (visibleW - 40) / LAYERS.logo.final.w),
  } as CSSProperties;

  return (
    <main className={styles.root} style={vars}>
      <Landing phase={phase} />
    </main>
  );
}
