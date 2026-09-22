"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LampToggle from "./LampToggle";


export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/home";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const isRegister = pathname === "/register" || pathname.startsWith("/register/");
  const hideLogo = isHome || isRegister;

  const navItems = ["Home", "Events", "Gallery", "About", "Sponsors", "Contact", "Register"];

  // Check if a nav item matches the current route
  const isActive = (item: string) => {
    const route = `/${item.toLowerCase().trim()}`;
    if (item === "Home") return pathname === "/" || pathname === "/home";
    return pathname === route || pathname.startsWith(route + "/");
  };

  return (
    <>
      {/* Translucent blurred background overlay for mobile menu */}
      <div 
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <nav className="fixed inset-0 pointer-events-none z-50">
        
        {/* Top Left: Waves Logo → links to home (hidden on home and register pages) */}
        {!hideLogo && (
          <Link href="/" className="absolute top-[-10px] left-[-10px] md:top-[-40px] md:left-[-30px] pointer-events-auto z-50">
            <Image 
              src="/navbar/waves-logo.png" 
              alt="Waves Logo" 
              width={319} 
              height={128} 
              className="w-[180px] md:w-[319px] h-auto object-contain transition-all" 
              suppressHydrationWarning
            />
          </Link>
        )}

        {/* Navigation Links - Top Right (desktop) */}
        <div className={`navbar-desktop-menu hidden md:flex flex-row items-center gap-[clamp(16px,2vw,32px)] z-50 ${mobileMenuOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase().trim()}`}
              className={`inline-block text-[30px] lg:text-[34px] text-[#f9e6c1] leading-[1.15] transition-all duration-300 ease-out hover:scale-110 hover:drop-shadow-[0_0_4px_#cdcdcd] focus-visible:scale-110 focus-visible:drop-shadow-[0_0_4px_#cdcdcd] focus-visible:outline-none${isActive(item) ? " navbar-link--active" : ""}`}
              style={{
                fontFamily: "'Yasharth', sans-serif",
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Hamburger Button - Desktop & Mobile */}
        <button
          className="navbar-hamburger absolute top-[16px] right-[16px] md:top-[25px] md:right-[49px] pointer-events-auto z-[60]"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          <span className={`navbar-hamburger__bar${mobileMenuOpen ? " open" : ""}`} />
          <span className={`navbar-hamburger__bar${mobileMenuOpen ? " open" : ""}`} />
          <span className={`navbar-hamburger__bar${mobileMenuOpen ? " open" : ""}`} />
        </button>

        {/* Mobile Dropdown Menu */}
        <div
          className={`navbar-mobile-menu md:hidden pointer-events-auto z-50${mobileMenuOpen ? " navbar-mobile-menu--open" : ""}`}
        >
          {navItems.map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase().trim()}`}
              className={`navbar-mobile-menu__link${isActive(item) ? " navbar-mobile-menu__link--active" : ""}`}
              style={{ fontFamily: "'Yasharth', sans-serif" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
        </div>

      </nav>
    </>
  );
}
