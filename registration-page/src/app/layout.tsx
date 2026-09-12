import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import DoorTransition from "./_doors/DoorTransition";
import "./globals.css";

/**
 * The Figma frames render in a high-contrast transitional serif. Playfair is
 * the closest widely available match; swap the import here if the source file
 * names a specific face.
 */
const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

// Per-route pages override both of these.
export const metadata: Metadata = {
  title: "WAVES '26 — Ashes to Ascension",
  description: "WAVES '26 — Ashes to Ascension.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${playfair.variable} h-full antialiased`}>
      <body className="min-h-full">
        <DoorTransition>{children}</DoorTransition>
      </body>
    </html>
  );
}
