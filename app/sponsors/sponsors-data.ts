/**
 * The sponsor list lives in public/sponsors/sponsors.json so it can be edited
 * on the server without a rebuild. Nothing here is bundled: the page fetches
 * the file, which is why the shape is checked rather than trusted.
 */
export type Sponsor = {
  name: string;
  /** Logo under public/sponsors/. Without one the pedestal carries the name. */
  logo?: string;
  href?: string;
};

export const SPONSORS_URL = "/sponsors/sponsors.json";

function isSponsor(value: unknown): value is Sponsor {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.name === "string" &&
    (entry.logo === undefined || entry.logo === null || typeof entry.logo === "string") &&
    (entry.href === undefined || entry.href === null || typeof entry.href === "string")
  );
}

/**
 * Returns the sponsors, or an empty list if the file is missing or malformed --
 * a broken edit should leave the page standing, and say so in the console
 * rather than throwing in front of a visitor.
 */
export async function loadSponsors(signal?: AbortSignal): Promise<Sponsor[]> {
  try {
    const response = await fetch(SPONSORS_URL, { signal });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const body: unknown = await response.json();
    const list = (body as { sponsors?: unknown })?.sponsors;
    if (!Array.isArray(list) || !list.every(isSponsor)) {
      throw new Error("expected { sponsors: [{ name, logo?, href? }] }");
    }
    return list.map(({ name, logo, href }) => ({
      name,
      logo: logo ?? undefined,
      href: href ?? undefined,
    }));
  } catch (error) {
    if ((error as Error)?.name === "AbortError") return [];
    console.warn(`Could not read ${SPONSORS_URL}:`, error);
    return [];
  }
}

/**
 * The frame stacks the pedestals in two staggered rows; alternating keeps the
 * two rows the same length however many sponsors are listed.
 */
export function toRows(sponsors: Sponsor[]): Sponsor[][] {
  return [sponsors.filter((_, i) => i % 2 === 0), sponsors.filter((_, i) => i % 2 === 1)];
}
