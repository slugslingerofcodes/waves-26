import Image from "next/image";
import styles from "@/app/contact/contact.module.css";

/**
 * ContactCard — a two-piece ornate card used on the /contact page.
 *
 * Top piece:  square frame with a decorative border (gold or ashes variant)
 *             containing an hourglass emblem when populated, empty when not.
 * Bottom piece: ornate nameplate banner IMAGE showing name and role.
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

/** Map (variant, populated) → nameplate asset path */
function getNameplateSrc(variant: "gold" | "ashes", populated: boolean): string {
  if (variant === "gold") {
    return populated
      ? "/assets/nameplate-gold-filled.webp"
      : "/assets/nameplate-gold-empty.webp";
  }
  return populated
    ? "/assets/nameplate-ashes-filled.webp"
    : "/assets/nameplate-ashes-empty.webp";
}

export default function ContactCard({
  name,
  role,
  variant,
  onClick,
}: ContactCardProps) {
  const populated = name.trim().length > 0;
  const isGold = variant === "gold";

  const emblemSrc = isGold
    ? "/assets/hourglass-golden.webp"
    : "/assets/hourglass-ashes.webp";

  const frameClass = [
    styles.frame,
    isGold ? styles.frameGold : styles.frameAshes,
    !populated ? styles.frameEmpty : "",
  ]
    .filter(Boolean)
    .join(" ");

  const nameplateSrc = getNameplateSrc(variant, populated);

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
        {/* ── top piece: ornate square frame ── */}
        <div className={frameClass}>
          {populated && (
            <div className={styles.emblem}>
              <Image
                src={emblemSrc}
                alt={`${variant} emblem`}
                fill
                sizes="(max-width: 639px) 200px, (max-width: 1199px) 250px, 310px"
              />
            </div>
          )}
        </div>

        {/* ── bottom piece: ornate nameplate banner (image-based) ── */}
        <div className={styles.nameplateWrap}>
          <Image
            src={nameplateSrc}
            alt=""
            fill
            sizes="(max-width: 639px) 320px, (max-width: 1199px) 280px, 310px"
          />

          {/* text overlay — displays name and role only */}
          {populated && (
            <div className={styles.nameplateText}>
              <p className={styles.name}>{name}</p>
              {role && <p className={styles.role}>{role}</p>}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
