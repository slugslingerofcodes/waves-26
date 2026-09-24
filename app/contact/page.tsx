"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import ContactCard from "@/components/ContactCard";
import ContactModal, { type ContactData } from "@/components/ContactModal";
import contacts from "@/data/contacts.json";
import styles from "./contact.module.css";

export default function ContactPage() {
  const [selectedContact, setSelectedContact] = useState<ContactData | null>(null);

  return (
    <main className={styles.page}>
      {/* ── full-page background ── */}
      <div className={styles.bg}>
        <Image
          src="/assets/contact-bg.webp"
          alt=""
          fill
          priority
          sizes="100vw"
        />
      </div>

      <Navbar />

      <h1 className={styles.title}>Contact</h1>

      {/* ── 3×2 card grid ── */}
      <section className={styles.grid}>
        {contacts.map((c) => (
          <ContactCard
            key={c.id}
            name={c.name}
            role={c.role}
            phone={c.phone}
            variant={c.variant as "gold" | "ashes"}
            onClick={() => setSelectedContact(c as ContactData)}
          />
        ))}
      </section>

      {/* ── contact details modal ── */}
      <ContactModal
        contact={selectedContact}
        onClose={() => setSelectedContact(null)}
      />
    </main>
  );
}
