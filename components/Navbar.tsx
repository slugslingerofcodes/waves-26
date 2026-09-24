"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";




export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/home";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Map routes to navbar colour themes
  const navTheme = (() => {
    if (isHome) return "light"; // brown on yellow bg
    if (pathname.startsWith("/events") || pathname.startsWith("/register") || pathname.startsWith("/contact") || pathname.startsWith("/sponsors")) return "dark"; // gold on red/dark bg
    return "light"; // default brown (gallery, about, etc.)
  })();

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

  // Swipe detection for mobile menu
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      const distance = touchStartX - touchEndX;

      // Swipe left (finger moves left) -> open menu
      if (distance > 50) {
        setMobileMenuOpen(true);
      }
      // Swipe right (finger moves right) -> close menu
      else if (distance < -50) {
        setMobileMenuOpen(false);
      }
    };

    // Attach listeners passively for better scroll performance
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const isRegister = pathname === "/register" || pathname.startsWith("/register/");
  const hideLogo = isHome || isRegister;

  const navItems = ["Home", "Events", "Gallery", "About", "Sponsors", "Contact", "Register"];

  // The home page draws its own Figma navigation on desktop,
  // but we still want this shared bar to provide the mobile hamburger menu.
  // We'll just hide the desktop links below.

  const isActive = (item: string) => {
    const route = `/${item.toLowerCase().trim()}`;
    if (item === "Home") return pathname === "/" || pathname === "/home";
    return pathname === route || pathname.startsWith(route + "/");
  };

  return (
    <>
      {/* Full screen beige card overlay for mobile menu — slides down from top */}
      <div
        className={`fixed inset-0 z-40 bg-[#F3E8D0] md:hidden navbar-mobile-overlay ${mobileMenuOpen ? "navbar-mobile-overlay--open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <nav className="fixed inset-0 pointer-events-none z-50" data-theme={navTheme}>

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
        {!isHome && (
          <div className="navbar-desktop-menu hidden md:flex flex-row items-center gap-[clamp(16px,2vw,32px)] z-50">
            {navItems.map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase().trim()}`}
                className={`navbar-link inline-block text-[clamp(16px,2.7vw,35px)] leading-normal transition-all duration-200 ease-out hover:scale-125 hover:drop-shadow-lg focus-visible:scale-110 focus-visible:outline-none${isActive(item) ? " navbar-link--active" : ""}`}
                style={{
                  fontFamily: "'Yasharth', sans-serif",
                }}onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
        )}

        {/* Hamburger Button - Mobile only */}
        <button
          className="navbar-hamburger md:hidden absolute top-[16px] right-[16px] pointer-events-auto z-[60]"
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
