/**
 * The rulebook's pages, rendered from WAVES26 RULEBOOK.pdf to
 * public/rulebook/page-NN.webp at 1280px tall. The PDF mixes three page sizes,
 * so each run of pages records its width, which keeps the layout from jumping
 * while pages load. Re-render the images and update these runs if the PDF changes.
 */
export const RULEBOOK_PDF = "/rulebook/waves26-rulebook.pdf";

export const PAGE_HEIGHT = 1280;

const RUNS: [first: number, last: number, width: number][] = [
  [1, 52, 910],
  [53, 60, 990],
  [61, 72, 910],
  [73, 76, 906],
  [77, 77, 910],
  [78, 82, 990],
  [83, 98, 910],
];

export const PAGES = RUNS.flatMap(([first, last, width]) =>
  Array.from({ length: last - first + 1 }, (_, i) => {
    const n = first + i;
    return { n, width, src: `/rulebook/page-${String(n).padStart(2, "0")}.webp` };
  }),
);

/** The first contents page, which the "Contents" control returns to. */
export const CONTENTS_PAGE = 9;

/**
 * Links over the contents pages (9-12; 10 repeats 9 with Drama lower down).
 * Each entry is [label, target page, x0, y0, x1, y1], the box being the
 * entry's text in PDF points on the 297.75x419.25 page, as PyMuPDF reports it.
 * Section headings go to their divider page; Specials has none, so it goes to
 * its first event.
 */
type TocLink = [label: string, target: number, x0: number, y0: number, x1: number, y1: number];

const FLORENCE_DANCE: TocLink[] = [
  ["Florence", 13, 73, 92, 198, 113],
  ["Dance", 13, 106, 117, 165, 133],
  ["Natyanjali", 20, 98, 136, 173, 152],
  ["Sizzle", 16, 109, 156, 162, 172],
  ["NrityaKala", 18, 93, 175, 178, 191],
  ["Insync", 14, 109, 195, 162, 211],
];

export const TOC_PAGE_SIZE = [297.75, 419.25] as const;

export const TOC_LINKS: Record<number, TocLink[]> = {
  9: [
    ...FLORENCE_DANCE,
    ["Drama", 24, 112, 223, 169, 239],
    ["Rangmanch", 25, 94, 242, 187, 258],
    ["Nukkad Natak", 29, 88, 262, 193, 278],
    ["Off Script", 32, 105, 281, 176, 297],
  ],
  10: [
    ...FLORENCE_DANCE,
    ["Drama", 24, 118, 240, 174, 256],
    ["Rangmanch", 25, 100, 260, 192, 276],
    ["Nukkad Natak", 29, 93, 279, 198, 295],
    ["Off Script", 32, 110, 299, 181, 315],
  ],
  11: [
    ["Music", 37, 112, 65, 162, 81],
    ["Sargam", 44, 106, 85, 168, 101],
    ["Jukebox", 38, 102, 104, 171, 120],
    ["Solonote", 47, 101, 124, 173, 140],
    ["Indian Rock", 49, 91, 143, 182, 159],
    ["Silence of the Amps", 41, 68, 163, 205, 179],
    ["Nova Forma", 52, 89, 191, 195, 207],
    ["Artathon", 56, 110, 211, 175, 227],
    ["Kickstart", 55, 105, 230, 179, 246],
    ["Glam Up!", 57, 104, 250, 180, 266],
    ["Figmenta", 59, 107, 269, 178, 285],
    ["Blackout", 58, 107, 289, 177, 305],
    ["Scribble to Story", 54, 82, 308, 202, 324],
    ["Pixellate", 60, 110, 328, 175, 344],
  ],
  12: [
    ["The Quiz Fest", 66, 85, 65, 196, 80],
    ["Waves Open", 67, 92, 84, 189, 100],
    ["Vices Quiz", 68, 99, 104, 182, 119],
    ["Pop Quiz", 69, 105, 123, 176, 139],
    ["Melas", 70, 112, 142, 169, 158],
    ["Ganimatoonics", 71, 85, 162, 196, 178],
    ["Specials", 72, 112, 185, 185, 200],
    ["Fashion Parade", 72, 88, 204, 208, 220],
    ["Mr and Mrs Waves", 77, 78, 224, 218, 239],
    ["Show me the Funny", 83, 77, 243, 219, 259],
    ["Strangely Familiar", 87, 83, 263, 214, 278],
    ["Film and Photography", 61, 57, 285, 240, 301],
    ["SHo(r)t", 62, 118, 305, 179, 321],
    ["Oh Snap", 64, 114, 324, 182, 340],
  ],
};
