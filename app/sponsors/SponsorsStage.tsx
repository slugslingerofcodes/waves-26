"use client";

import { useState } from "react";
import SponsorsMarquee from "./SponsorsMarquee";
import s from "./sponsors.module.css";

/**
 * Holds the frame so that pointing at the heading can light the whole trail.
 * The heading drives a flag rather than a CSS :has() rule, because a tap has to
 * light it too and one attribute keeps hover and tap on the same path.
 *
 * Lighting the trail does not stop it: only a sponsor halts the drift.
 */
export default function SponsorsStage() {
  const [lit, setLit] = useState(false);

  return (
    <div className={s.frame} data-lit={lit ? "" : undefined}>
      <h1
        className={s.title}
        onPointerEnter={(e) => e.pointerType === "mouse" && setLit(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setLit(false)}
        onClick={() => setLit((was) => !was)}
      >
        <span>Our Sponsors &amp;</span>
        <span>Media Partners</span>
      </h1>
      <SponsorsMarquee />
    </div>
  );
}
