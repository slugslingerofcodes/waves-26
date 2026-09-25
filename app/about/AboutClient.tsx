"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Atmosphere from "../register/Atmosphere";
import styles from "./about.module.css";

export default function AboutClient() {
  const [progress, setProgress] = useState(0); // 0 = text fully visible, 1 = video fully visible
  const progressRef = useRef(0);
  const targetRef = useRef(0); // 1 = Aftermovie, 0 = About Us text
  const isAnimatingRef = useRef(false);
  const lastTimeRef = useRef(0);
  const boostRef = useRef(0);
  const pageRef = useRef<HTMLElement>(null);

  const startAnimation = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      // Delta time in seconds, capped to prevent jumping
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.08);
      lastTimeRef.current = now;

      const target = targetRef.current;
      const current = progressRef.current;
      const boost = boostRef.current;
      boostRef.current = 0;

      // Base auto-scroll rate: finishes in ~1.5s on its own (~0.68/sec)
      const baseSpeed = 0.68;

      if (target === 1) {
        // Auto-completing forward to Aftermovie
        const step = baseSpeed * dt + boost;
        const next = Math.min(1, current + step);
        progressRef.current = next;
        setProgress(next);

        if (next < 1) {
          requestAnimationFrame(loop);
        } else {
          isAnimatingRef.current = false;
        }
      } else {
        // Auto-completing backward to About Us text
        const step = baseSpeed * dt + boost;
        const next = Math.max(0, current - step);
        progressRef.current = next;
        setProgress(next);

        if (next > 0) {
          requestAnimationFrame(loop);
        } else {
          isAnimatingRef.current = false;
        }
      }
    };

    requestAnimationFrame(loop);
  }, []);

  // ── Wheel (desktop) ──
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        // Scrolling down even a little bit triggers auto-complete to aftermovie; manual scroll accelerates it
        targetRef.current = 1;
        const boost = Math.min(Math.abs(e.deltaY) / 700, 0.22);
        boostRef.current += boost;
        startAnimation();
      } else if (e.deltaY < -20 && progressRef.current >= 0.75) {
        // Scrolling up while at aftermovie auto-completes back to text
        targetRef.current = 0;
        const boost = Math.min(Math.abs(e.deltaY) / 700, 0.22);
        boostRef.current += boost;
        startAnimation();
      }
    },
    [startAnimation]
  );

  // ── Touch (mobile) ──
  const touchStartY = useRef(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const delta = touchStartY.current - currentY; // positive = swiping up (scrolling down)
      touchStartY.current = currentY;

      if (delta > 0) {
        // Swiping up (scrolling down): auto-complete to aftermovie + manual acceleration
        targetRef.current = 1;
        const boost = Math.min(delta / 350, 0.18);
        boostRef.current += boost;
        startAnimation();
      } else if (delta < -15 && progressRef.current >= 0.75) {
        // Swiping down from aftermovie: auto-complete back to text
        targetRef.current = 0;
        const boost = Math.min(Math.abs(delta) / 350, 0.18);
        boostRef.current += boost;
        startAnimation();
      }
    },
    [startAnimation]
  );

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleWheel, handleTouchStart, handleTouchMove]);

  // ── Derived animation values (all clamped by construction) ──

  // Text: visible at 0, fades+blurs+scales between 0.05–0.4, gone after 0.4
  const textOpacity = progress <= 0.05 ? 1 : progress >= 0.4 ? 0 : 1 - (progress - 0.05) / 0.35;
  const textScale = 1 + progress * 30;
  const textBlur = progress <= 0.05 ? 0 : Math.min(((progress - 0.05) / 0.35) * 14, 14);

  // Video: invisible until 0.25, fully visible by 0.7
  const videoOpacity = progress <= 0.25 ? 0 : progress >= 0.7 ? 1 : (progress - 0.25) / 0.45;
  const videoScale = progress <= 0.25 ? 0.5 : progress >= 0.7 ? 1 : 0.5 + ((progress - 0.25) / 0.45) * 0.5;

  // Scroll button: gone almost immediately
  const scrollBtnOpacity = progress <= 0.03 ? 1 : 0;

  const handleScrollDown = useCallback(() => {
    targetRef.current = 1;
    startAnimation();
  }, [startAnimation]);

  return (
    <main className={styles.page} ref={pageRef}>
      <Navbar />

      {/* Background */}
      <div className={styles.bgImage} />

      {/* Video Layer */}
      <div
        className={styles.videoLayer}
        style={{
          opacity: videoOpacity,
          transform: `scale(${videoScale})`,
        }}
      >
        <div className={styles.aftermovieContainer}>
          <h2 className={styles.aftermovieTitle}>Aftermovie</h2>
          <div className={styles.aftermovieFrame}>
            <Image
              src="/assets/scene.webp"
              alt="Aftermovie placeholder"
              fill
              className={styles.aftermovieBg}
            />
            <div className={styles.aftermovieBorder} />
          </div>
        </div>
      </div>

      {/* Text Layer */}
      <div
        className={styles.textLayer}
        style={{
          opacity: textOpacity,
          transform: `scale(${textScale})`,
          filter: `blur(${textBlur}px)`,
        }}
      >
        <h1 className={styles.title}>About Us</h1>
        <p className={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
          ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
          voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia
          deserunt mollit anim id est laborum.
        </p>
      </div>

      {/* Scroll-down button */}
      <div
        className={styles.scrollDownWrap}
        style={{ opacity: scrollBtnOpacity }}
      >
        <button
          className={styles.scrollDown}
          onClick={handleScrollDown}
          aria-label="Scroll down to aftermovie"
        >
          <span>Scroll Down</span>
          <svg
            className={styles.scrollDownIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      <Atmosphere />
    </main>
  );
}
