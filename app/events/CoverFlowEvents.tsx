"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import { motion, type PanInfo } from "framer-motion";
import type { WavesEvent } from "./events-data";
import styles from "./cover-flow-events.module.css";

interface CoverFlowEventsProps {
  events: WavesEvent[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  onOpenEvent: (slug: string) => void;
  fontClass?: string;
}

export default function CoverFlowEvents({
  events,
  activeIndex,
  onSelectIndex,
  onOpenEvent,
  fontClass = "",
}: CoverFlowEventsProps) {
  const total = events.length;
  const dragThreshold = 40;

  const goNext = useCallback(() => {
    if (activeIndex < total - 1) {
      onSelectIndex(activeIndex + 1);
    }
  }, [activeIndex, total, onSelectIndex]);

  const goPrev = useCallback(() => {
    if (activeIndex > 0) {
      onSelectIndex(activeIndex - 1);
    }
  }, [activeIndex, onSelectIndex]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const { offset, velocity } = info;
    if (offset.x < -dragThreshold || velocity.x < -200) {
      goNext();
    } else if (offset.x > dragThreshold || velocity.x > 200) {
      goPrev();
    }
  };

  // 3-Card Stack / Cover Flow calculation matching the user's icon
  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const isCenter = diff === 0;

    let x = diff * 82;
    let scale = isCenter ? 1.0 : 0.86;
    let zIndex = isCenter ? 20 : 10 - Math.abs(diff);
    let opacity = isCenter ? 1 : Math.abs(diff) === 1 ? 0.78 : 0;
    let y = isCenter ? 0 : 12;

    if (Math.abs(diff) > 2) {
      x = diff > 0 ? 200 : -200;
      opacity = 0;
    }

    return { x, y, scale, zIndex, opacity, isCenter };
  };

  return (
    <div className={`${styles.container} ${fontClass}`}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.category}>Waves 2026</span>
        <h2 className={styles.pageTitle}>Fest Events</h2>
      </div>

      {/* 3-Card Stack Arena */}
      <div className={styles.arena}>
        <div className={styles.stage}>
          {events.map((event, i) => {
            const card = getCardStyle(i);

            return (
              <motion.div
                key={event.slug}
                className={styles.cardWrapper}
                style={{
                  zIndex: card.zIndex,
                  pointerEvents: card.opacity === 0 ? "none" : "auto",
                }}
                animate={{
                  x: card.x,
                  y: card.y,
                  scale: card.scale,
                  opacity: card.opacity,
                }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 28,
                  mass: 0.8,
                }}
                drag={card.isCenter ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={handleDragEnd}
                onClick={() => {
                  if (card.isCenter) {
                    onOpenEvent(event.slug);
                  } else {
                    onSelectIndex(i);
                  }
                }}
              >
                <div
                  className={`${styles.cardShell} ${card.isCenter ? styles.cardCenter : styles.cardSide}`}
                >
                  {/* Glow strictly behind the frame following card contours - NO RECTANGLE! */}
                  {card.isCenter && (
                    <div className={styles.frameGlow} aria-hidden="true">
                      <Image
                        src={event.card}
                        alt=""
                        fill
                        sizes="(max-width: 767px) 75vw, 300px"
                        draggable={false}
                        className={styles.glowImg}
                      />
                    </div>
                  )}

                  <Image
                    src={event.card}
                    alt={event.name}
                    fill
                    sizes="(max-width: 767px) 75vw, 300px"
                    priority={i === 0}
                    draggable={false}
                    className={styles.cardImage}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation Chevrons */}
        {activeIndex > 0 && (
          <button
            type="button"
            className={`${styles.chevron} ${styles.chevronLeft}`}
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous event"
          >
            ‹
          </button>
        )}
        {activeIndex < total - 1 && (
          <button
            type="button"
            className={`${styles.chevron} ${styles.chevronRight}`}
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next event"
          >
            ›
          </button>
        )}
      </div>

      {/* Footer / Event Action */}
      <div className={styles.footer}>
        <h3 className={styles.eventName}>{events[activeIndex].name}</h3>

        {/* Clean text link with golden highlight on hover - NO PILL BUTTON! */}
        <button
          type="button"
          className={styles.exploreLink}
          onClick={() => onOpenEvent(events[activeIndex].slug)}
        >
          Explore Event <span className={styles.linkArrow}>→</span>
        </button>

        {/* Dot Indicators */}
        <div className={styles.dotsRow}>
          {events.map((event, i) => (
            <button
              key={event.slug}
              type="button"
              className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
              onClick={() => onSelectIndex(i)}
              aria-label={`Go to ${event.name}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
