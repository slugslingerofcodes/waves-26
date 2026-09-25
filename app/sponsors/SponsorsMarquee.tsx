"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { loadSponsors, toRows, type Sponsor } from "./sponsors-data";
import s from "./sponsors.module.css";

/** Copies of each row laid end to end, so the trail never runs out. */
const MIN_COPIES = 3;
/** One pedestal passes every this many seconds, at every viewport size. */
const SECONDS_PER_PEDESTAL = 7;
/** How long the drift takes to come to rest, and to pick back up again. */
const EASE_MS = 350;
/** A frame after a long gap (a backgrounded tab) must not jump the trail on. */
const MAX_FRAME_MS = 100;

type SlotKey = string;

/**
 * The rows carry themselves: a clock advances one offset and each row wraps it
 * into a single copy's width, so the pedestals never run out in either
 * direction. Pointing at a sponsor -- or tapping, or focusing one -- eases the
 * drift to a halt and lights that pedestal.
 */
export default function SponsorsMarquee() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [copies, setCopies] = useState(MIN_COPIES);
  const [hovered, setHovered] = useState<SlotKey | null>(null);
  const [selected, setSelected] = useState<SlotKey | null>(null);

  const tracks = useRef<(HTMLDivElement | null)[]>([]);
  const offset = useRef(0);
  const speed = useRef(1); // 0 stopped, 1 full pace; eased between the two
  const lastFrame = useRef(0);
  const frame = useRef(0);
  const paused = useRef(false);

  const rows = useMemo(() => toRows(sponsors), [sponsors]);
  const rowsRef = useRef<Sponsor[][]>([]);
  const copiesRef = useRef(copies);

  // the animation loop reads these without re-subscribing to every change
  useEffect(() => {
    rowsRef.current = rows;
  }, [rows]);
  useEffect(() => {
    copiesRef.current = copies;
  }, [copies]);
  useEffect(() => {
    paused.current = hovered !== null || selected !== null;
  }, [hovered, selected]);

  useEffect(() => {
    const controller = new AbortController();
    loadSponsors(controller.signal).then(setSponsors);
    return () => controller.abort();
  }, []);

  const paint = useCallback(() => {
    tracks.current.forEach((track, r) => {
      if (!track) return;
      const copy = track.scrollWidth / copiesRef.current;
      if (!copy) return;
      // the lower row sits half a pedestal further on -- the stagger of the frame
      const items = rowsRef.current[r]?.length || 1;
      const shifted = offset.current - (r * copy) / (2 * items);
      const x = ((shifted % copy) - copy) % copy; // keep it inside one copy
      track.style.transform = `translate3d(${x}px, 0, 0)`;
    });
  }, []);

  /*
   * Enough copies to cover the viewport twice over. Three suits ten sponsors,
   * but a shorter list would leave a gap at the wrap, so the width is measured
   * rather than assumed.
   */
  useEffect(() => {
    const fit = () => {
      const track = tracks.current[0];
      if (!track) return;
      const copy = track.scrollWidth / copiesRef.current;
      if (!copy) return;
      const needed = Math.max(MIN_COPIES, Math.ceil(window.innerWidth / copy) + 1);
      if (needed !== copiesRef.current) setCopies(needed);
      paint();
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [copies, sponsors, paint]);

  useEffect(() => {
    if (!sponsors.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const step = (now: number) => {
      const dt = Math.min(now - lastFrame.current, MAX_FRAME_MS) / 1000;
      lastFrame.current = now;

      // ease towards a stop or back up to pace, rather than switching outright
      const target = paused.current ? 0 : 1;
      speed.current += (target - speed.current) * Math.min(1, (dt * 1000) / EASE_MS);

      const track = tracks.current[0];
      if (track) {
        const copy = track.scrollWidth / copiesRef.current;
        const items = rowsRef.current[0]?.length || 1;
        const pitch = copy / items;
        offset.current += (pitch / SECONDS_PER_PEDESTAL) * dt * speed.current;
        paint();
      }
      frame.current = requestAnimationFrame(step);
    };

    // as the veil does: a frame callback only runs once the page is painted
    frame.current = requestAnimationFrame((now) => {
      lastFrame.current = now;
      frame.current = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame.current);
  }, [sponsors, paint]);

  return (
    <div
      className={s.rows}
      role="group"
      aria-label="Sponsors and media partners"
      data-selected={selected ? "" : undefined}
      // a tap on the sky between pedestals puts the trail back in motion
      onClick={() => setSelected(null)}
    >
      {rows.map((row, r) => (
        <div className={s.row} key={r}>
          <div
            className={s.track}
            ref={(el) => {
              tracks.current[r] = el;
            }}
          >
            {Array.from({ length: copies }, (_, c) =>
              row.map((sponsor, i) => {
                const key = `${r}-${c}-${i}`;
                return (
                  <Pedestal
                    key={key}
                    sponsor={sponsor}
                    phase={i}
                    active={hovered === key || selected === key}
                    // only the first copy is read out and reachable by keyboard;
                    // the rest are the same sponsors over again
                    duplicate={c > 0}
                    onHover={(on) => setHovered(on ? key : null)}
                    onSelect={() => setSelected((was) => (was === key ? null : key))}
                  />
                );
              }),
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
  active,
  duplicate,
  onHover,
  onSelect,
}: {
  sponsor: Sponsor;
  phase: number;
  active: boolean;
  duplicate: boolean;
  onHover: (on: boolean) => void;
  onSelect: () => void;
}) {
  const select = (e: { stopPropagation: () => void }) => {
    e.stopPropagation(); // the rows clear the selection; a pedestal sets it
    onSelect();
  };

  return (
    <div
      className={s.slot}
      data-active={active ? "" : undefined}
      aria-hidden={duplicate || undefined}
      tabIndex={duplicate ? undefined : 0}
      aria-label={duplicate ? undefined : sponsor.name}
      // a tap fires pointerenter too, and it would never be cleared
      onPointerEnter={(e) => e.pointerType === "mouse" && onHover(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      onClick={select}
      onKeyDown={(e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        select(e);
      }}
    >
      <div className={s.float} style={{ "--phase": phase } as CSSProperties}>
        <div className={s.pedestal}>
          <div className={s.face}>
            {sponsor.logo ? (
              <Image src={sponsor.logo} alt={sponsor.name} fill sizes="20vw" className={s.logo} />
            ) : (
              <span className={s.name}>{sponsor.name}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
