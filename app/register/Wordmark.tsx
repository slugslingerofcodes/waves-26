import Image from "next/image";
import DoorLink from "../_doors/DoorLink";
import s from "./wordmark.module.css";

/**
 * The WAVES '26 logo and tagline, top left on every registration screen; it
 * leads home. Each page positions and sizes it through `className` (the tagline
 * is 1em, so the page's font-size sets it), and sets `--tagline` and
 * `--logo-shadow` to suit the scene behind it.
 */
export default function Wordmark({ className }: { className: string }) {
  return (
    <DoorLink className={`${s.wordmark} ${className}`} href="/" aria-label="WAVES '26 — home">
      {/* Figma draws the logo stretched to 621x191; `.art` keeps that aspect. */}
      <Image className={s.art} src="/waves/logo.webp" alt="" width={429} height={274} unoptimized preload />
      <span className={s.tagline}>Ashes to Ascension</span>
    </DoorLink>
  );
}
