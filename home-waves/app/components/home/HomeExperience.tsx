"use client";

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";
import { ASSETS, DESIGN_H, DESIGN_W, LAYERS } from "./design";
import LoadingScreen from "./LoadingScreen";
import Landing from "./Landing";
import styles from "./home.module.css";

export type Phase = "loading" | "intro" | "landing";

const MIN_LOADING_MS = 1600;
const INTRO_HOLD_MS = 800;
const LOGO_CENTER_X = LAYERS.logo.final.x + LAYERS.logo.final.w / 2;

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
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];
    const start = performance.now();
    const sources = Object.values(ASSETS).filter((src) => src !== ASSETS.loadingBg);
    const total = sources.length + 1; // + fonts
    let done = 0;

    // The bar never runs ahead of real progress, and never fills faster than MIN_LOADING_MS.
    const update = () => {
      const timeCap = Math.min(1, (performance.now() - start) / MIN_LOADING_MS);
      if (!cancelled) setProgress(Math.min(done / total, timeCap));
    };
    const ticker = window.setInterval(update, 100);

    const load = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = img.onerror = () => resolve();
        img.src = src;
      });

    // Load the loading screen's own background first so it isn't competing with the big layers.
    const everything = load(ASSETS.loadingBg).then(() =>
      Promise.all([
        ...sources.map((src) => load(src).then(() => void (done += 1))),
        document.fonts.ready.then(() => void (done += 1)),
      ]),
    );
    const minDelay = new Promise((r) => timers.push(window.setTimeout(r, MIN_LOADING_MS)));

    Promise.all([everything, minDelay]).then(() => {
      if (cancelled) return;
      clearInterval(ticker);
      setProgress(1);
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      timers.push(
        window.setTimeout(() => {
          setPhase(reduceMotion ? "landing" : "intro");
          if (!reduceMotion) {
            timers.push(window.setTimeout(() => setPhase("landing"), INTRO_HOLD_MS));
          }
        }, 300),
      );
    });

    return () => {
      cancelled = true;
      clearInterval(ticker);
      timers.forEach(clearTimeout);
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
    "--logo-fit": Math.min(1, (visibleW - 40) / LAYERS.logo.final.w),
  } as CSSProperties;

  return (
    <main className={styles.root} style={vars}>
      <Landing phase={phase} />
      <LoadingScreen progress={progress} hidden={phase !== "loading"} />
    </main>
  );
}
