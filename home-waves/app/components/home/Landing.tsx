"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { ASSETS, LAYERS, NAV_LINKS, type Box } from "./design";
import Countdown from "./Countdown";
import type { Phase } from "./HomeExperience";
import styles from "./home.module.css";

type Theme = "golden" | "ashes";

// Narrow screens: shrink the logo about its top-centre (--logo-fit is 1 on normal screens).
const LOGO_FIT_TRANSFORM = `translate(calc((1 - var(--logo-fit)) * ${LAYERS.logo.final.w / 2}px), calc((1 - var(--logo-fit)) * 180px)) scale(var(--logo-fit))`;

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
      <Image src={src} alt={alt} fill unoptimized preload />
    </div>
  );
}

export default function Landing({ phase }: { phase: Phase }) {
  const [theme, setTheme] = useState<Theme>("golden");
  const atIntro = phase !== "landing";
  const nextTheme: Theme = theme === "golden" ? "ashes" : "golden";

  return (
    <div className={styles.landing} data-theme={theme} data-phase={phase}>
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
        <nav className={styles.nav} aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className={styles.lantern}
          onClick={() => setTheme(nextTheme)}
          aria-label={`Switch to ${nextTheme} theme`}
        >
          <span className={styles.lanternBracket} />
          <span className={styles.lanternSwing}>
            <span className={styles.lanternGlow} />
          </span>
        </button>

        <Countdown />

        {/* TODO: point this at the real registration page. */}
        <Link href="/register" className={styles.register}>
          Register
        </Link>
      </div>
    </div>
  );
}
