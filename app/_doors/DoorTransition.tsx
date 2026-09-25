"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Sand from "./Sand";
import s from "./doors.module.css";

/**
 * Wraps every route in a pair of sliding doors cut from the split card art.
 *
 * A navigation runs: shut -> push -> (new route mounts) -> open, with the push
 * deferred until the doors have met so the swap is never visible.
 *
 * The phases are driven by timers rather than `transitionend`. A transition
 * that never runs -- a backgrounded tab, a compositor that skips an off-screen
 * layer -- would otherwise never fire its event, and the navigation would be
 * dropped with the doors left shut over the page. Timers always land.
 */
type Phase = "idle" | "shutting" | "shut" | "opening";

const DoorContext = createContext<((href: string) => void) | null>(null);

/**
 * Returns a navigate function, or null outside the provider (in which case
 * callers should fall back to ordinary link behaviour).
 */
export function useDoorNavigate() {
  return useContext(DoorContext);
}

/** Keep in step with the panel transition in doors.module.css. */
const DOOR_MS = 460;
const SETTLE_MS = 60;
/**
 * Beat to hold the doors shut once the route has arrived. Without it the crest
 * fades in just as the doors start opening again and reads as a flicker.
 */
const HOLD_MS = 240;
/** If a route never arrives, open up rather than trapping the page. */
const ROUTE_TIMEOUT_MS = 2500;

export default function DoorTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const target = useRef<string | null>(null);
  const [sand, setSand] = useState({ impact: 0, pour: 0 });

  const doorMs = useCallback(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : DOOR_MS,
    [],
  );

  /*
   * Sand is shed twice per navigation: once when the panels slam together and
   * again as they part, so the slam is still falling as the doors open.
   * A burst is a counter rather than mounted-then-unmounted state -- bumping it
   * replays the animation through the key, and the grains end at zero opacity,
   * so a spent burst can sit there harmlessly instead of needing its own timer
   * to tear it down.
   */
  const kickSand = useCallback((kind: "impact" | "pour") => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setSand((s) => ({ ...s, [kind]: s[kind] + 1 }));
  }, []);

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname || target.current) return;
      target.current = href;
      router.prefetch(href);
      setPhase("shutting");
    },
    [pathname, router],
  );

  // Doors have met -> swap the route behind them.
  useEffect(() => {
    if (phase !== "shutting") return;
    const id = setTimeout(() => {
      setPhase("shut");
      kickSand("impact");
      if (target.current) router.push(target.current);
    }, doorMs() + SETTLE_MS);
    return () => clearTimeout(id);
  }, [phase, router, doorMs, kickSand]);

  // New route is live -> hold a beat on the crest, then open up.
  useEffect(() => {
    if (!target.current || pathname !== target.current) return;
    target.current = null;
    const id = setTimeout(() => {
      setPhase("opening");
      kickSand("pour");
    }, HOLD_MS);
    return () => clearTimeout(id);
  }, [pathname, kickSand]);

  // Backstop: never leave the doors shut if the route does not arrive.
  useEffect(() => {
    if (phase !== "shut") return;
    const id = setTimeout(() => {
      target.current = null;
      setPhase("opening");
      kickSand("pour");
    }, ROUTE_TIMEOUT_MS);
    return () => clearTimeout(id);
  }, [phase, kickSand]);

  useEffect(() => {
    if (phase !== "opening") return;
    const id = setTimeout(() => setPhase("idle"), doorMs() + SETTLE_MS);
    return () => clearTimeout(id);
  }, [phase, doorMs]);

  const shut = phase === "shutting" || phase === "shut";

  return (
    <DoorContext.Provider value={navigate}>
      {children}
      <div
        className={[s.doors, shut ? s.shut : s.open, shut ? s.blocking : ""]
          .filter(Boolean)
          .join(" ")}
        aria-hidden="true"
        data-phase={phase}
      >
        <div className={`${s.panel} ${s.left}`} />
        <div className={`${s.panel} ${s.right}`} />
        <div className={s.crest} />
        {sand.impact > 0 && <Sand key={`impact-${sand.impact}`} kind="impact" />}
        {sand.pour > 0 && <Sand key={`pour-${sand.pour}`} kind="pour" />}
      </div>
    </DoorContext.Provider>
  );
}
