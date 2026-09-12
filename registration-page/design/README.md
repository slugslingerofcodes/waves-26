# Design source

`figma-exports/` holds the raw PNG frames exported from the Figma file
(RegistrationPage, key `7Msw1YMzDF0g0PRdUlND3d`). They are **source material**,
not site assets -- they live outside `public/` so they are neither served nor
bundled.

The plates the app renders are derived from these and live in `public/waves/`:

| Shipped asset                    | Derived from                        |
| -------------------------------- | ----------------------------------- |
| `stage-individual.webp`          | `individual.png`, form erased       |
| `stage-team.webp`                | `teams.png`, form erased            |
| `stage-main.webp`                | `main.png`, untouched               |
| `wordmark.webp`                  | `main.png`, logo band cropped       |
| `genesis-bg.webp`                | `genesis_bg.png`, resized           |
| `chip-gold.png`, `chip-dark.png` | crops of `main_card 1.png`          |
| `door-left.webp`, `door-right.webp` | `main_card 1.png`, cut along the crack |
| `waves-mark.webp`                | `main.png` (2x), logo matted off the sky |

`stage-main.webp` is the one plate that is **not** cleaned up: the six card
labels are painted into the card art, over the sigils, so removing them takes
the sigils with them. The landing page therefore keeps the artwork whole and
places transparent link hotspots over each card -- see `src/app/page.tsx`.

## How the door panels were cut

The page transition needs the card's two halves to interlock along the crack
painted into it, not along a straight line. The split was traced from the art
rather than drawn by hand:

1. Warmth (`R - B`) separates the halves cleanly -- roughly 40-110 on the gilded
   side, 3-17 on the scorched side.
2. For each row, the crack is the x with the steepest left-to-right fall in
   smoothed warmth. A plain threshold was tried first and drifted off into the
   dark plaque along the top edge; a gradient cannot drift to the edge of its
   search window.
3. The trace walks outwards from the highest-contrast row, allowing at most
   ~22px of movement per row. The crack is jagged but continuous, so a larger
   jump is a detection failure, not the crack.
4. Each panel is the full card canvas with a 2px-feathered alpha cut on that
   path. The two alphas are exact complements, so compositing them reproduces
   the original card with no seam (measured mean error 2/255 after WebP).

Both panels are drawn at `background-size: cover; background-position: center`
on full-viewport boxes, so they scale as one and the crack stays registered at
any window shape.

## How the WAVES crest was matted

There is no clean export of the logo layer, so `waves-mark.webp` is matted out
of a frame. `main.png` is the source: it is the only **2x** export in the set
(2880x2048 against 1440x1024 for the others), so its copy of the mark carries
twice the linear resolution of the same mark in `teams.png`.

1. The sky is estimated by masking the mark out and inpainting the hole from the
   surrounding pixels (normalised convolution, three passes). A per-row linear
   ramp was tried first and left a grey halo -- it cannot model the cloud and
   mountain texture, so that texture was read as part of the logo.
2. Alpha is the distance from that estimate, with a dead zone below it, and the
   colour is un-premultiplied so partly-covered pixels do not drag sky with them.
3. A painted cloud sits behind the mark's right side. Every part of the logo is
   either warm gold or near-black, so the cloud is keyed out on being bright and
   neutral (`luma > 128 && R - B < 14`).

Two sparkles painted into the sky are warm gold, indistinguishable from gold
leaf by any colour test, and are cleared by position: both sit clear of the
letterforms (the S tail ends by x=1140, the tagline by x=745).

Known limits of this route, fixed by exporting the logo layer itself:

- The charcoal half of the lettering is nearly the same value as the sky, so its
  edges are softer than the gilded half. It reads because the crest is lit from
  behind; it would not on a flat dark background.
- The position-based sparkle removal is tied to this exact crop.

## Resolution

`main_card 1.png` (1262x766) is the largest copy of the card art in the set --
the same cards inside `main.png` are smaller still. The doors stretch that art
over the whole viewport, so it is always upscaled: about 2.8x on a 1440x1024
Retina laptop and 4.2x on a 2560x1440 HiDPI display.

The panels are therefore shipped at 2x (2468x1488), resampled with Lanczos and
given a light unsharp pass. That adds no detail the source does not have, but it
moves the upscale off the browser's cheaper filter and holds the acutance --
visibly crisper on the sigil linework at device scale.

Genuinely higher-resolution doors need a larger export of the card layer from
Figma; nothing in `figma-exports/` can provide it.

If a plate is regenerated, refresh its `blurDataURL` in `src/app/plates.ts`
(a 20x14 JPEG data URI of the same image).
