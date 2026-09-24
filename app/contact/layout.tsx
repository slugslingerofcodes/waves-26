import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | WAVES 2026",
  description:
    "Get in touch with the WAVES 2026 organising team at BITS Pilani, Goa Campus.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
