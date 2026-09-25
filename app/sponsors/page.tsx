import type { Metadata } from "next";
import SponsorsStage from "./SponsorsStage";
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
      <SponsorsStage />
      <SponsorsVeil />
    </main>
  );
}
