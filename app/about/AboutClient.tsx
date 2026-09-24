"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Atmosphere from "../register/Atmosphere";
import styles from "./about.module.css";

const THRESHOLD = 1200; // total wheel-delta pixels needed to complete the transition

export default function AboutClient() {
  const [progress, setProgress] = useState(0); // 0 = text fully visible, 1 = video fully visible
  const accumulated = useRef(0);
  const ticking = useRef(false);
  const pageRef = useRef<HTMLElement>(null);

  // ── Wheel (desktop) ──
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    accumulated.current += e.deltaY;
    // Hard clamp
    accumulated.current = Math.max(0, Math.min(accumulated.current, THRESHOLD));

    if (!ticking.current) {
      ticking.current = true;
      requestAnimationFrame(() => {
        setProgress(accumulated.current / THRESHOLD);
        ticking.current = false;
      });
    }
  }, []);

  // ── Touch (mobile) ──
  const touchStartY = useRef(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const currentY = e.touches[0].clientY;
    const delta = touchStartY.current - currentY; // positive = swiping up
    touchStartY.current = currentY;

    accumulated.current += delta * 2; // multiply for sensitivity
    accumulated.current = Math.max(0, Math.min(accumulated.current, THRESHOLD));

    if (!ticking.current) {
      ticking.current = true;
      requestAnimationFrame(() => {
        setProgress(accumulated.current / THRESHOLD);
        ticking.current = false;
      });
    }
  }, []);

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

  const handleScrollDown = () => {
    // Animate to full progress
    const animate = () => {
      accumulated.current = Math.min(accumulated.current + 8, THRESHOLD);
      setProgress(accumulated.current / THRESHOLD);
      if (accumulated.current < THRESHOLD) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

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
