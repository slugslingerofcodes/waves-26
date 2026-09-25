import type { Metadata } from "next";
import SponsorsMarquee from "./SponsorsMarquee";
import SponsorsVeil from "./SponsorsVeil";
import styles from "./sponsors.module.css";
import Navbar from "@/components/Navbar";
export const metadata: Metadata = {
  title: "Sponsors | WAVES 2026",
  description: "The sponsors and media partners behind WAVES 2026.",
};

export default function SponsorsPage() {
  return (
    <main className={styles.page}>
      <Navbar/>
      <div className={styles.bg} />
      <div className={styles.frame}>
        <h1 className={styles.title}>
          <span>Our Sponsors &amp;</span>
          <span>Media Partners</span>
        </h1>
        <SponsorsMarquee />
      </div>
      <SponsorsVeil />
    </main>
  );
}
