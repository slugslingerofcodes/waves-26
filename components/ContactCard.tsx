import Image from "next/image";
import styles from "@/app/contact/contact.module.css";

/**
 * ContactCard — a two-piece ornate card used on the /contact page.
 *
 * Top piece:  full square emblem image (emblem-gold.webp or emblem-ashes.webp).
 *             The frame, corners, and interior graphic are all baked into the
 *             asset — no CSS border or decoration is applied on top of it.
 * Bottom piece: full nameplate banner image (nameplate-gold.webp or
 *               nameplate-ashes.webp) with an optional name/role text overlay.
 *
 * The card is interactive: clicking a populated card opens the ContactModal
 * showing the full details including phone number.
 */

type ContactCardProps = {
  name: string;
  role: string;
  phone?: string;
  variant: "gold" | "ashes";
  onClick?: () => void;
};

export default function ContactCard({
  name,
  role,
  variant,
  onClick,
}: ContactCardProps) {
  const populated = name.trim().length > 0;
  const isGold = variant === "gold";

  const emblemSrc = isGold
    ? "/assets/emblem-gold.webp"
    : "/assets/emblem-ashes.webp";

  const nameplateSrc = isGold
    ? "/assets/nameplate-gold.webp"
    : "/assets/nameplate-ashes.webp";

  return (
    <button
      type="button"
      className={`${styles.card} ${populated ? styles.cardInteractive : ""}`}
      onClick={populated ? onClick : undefined}
      disabled={!populated}
      aria-haspopup={populated ? "dialog" : undefined}
      aria-label={populated ? `${name}, ${role}. Click for contact details.` : undefined}
    >
      {/* ── single container wrapping emblem square + banner as one cohesive unit ── */}
      <div className={styles.cardContainer}>
        {/* ── top piece: full emblem image (frame + graphic baked in) ── */}
        <div className={styles.emblemWrap}>
          <Image
            src={emblemSrc}
            alt={populated ? `${variant} emblem` : ""}
            fill
            unoptimized
            sizes="(max-width: 639px) 280px, (max-width: 1199px) 250px, 310px"
          />
        </div>

        {/* ── bottom piece: full nameplate banner image ── */}
        <div className={styles.nameplateWrap}>
          <Image
            src={nameplateSrc}
            alt=""
            fill
            sizes="(max-width: 639px) 320px, (max-width: 1199px) 280px, 310px"
          />

          {/* text overlay — name and role, only for populated cards */}
          {populated && (
            <div
              className={`${styles.nameplateText} ${
                isGold ? styles.nameplateTextGold : styles.nameplateTextAshes
              }`}
            >
              <p className={styles.name}>{name}</p>
              {role && <p className={styles.role}>{role}</p>}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
