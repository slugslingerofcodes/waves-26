import type { Metadata } from "next";
import Image from "next/image";
import localFont from "next/font/local";
import EventsStage from "./EventsStage";
import styles from "./events.module.css";

const yasharth = localFont({
  src: "../../public/font/Yasharth.ttf",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Events | WAVES 2026",
  description: "Fashparade, Mr & Mrs Waves, Natyanjali and Indie Rock at WAVES 2026.",
};

export default function EventsPage() {
  return (
    <main className={styles.page}>
      <Image
        src="/events/bg-marble.webp"
        alt=""
        fill
        preload
        sizes="100vw"
        className={styles.bg}
      />
      <h1 className={styles.title}>Events</h1>
      <EventsStage fontClass={yasharth.className} />
    </main>
  );
}
