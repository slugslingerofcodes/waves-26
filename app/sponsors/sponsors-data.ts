// Placeholders until the real sponsor artwork arrives: drop a logo into
// public/sponsors/ and give the entry a `logo` path to swap the plate out.
export type Sponsor = {
  name: string;
  /** Logo under public/sponsors/. Without one the pedestal carries the name. */
  logo?: string;
  href?: string;
};

export const SPONSORS: Sponsor[] = [
  { name: "Sponsor One" },
  { name: "Sponsor Two" },
  { name: "Sponsor Three" },
  { name: "Sponsor Four" },
  { name: "Sponsor Five" },
  { name: "Media Partner One" },
  { name: "Media Partner Two" },
  { name: "Media Partner Three" },
  { name: "Media Partner Four" },
  { name: "Media Partner Five" },
];

// The frame stacks the pedestals in two staggered rows; alternating keeps the
// two rows the same length however many sponsors are listed.
export const ROWS: Sponsor[][] = [
  SPONSORS.filter((_, i) => i % 2 === 0),
  SPONSORS.filter((_, i) => i % 2 === 1),
];
