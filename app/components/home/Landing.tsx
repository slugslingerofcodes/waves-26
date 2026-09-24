"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import DoorLink from "../../_doors/DoorLink";
import { ASSETS, LAYERS, NAV_LINKS, type Box } from "./design";
import Countdown from "./Countdown";
import type { Phase } from "./HomeExperience";
import styles from "./home.module.css";

type Theme = "golden" | "ashes";

// Survives client-side navigation, so coming back from /register keeps the chosen theme.
let savedTheme: Theme = "golden";

// Narrow screens: shrink the logo about its top-centre (--logo-fit is 1 on normal screens),
// and drop it below the wrapped nav (--logo-drop is only set on narrow screens).
const LOGO_FIT_TRANSFORM = `translate(calc((1 - var(--logo-fit)) * ${LAYERS.logo.final.w / 2}px), max(calc((1 - var(--logo-fit)) * 180px), var(--logo-drop, 0px))) scale(var(--logo-fit))`;

function layerStyle(final: Box, intro: Box, atIntro: boolean, finalTransform: string): CSSProperties {
  return {
    left: final.x,
    top: final.y,
    width: final.w,
    height: final.h,
    transform: atIntro
      ? `translate(${intro.x - final.x}px, ${intro.y - final.y}px) scale(${intro.w / final.w}, ${intro.h / final.h})`
      : finalTransform,
  };
}

function Layer({
  name,
  src,
  atIntro,
  alt = "",
  className = "",
  finalTransform = "none",
}: {
  name: keyof typeof LAYERS;
  src: string;
  atIntro: boolean;
  alt?: string;
  className?: string;
  finalTransform?: string;
}) {
  const { final, intro } = LAYERS[name];
  return (
    <div className={`${styles.layer} ${className}`} style={layerStyle(final, intro, atIntro, finalTransform)}>
      <Image src={src} alt={alt} fill unoptimized />
    </div>
  );
}

export default function Landing({ phase }: { phase: Phase }) {
  const [theme, setTheme] = useState<Theme>(() => savedTheme);
  const atIntro = phase !== "landing";
  const nextTheme: Theme = theme === "golden" ? "ashes" : "golden";
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={rootRef} className={styles.landing} data-theme={theme} data-phase={phase}>
      <div className={`${styles.stage} ${styles.landingStage}`}>
        <Layer name="backdrop" src={ASSETS.backdrop} atIntro={atIntro} />
        <Layer name="scene" src={ASSETS.scene} atIntro={atIntro} />
        <div className={styles.ashesLayers}>
          <Layer name="ashes" src={ASSETS.ashes} atIntro={false} />
          <Layer name="foreground" src={ASSETS.foreground} atIntro={false} className={styles.foreground} />
        </div>
        <Layer name="foreground" src={ASSETS.foreground} atIntro={atIntro} className={styles.foreground} />
        <Layer name="bush" src={ASSETS.bush} atIntro={atIntro} />
        <Layer
          name="logo"
          src={ASSETS.logo}
          atIntro={atIntro}
          alt="Waves '26 — Ashes to Ascension"
          className={styles.logo}
          finalTransform={LOGO_FIT_TRANSFORM}
        />
      </div>

      <div className={styles.ui} aria-hidden={atIntro}>
        <nav className={styles.nav}>
          {NAV_LINKS.map(({ label, href }) =>
            href ? (
              <Link key={label} href={href} className={styles.navLink}>
                {label}
              </Link>
            ) : (
              <span key={label} className={styles.navLink} aria-disabled="true">
                {label}
              </span>
            )
          )}

        </nav>

        <button
          type="button"
          className={styles.lantern}
          onClick={() => {
            savedTheme = nextTheme;
            setTheme(nextTheme);
          }}
          aria-label={`Switch to ${nextTheme} theme`}
        >
          <span className={styles.lanternBracket} />
          <span className={styles.lanternSwing}>
            <span className={styles.lanternGlow} />
          </span>
        </button>

        <Countdown />

        <DoorLink href="/register" className={styles.register}>
          Register
        </DoorLink>
      </div>
    </div>
  );
}
