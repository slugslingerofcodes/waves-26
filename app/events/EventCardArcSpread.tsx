"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type PanInfo } from "framer-motion";
import type { WavesEvent } from "./events-data";
import styles from "./event-card-arc-spread.module.css";

interface EventCardArcSpreadProps {
  event: WavesEvent;
  onClose: () => void;
  fontClass?: string;
}

export default function EventCardArcSpread({
  event,
  onClose,
  fontClass = "",
}: EventCardArcSpreadProps) {
  // 0: Poster, 1: Schedule & Venue, 2: About / Description
  const [activeIndex, setActiveIndex] = useState(1); // Schedule in front by default
  const dragThreshold = 35;

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % 3);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + 3) % 3);
  }, []);

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const { offset, velocity } = info;
    if (offset.x < -dragThreshold || velocity.x < -180) {
      goNext();
    } else if (offset.x > dragThreshold || velocity.x > 180) {
      goPrev();
    }
  };

  // Card Arc calculation: fans 3 cards in an arc formation
  // Center card elevated and upright, left card tilted counter-clockwise, right card tilted clockwise
  const getCardStyle = (index: number) => {
    let diff = index - activeIndex;
    if (diff === 2) diff = -1;
    if (diff === -2) diff = 1;

    const isCenter = diff === 0;
    const isLeft = diff === -1;

    return {
      x: isCenter ? 0 : isLeft ? -78 : 78,
      y: isCenter ? -10 : 20,
      rotate: isCenter ? 0 : isLeft ? -13 : 13,
      scale: isCenter ? 1.04 : 0.88,
      zIndex: isCenter ? 30 : 15,
      opacity: isCenter ? 1 : 0.82,
      isCenter,
    };
  };

  const tabs = [
    { label: "Poster", index: 0 },
    { label: "Schedule", index: 1 },
    { label: "About", index: 2 },
  ];

  return (
    <div className={`${styles.container} ${fontClass}`}>
      {/* Top Header - NO PILL SHAPES! Clean text with golden highlight on hover */}
      <div className={styles.topBar}>
        <button
          type="button"
          onClick={onClose}
          className={styles.backLink}
          aria-label="Back to all events"
        >
          <span className={styles.backArrow}>←</span> All Events
        </button>
        <h2 className={styles.eventName}>{event.name}</h2>
      </div>

      {/* Tabs Navigation - NO PILL SHAPES! Clean typography with golden underline */}
      <div className={styles.tabNav}>
        {tabs.map((tab) => (
          <button
            key={tab.index}
            type="button"
            className={`${styles.tabItem} ${
              activeIndex === tab.index ? styles.tabItemActive : ""
            }`}
            onClick={() => setActiveIndex(tab.index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Arc Arena: 3D fanned cards spread in an arc */}
      <div className={styles.arena}>
        <div className={styles.stage}>
          {[0, 1, 2].map((cardIdx) => {
            const card = getCardStyle(cardIdx);

            return (
              <motion.div
                key={cardIdx}
                className={styles.cardWrapper}
                animate={{
                  x: card.x,
                  y: card.y,
                  rotate: card.rotate,
                  scale: card.scale,
                  opacity: card.opacity,
                  zIndex: card.zIndex,
                }}
                transition={{
                  type: "spring",
                  stiffness: 340,
                  damping: 26,
                  mass: 0.75,
                }}
                drag={card.isCenter ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.22}
                onDragEnd={handleDragEnd}
                onClick={() => {
                  if (!card.isCenter) {
                    setActiveIndex(cardIdx);
                  }
                }}
              >
                <div
                  className={`${styles.cardShell} ${
                    card.isCenter ? styles.cardCenter : styles.cardSide
                  }`}
                >
                  {/* Organic Glow strictly behind the frame - NO RECTANGULAR BOX! */}
                  {card.isCenter && (
                    <div className={styles.frameGlow} aria-hidden="true">
                      <Image
                        src={
                          cardIdx === 0
                            ? event.card
                            : "/events/card-blank.png"
                        }
                        alt=""
                        fill
                        sizes="(max-width: 767px) 75vw, 300px"
                        draggable={false}
                        className={styles.glowImg}
                      />
                    </div>
                  )}

                  {/* Card 0: Poster Artwork */}
                  {cardIdx === 0 && (
                    <Image
                      src={event.card}
                      alt={event.name}
                      fill
                      sizes="(max-width: 767px) 75vw, 300px"
                      priority
                      draggable={false}
                      className={styles.cardImage}
                    />
                  )}

                  {/* Card 1: Schedule & Venue Details */}
                  {cardIdx === 1 && (
                    <>
                      <Image
                        src="/events/card-blank.png"
                        alt=""
                        fill
                        sizes="(max-width: 767px) 75vw, 300px"
                        draggable={false}
                        className={styles.cardImage}
                      />
                      <div className={styles.cardPhotoTop}>
                        <Image
                          src={event.photo}
                          alt={event.name}
                          fill
                          sizes="240px"
                          draggable={false}
                        />
                      </div>
                      <dl className={styles.cardFacts}>
                        <div className={styles.factRow}>
                          <dt className={styles.factLabel}>Date</dt>
                          <dd className={styles.factValue}>{event.date}</dd>
                        </div>
                        <div className={styles.factRow}>
                          <dt className={styles.factLabel}>Time</dt>
                          <dd className={styles.factValue}>{event.time}</dd>
                        </div>
                        <div className={styles.factRow}>
                          <dt className={styles.factLabel}>Venue</dt>
                          <dd className={styles.factValue}>{event.venue}</dd>
                        </div>
                      </dl>
                    </>
                  )}

                  {/* Card 2: About / Description */}
                  {cardIdx === 2 && (
                    <>
                      <Image
                        src="/events/card-blank.png"
                        alt=""
                        fill
                        sizes="(max-width: 767px) 75vw, 300px"
                        draggable={false}
                        className={styles.cardImage}
                      />
                      <div className={styles.cardAboutBox}>
                        <p className={styles.cardDescription}>
                          {event.description}
                        </p>
                      </div>
                      <div className={styles.cardPhotoBottom}>
                        <Image
                          src={event.photo}
                          alt=""
                          fill
                          sizes="240px"
                          draggable={false}
                        />
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Side Chevrons for quick navigation */}
        <button
          type="button"
          className={`${styles.chevron} ${styles.chevronLeft}`}
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          aria-label="Previous card in arc"
        >
          ‹
        </button>
        <button
          type="button"
          className={`${styles.chevron} ${styles.chevronRight}`}
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          aria-label="Next card in arc"
        >
          ›
        </button>
      </div>

      {/* Footer Indicators */}
      <div className={styles.footer}>
        <div className={styles.dotsRow}>
          {tabs.map((tab) => (
            <button
              key={tab.index}
              type="button"
              className={`${styles.dot} ${
                activeIndex === tab.index ? styles.dotActive : ""
              }`}
              onClick={() => setActiveIndex(tab.index)}
              aria-label={`View ${tab.label}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
