import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import s from "./shell.module.css";

/** Instrument Serif is the face every text layer in the Figma frames uses. */
const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Register | WAVES '26",
  description: "Register for WAVES '26 — Ashes to Ascension.",
};

import Navbar from "@/components/Navbar";

export default function RegisterLayout({ children }: LayoutProps<"/register">) {
  return (
    <div className={`${instrumentSerif.variable} ${s.shell}`}>
      <Navbar />
      {children}
    </div>
  );
}
