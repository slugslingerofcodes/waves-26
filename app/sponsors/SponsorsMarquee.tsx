"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { ROWS, type Sponsor } from "./sponsors-data";
import s from "./sponsors.module.css";

/** Copies of each row laid end to end, so a drag never runs out of pedestals. */
const COPIES = 3;
/** How quickly a flick runs down: 1 would coast forever. */
const FRICTION = 0.94;
const ARROW_STEP = 80;

/**
 * The rows are dragged, not animated: pointer, wheel and arrow keys all move
 * the same offset, and a flick coasts to a stop. Each row wraps its offset into
 * one copy's width, so the pedestals never run out in either direction.
 */
export default function SponsorsMarquee() {
  const tracks = useRef<(HTMLDivElement | null)[]>([]);
  const offset = useRef(0);
  const velocity = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const frame = useRef(0);

  const paint = useCallback(() => {
    tracks.current.forEach((track, r) => {
      if (!track) return;
      const copy = track.scrollWidth / COPIES;
      if (!copy) return;
      // the lower row sits half a pedestal further on -- the stagger of the frame
      const shifted = offset.current - (r * copy) / (2 * ROWS[r].length);
      const x = ((shifted % copy) - copy) % copy; // keep it inside one copy
      track.style.transform = `translate3d(${x}px, 0, 0)`;
    });
  }, []);

  const glide = useCallback(() => {
    const step = () => {
      velocity.current *= FRICTION;
      if (Math.abs(velocity.current) < 0.05) return;
      offset.current += velocity.current;
      paint();
      frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  }, [paint]);

  const move = useCallback(
    (dx: number) => {
      offset.current += dx;
      paint();
    },
    [paint],
  );

  useEffect(() => {
    paint();
    const onResize = () => paint();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame.current);
    };
  }, [paint]);

  return (
    <div
      className={s.rows}
      role="group"
      aria-label="Sponsors and media partners"
      tabIndex={0}
      onPointerDown={(e) => {
        cancelAnimationFrame(frame.current);
        dragging.current = true;
        velocity.current = 0;
        lastX.current = e.clientX;
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        const dx = e.clientX - lastX.current;
        lastX.current = e.clientX;
        velocity.current = dx;
        move(dx);
      }}
      onPointerUp={() => {
        if (!dragging.current) return;
        dragging.current = false;
        glide();
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
      onWheel={(e) => {
        const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        move(-d);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") move(ARROW_STEP);
        else if (e.key === "ArrowRight") move(-ARROW_STEP);
        else return;
        e.preventDefault();
      }}
    >
      {ROWS.map((row, r) => (
        <div className={s.row} key={r}>
          <div
            className={s.track}
            ref={(el) => {
              tracks.current[r] = el;
            }}
          >
            {Array.from({ length: COPIES }, (_, c) =>
              row.map((sponsor, i) => (
                <Pedestal
                  key={`${c}-${i}`}
                  sponsor={sponsor}
                  phase={i}
                  // only the first copy is read out; the rest are the same names
                  hidden={c > 0}
                />
              )),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function Pedestal({
  sponsor,
  phase,
  hidden,
}: {
  sponsor: Sponsor;
  phase: number;
  hidden: boolean;
}) {
  return (
    <div className={s.slot} aria-hidden={hidden || undefined}>
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
