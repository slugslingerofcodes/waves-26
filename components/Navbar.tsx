"use client";
import DoorLink from "@/app/_doors/DoorLink";
import { NAV_LINKS, type NavLink } from "@/components/nav-links";
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
    if (pathname.startsWith("/events") || pathname.startsWith("/register") || pathname.startsWith("/contact") || pathname.startsWith("/gallery")) return "dark"; // gold on red/dark bg
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


  const isRegister = pathname === "/register" || pathname.startsWith("/register/");
  const hideLogo = isHome || isRegister;

  // Shares its list with the home page's nav so the two cannot drift apart.
  const navItems: NavLink[] = [...NAV_LINKS, { label: "Register", href: "/register" }];

  // The home page draws its own Figma navigation on desktop,
  // but we still want this shared bar to provide the mobile hamburger menu.
  // We'll just hide the desktop links below.

  const isActive = (item: NavLink) => {
    if (!item.href) return false;
    if (item.href === "/") return pathname === "/";
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  return (
    <>
      {/* Full screen beige card overlay for mobile menu — slides down from top */}
      <div
        className={`fixed inset-0 z-[80] bg-[#F3E8D0] md:hidden navbar-mobile-overlay ${mobileMenuOpen ? "navbar-mobile-overlay--open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <nav className="fixed inset-0 pointer-events-none z-[90]" data-theme={navTheme}>

        {/* Top Left: Waves Logo → links to home (hidden on home and register pages) */}
        {!hideLogo && (
          <DoorLink href="/" className="absolute top-2 left-3 md:top-3 md:left-5 pointer-events-auto z-50">
            <Image
              src="/navbar/waves-logo.png"
              alt="Waves Logo"
              width={1214}
              height={454}
              className="w-[140px] md:w-[260px] h-auto object-contain transition-all duration-200 hover:scale-105"
              suppressHydrationWarning
              priority
            />
          </DoorLink>
        )}

        {/* Navigation Links - Top Right (desktop) */}
        {!isHome && (
          <div className="navbar-desktop-menu hidden md:flex flex-row items-center gap-[clamp(16px,2vw,32px)] z-50">
            {navItems.map((item) => {
              const className = `navbar-link inline-block text-[clamp(16px,2.7vw,35px)] leading-normal transition-all duration-200 ease-out${
                item.href ? " hover:scale-125 hover:drop-shadow-lg focus-visible:scale-110 focus-visible:outline-none" : ""
              }${isActive(item) ? " navbar-link--active" : ""}`;
              const style = { fontFamily: "'Yasharth', sans-serif" };
              // Matches the home nav: items with no page yet render inert.
              return item.href ? (
                <DoorLink
                  key={item.label}
                  href={item.href}
                  className={className}
                  style={style}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </DoorLink>
              ) : (
                <span key={item.label} className={className} style={style}>
                  {item.label}
                </span>
              );
            })}
          </div>
        )}

        {/* Hamburger Button - Mobile only */}
        <button
          className="navbar-hamburger md:hidden absolute top-[16px] right-[16px] pointer-events-auto z-[100]"
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
          className={`navbar-mobile-menu md:hidden pointer-events-auto z-[95]${mobileMenuOpen ? " navbar-mobile-menu--open" : ""}`}
        >
          {navItems.map((item) => {
            const className = `navbar-mobile-menu__link${isActive(item) ? " navbar-mobile-menu__link--active" : ""}`;
            const style = { fontFamily: "'Yasharth', sans-serif" };
            return item.href ? (
              <DoorLink
                key={item.label}
                href={item.href}
                className={className}
                style={style}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </DoorLink>
            ) : (
              <span key={item.label} className={className} style={style}>
                {item.label}
              </span>
            );
          })}
        </div>

      </nav>
    </>
  );
}
