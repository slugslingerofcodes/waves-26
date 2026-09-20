"use client";
import DoorLink from "@/app/_doors/DoorLink";
import { NAV_LINKS, type NavLink } from "@/components/nav-links";
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

  // The home page and the registration pages draw their own Figma navigation
  // (the home nav also recolours with its golden/ashes lantern), so this bar
  // would sit on top of it.
  if (pathname === "/" || pathname === "/register" || pathname.startsWith("/register/")) {
    return null;
  }

  // Shares its list with the home page's nav so the two cannot drift apart. The
  // home page reaches registration through its own Register button, so only the
  // other tabs carry a Register item here.
  const navItems: NavLink[] = isHome
    ? NAV_LINKS
    : [...NAV_LINKS, { label: "Register", href: "/register" }];

  // Check if a nav item matches the current route
  const isActive = (item: NavLink) => {
    if (!item.href) return false;
    if (item.href === "/") return pathname === "/";
    return pathname === item.href || pathname.startsWith(item.href + "/");
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
        
        {/* Top Left: Waves Logo → links to home (hidden on home page) */}
        {!isHome && (
          <DoorLink href="/" className="absolute top-[-10px] left-[-10px] md:top-[-40px] md:left-[-30px] pointer-events-auto z-50">
            <Image 
              src="/navbar/waves-logo.png" 
              alt="Waves Logo" 
              width={319} 
              height={128} 
              className="w-[180px] md:w-[319px] h-auto object-contain transition-all" 
              suppressHydrationWarning
            />
          </DoorLink>
        )}

        {/* Navigation Links - Top Right (desktop) */}
        <div className="navbar-links-desktop absolute top-[20px] right-[20px] flex flex-row items-center gap-[clamp(12px,2.7vw,35px)] pointer-events-auto">
          {navItems.map((item) => {
            const className = `text-[clamp(16px,2.7vw,35px)] text-[#5C2E0E] leading-normal transition-all duration-200 ease-out${
              item.href ? " hover:scale-125 hover:drop-shadow-lg" : ""
            }${isActive(item) ? " navbar-link--active" : ""}`;
            const style = { fontFamily: "'Yasharth', sans-serif" };
            // Matches the home nav: items with no page yet render inert.
            return item.href ? (
              <DoorLink key={item.label} href={item.href} className={className} style={style}>
                {item.label}
              </DoorLink>
            ) : (
              <span key={item.label} className={className} style={style}>
                {item.label}
              </span>
            );
          })}
        </div>

        {/* Hamburger Button - Mobile only */}
        <button
          className="navbar-hamburger pointer-events-auto z-50"
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
          className={`navbar-mobile-menu pointer-events-auto z-50${mobileMenuOpen ? " navbar-mobile-menu--open" : ""}`}
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

        {/* Lamp Toggle - Home page only */}
        {isHome && (
          <div className="absolute top-[120px] right-[-40px] md:top-[110px] md:right-[-75px] pointer-events-auto z-40 transition-all">
            <LampToggle />
          </div>
        )}
      </nav>
    </>
  );
}
