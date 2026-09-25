"use client";

import type { CSSProperties } from "react";
import s from "./doors.module.css";

/**
 * The dust cloud the seam throws off when the panels meet and again as they
 * part -- the tomb-door billow.
 *
 * Three layers, heaviest first:
 *
 *   haze   one continuous bed down the seam, so the cloud has a body rather
 *          than reading as separate blobs
 *   puffs  the cloud itself: soft, off-centre lobes that expand, roll and
 *          drift apart at their own rates, which is what billows
 *   grains  a light sprinkle of grit inside it -- without them the cloud is a
 *          smudge, but they are texture here, not the effect
 *
 * `impact` is the slam: the cloud punches outward before it settles.
 * `pour` is the parting: bigger, slower, sinking as the doors slide away.
 */
const PUFF_COUNT = 18;
const GRAIN_COUNT = 40;

/**
 * How much faster the cloud clears than the timings below were first tuned for.
 * Every duration and delay is divided by it -- including the haze's, in the
 * stylesheet -- so the whole burst plays out and is gone sooner while the shape
 * of the motion stays as it was. Raise it to clear faster still.
 */
const SPEED = 1.5;

/** Desert ochres, picked per grain so the grit is not one flat colour. */
const TONES = ["#e6d2a8", "#d4b781", "#bb9a5f", "#9c7e46", "#f2e6c9"];

/** Deterministic, so the server and the client lay out the same cloud. */
function noise(i: number, k: number) {
  const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return v - Math.floor(v);
}

export default function Sand({ kind }: { kind: "impact" | "pour" }) {
  const pour = kind === "pour";
  const spread = pour ? 0.72 : 1; // the slam punches out; the parting sinks
  const sink = pour ? 1.5 : 1;

  return (
    <div className={`${s.sand} ${pour ? s.sandPour : ""}`} aria-hidden="true">
      <span className={s.haze} />

      {Array.from({ length: PUFF_COUNT }, (_, i) => {
        const side = i % 2 ? 1 : -1;
        const style = {
          "--y": `${noise(i, 1) * 100}%`,
          "--size": `${130 + noise(i, 2) * 290}px`,
          "--dx": `${side * (20 + noise(i, 3) * 250) * spread}px`,
          "--dy": `${(noise(i, 4) * 270 - 70) * sink}px`,
          "--grow": `${1.6 + noise(i, 5) * 1.7}`,
          // An off-centre lobe, so rolling the puff actually churns it. A
          // symmetrical circle would look identical at every angle.
          "--rx": `${44 + noise(i, 6) * 26}%`,
          "--ry": `${38 + noise(i, 7) * 26}%`,
          "--cx": `${34 + noise(i, 8) * 32}%`,
          "--cy": `${34 + noise(i, 9) * 32}%`,
          "--spin": `${(noise(i, 10) - 0.5) * 190}deg`,
          // Eighteen of these overlap, so per-puff alpha stays low -- enough
          // to read as cloud, not enough to bury the crest behind it.
          "--density": `${0.075 + noise(i, 11) * 0.135}`,
          "--delay": `${(noise(i, 12) * (pour ? 700 : 340)) / SPEED}ms`,
          "--dur": `${((pour ? 3400 : 2700) + noise(i, 13) * 1700) / SPEED}ms`,
        } as CSSProperties;
        return <span key={`p${i}`} className={s.puff} style={style} />;
      })}

      {Array.from({ length: GRAIN_COUNT }, (_, i) => {
        const side = i % 2 ? 1 : -1;
        const w = 2 + noise(i, 4) * 6;
        const style = {
          "--y": `${Math.pow(noise(i, 1), 1.5) * 100}%`,
          "--dx": `${side * (8 + noise(i, 2) * 150) * spread}px`,
          "--rise": `${-(6 + noise(i, 3) * 54) * spread}px`,
          "--fall": `${(150 + noise(i, 9) * 700) * sink}px`,
          "--sway": `${(noise(i, 11) - 0.5) * 90}px`,
          "--w": `${w}px`,
          "--h": `${w * (0.6 + noise(i, 5) * 0.75)}px`,
          "--tone": TONES[i % TONES.length],
          "--spin": `${(noise(i, 6) - 0.5) * 420}deg`,
          "--peak": `${0.35 + noise(i, 7) * 0.4}`,
          "--delay": `${(noise(i, 8) * (pour ? 900 : 420)) / SPEED}ms`,
          "--dur": `${((pour ? 3000 : 2400) + noise(i, 10) * 1800) / SPEED}ms`,
        } as CSSProperties;
        return <span key={`g${i}`} className={s.grain} style={style} />;
      })}
    </div>
  );
}
