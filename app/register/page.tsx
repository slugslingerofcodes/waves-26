"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import DoorLink from "../_doors/DoorLink";
import Atmosphere from "./Atmosphere";
import SealOrb from "./SealOrb";
import HowToPayModal from "./HowToPayModal";
import Wordmark from "./Wordmark";
import s from "./landing.module.css";

/**
 * The landing is built from the Figma layers rather than one flattened plate:
 * the background, each card's art and the coin are separate images, and the
 * labels are live text. Positions are canvas pixels on the 1440x1024 frame
 * (see `--px` in landing.module.css).
 *
 * Only some entries have a destination so far. The rest render as buttons: they
 * hover, focus and press like everything else, they just have nowhere to go
 * yet. Give an entry an `href` and it becomes a live link with no other change.
 */
type Nav = {
  label: string;
  /** Card art: genesis is the dark card, ascension the gold one. */
  side: "genesis" | "ascension";
  /** Top-left corner on the 1440x1024 canvas. */
  at: [number, number];
  href?: string;
  howToPay?: boolean;
};

const NAV: Nav[] = [
  { label: "Rulebook", side: "genesis", at: [230, 221], href: "/register/rulebook" },
  { label: "Pay Now", side: "genesis", at: [167, 452], href: "https://www.onlinesbi.sbi/sbicollect/icollecthome.htm" },
  { label: "Queries", side: "ascension", at: [902, 221] },
  { label: "Mr & Mrs Waves", side: "ascension", at: [961, 452] },
  { label: "Fashion Parade", side: "ascension", at: [940, 683] },
  // Mirrors Fashion Parade across the centre line.
  { label: "How to Pay", side: "genesis", at: [188, 683], howToPay: true },
];

/** The coin's disc: 298px across, centred at (720, 540) -- level with the middle row. */
const ORB: [number, number, number] = [571, 391, 298];

const px = (n: number) => `calc(${n} * var(--px))`;

/** One nav entry as whichever element fits it: modal trigger, external link, page link or inert button. */
function NavControl({
  item,
  className,
  style,
  onHowToPay,
  children,
}: {
  item: Nav;
  className: string;
  style?: CSSProperties;
  onHowToPay: () => void;
  children: ReactNode;
}) {
  if (item.howToPay) {
    return (
      <button className={className} style={style} type="button" onClick={onHowToPay}>
        {children}
      </button>
    );
  }
  if (item.href?.startsWith("http")) {
    return (
      <a className={className} style={style} href={item.href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return item.href ? (
    <DoorLink className={className} style={style} href={item.href}>
      {children}
    </DoorLink>
  ) : (
    <button className={className} style={style} type="button">
      {children}
    </button>
  );
}

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openHowToPay = () => setIsModalOpen(true);

  return (
    <main className={s.wrap}>
      <div className={s.stage}>
        <Wordmark className={s.logo} />

        {NAV.map((item) => (
          <NavControl
            key={item.label}
            item={item}
            className={`${s.card} ${s[item.side]}`}
            style={{ left: px(item.at[0]), top: px(item.at[1]) }}
            onHowToPay={openHowToPay}
          >
            {item.label}
          </NavControl>
        ))}

        <SealOrb style={{ left: px(ORB[0]), top: px(ORB[1]), width: px(ORB[2]), height: px(ORB[2]) }} />
      </div>

      {/* Shown instead of the composition on narrow screens. */}
      <nav className={s.compact} aria-label="WAVES '26">
        <Wordmark className={s.logoCompact} />

        <DoorLink className={`${s.menuItem} ${s.menuRegister}`} href="/register/individual">
          Register
        </DoorLink>

        {NAV.map((item) => (
          <NavControl
            key={item.label}
            item={item}
            className={`${s.menuItem} ${item.side === "ascension" ? s.menuGold : s.menuDark}`}
            onHowToPay={openHowToPay}
          >
            {item.label}
          </NavControl>
        ))}
      </nav>

      <Atmosphere />
      <HowToPayModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
