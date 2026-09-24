"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./ContactModal.module.css";

export type ContactData = {
  id: number;
  name: string;
  role: string;
  phone: string;
  variant: "gold" | "ashes";
};

type ContactModalProps = {
  contact: ContactData | null;
  onClose: () => void;
};

export default function ContactModal({ contact, onClose }: ContactModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!contact) return;

    // Remember currently focused element to restore when modal closes
    previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;

    // Prevent background scrolling while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus close button on mount
    closeBtnRef.current?.focus();

    // Close on Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElementRef.current?.focus();
    };
  }, [contact, onClose]);

  if (!contact) return null;

  const isGold = contact.variant === "gold";
  const emblemSrc = isGold
    ? "/assets/hourglass-golden.webp"
    : "/assets/hourglass-ashes.webp";

  const modalClass = `${styles.modal} ${
    isGold ? styles.modalGold : styles.modalAshes
  }`;

  // Clean phone number string for tel: link
  const rawPhone = contact.phone.replace(/[^+\d]/g, "");

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div className={modalClass}>
        {/* Ornate corner accents */}
        <span className={styles.cornerTL} aria-hidden="true" />
        <span className={styles.cornerBR} aria-hidden="true" />

        {/* Ornate Close button */}
        <button
          ref={closeBtnRef}
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close contact details"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="2" y1="2" x2="12" y2="12" />
            <line x1="12" y1="2" x2="2" y2="12" />
          </svg>
        </button>

        {/* Hourglass emblem centerpiece */}
        <div className={styles.emblemWrapper}>
          <div className={styles.emblemImg}>
            <Image
              src={emblemSrc}
              alt=""
              fill
              sizes="120px"
              priority
            />
          </div>
        </div>

        {/* Person details */}
        <h2 id="contact-modal-title" className={styles.name}>
          {contact.name}
        </h2>
        {contact.role && <p className={styles.role}>{contact.role}</p>}

        {/* Ornate divider */}
        <div className={styles.divider} aria-hidden="true" />

        {/* Contact info: tappable phone link */}
        {contact.phone && (
          <div className={styles.phoneSection}>
            <span className={styles.phoneLabel}>Direct Contact</span>
            <a href={`tel:${rawPhone}`} className={styles.phoneLink}>
              <svg
                className={styles.phoneIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>{contact.phone}</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
