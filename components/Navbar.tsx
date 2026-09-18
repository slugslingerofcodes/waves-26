"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LampToggle from "./LampToggle";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/home";

  const navItems = isHome
    ? ["Home", "Events", "Gallery", "About", "Sponsors"]
    : ["Home", "Events", "Gallery", "About", "Sponsors", "Register"];

  // Check if a nav item matches the current route
  const isActive = (item: string) => {
    const route = `/${item.toLowerCase().trim()}`;
    if (item === "Home") return pathname === "/" || pathname === "/home";
    return pathname === route || pathname.startsWith(route + "/");
  };

  return (
    <nav className="fixed inset-0 pointer-events-none z-50">
      
      {/* Top Left: Waves Logo → links to home (hidden on home page) */}
      {!isHome && (
        <Link href="/home" className="absolute top-[-40px] left-[-30px] pointer-events-auto">
          <Image 
            src="/navbar/waves-logo.png" 
            alt="Waves Logo" 
            width={319} 
            height={128} 
            className="w-[319px] h-auto object-contain" 
            suppressHydrationWarning
          />
        </Link>
      )}

      {/* Navigation Links - Top Right */}
      <div className="absolute top-[20px] right-[20px] flex flex-row items-center gap-[35px] pointer-events-auto">
        {navItems.map((item) => (
          <Link
            key={item}
            href={`/${item.toLowerCase().trim()}`}
            className={`text-[35px] text-[#5C2E0E] leading-normal transition-all duration-200 ease-out hover:scale-125 hover:drop-shadow-lg${isActive(item) ? " navbar-link--active" : ""}`}
            style={{
              fontFamily: "'Yasharth', sans-serif",
            }}
          >
            {item}
          </Link>
        ))}
      </div>

      {/* Lamp Toggle - Home page only */}
      {isHome && (
        <div className="absolute top-[110px] right-[-75px] pointer-events-auto">
          <LampToggle />
        </div>
      )}
    </nav>
  );
}

