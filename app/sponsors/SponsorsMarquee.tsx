import Image from "next/image";
import { ROWS, type Sponsor } from "./sponsors-data";
import s from "./sponsors.module.css";

/**
 * Each row holds its sponsors three times and slides one full copy to the
 * right, so the wrap lands on an identical pedestal and never reads as a jump.
 * Three copies rather than two because on a wide, short window a single copy is
 * narrower than the viewport, which would open a gap at the wrap. The second
 * row starts half a pedestal-pitch into the same cycle, which keeps the brick
 * stagger of the frame while both rows drift at one speed.
 *
 * Everything is CSS: no timers, no state, and nothing to hydrate.
 */
export default function SponsorsMarquee() {
  return (
    <div className={s.rows}>
      {ROWS.map((row, r) => (
        <div className={s.row} key={r}>
          <div className={`${s.track} ${r === 1 ? s.trackOffset : ""}`}>
            {[...row, ...row, ...row].map((sponsor, i) => (
              // The copy must match phase for phase, so the bob is keyed to the
              // position within one copy rather than the doubled list.
              <Pedestal key={i} sponsor={sponsor} phase={i % row.length} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Pedestal({ sponsor, phase }: { sponsor: Sponsor; phase: number }) {
  return (
    <div className={s.slot}>
      <div className={s.pedestal} style={{ "--phase": phase } as React.CSSProperties}>
        <div className={s.face}>
          {sponsor.logo ? (
            <Image src={sponsor.logo} alt={sponsor.name} fill sizes="20vw" className={s.logo} />
          ) : (
            <span className={s.name}>{sponsor.name}</span>
          )}
        </div>
      </div>
    </div>
  );
}
