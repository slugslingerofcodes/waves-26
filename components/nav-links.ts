/**
 * The one nav list both navigations render: the home page's Figma-styled nav
 * and the shared navbar on every other tab. Keeping it here is what stops the
 * two from drifting apart on labels or targets.
 *
 * Only pages that exist get an href; the rest render inert until their pages
 * are built, so neither nav sends anyone to a 404.
 */
export type NavLink = { label: string; href?: string };

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "Gallery" },
  { label: "About" },
  { label: "Sponsors" },
  { label: "Contact" },
];
