#!/usr/bin/env node
/**
 * Pull every exportable asset out of a Figma file into public/figma/.
 *
 * Usage:
 *   FIGMA_TOKEN=<your token> node scripts/figma-import.mjs
 *   FIGMA_TOKEN=<your token> node scripts/figma-import.mjs --vectors --scale 2
 *
 * The token is read from the environment only -- never pass it as an argument,
 * and never commit it. Create one at Figma -> Settings -> Security ->
 * Personal access tokens (scope: File content, read-only).
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const FILE_KEY = process.env.FIGMA_FILE_KEY ?? "7Msw1YMzDF0g0PRdUlND3d";
const TOKEN = process.env.FIGMA_TOKEN;
const OUT_DIR = join(process.cwd(), "public", "figma");
const SPEC_DIR = join(process.cwd(), "figma-export");

const args = process.argv.slice(2);
const INCLUDE_VECTORS = args.includes("--vectors");
const SCALE = Number(args[args.indexOf("--scale") + 1]) || 2;

if (!TOKEN) {
  console.error(
    "Missing FIGMA_TOKEN.\n\n" +
      "  PowerShell:  $env:FIGMA_TOKEN = 'figd_...'\n" +
      "  bash:        export FIGMA_TOKEN=figd_...\n\n" +
      "Get one at https://www.figma.com/developers/api#access-tokens",
  );
  process.exit(1);
}

const api = async (path) => {
  const res = await fetch(`https://api.figma.com/v1${path}`, {
    headers: { "X-Figma-Token": TOKEN },
  });
  if (!res.ok) {
    throw new Error(`Figma API ${res.status} ${res.statusText} on ${path}`);
  }
  return res.json();
};

const slug = (name) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "node";

/** Depth-first walk of the Figma node tree. */
function* walk(node, path = []) {
  yield { node, path };
  for (const child of node.children ?? []) {
    yield* walk(child, [...path, node.name]);
  }
}

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );

async function download(url, filename) {
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  ! failed ${filename} (${res.status})`);
    return false;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(join(OUT_DIR, filename), buf);
  console.log(`  + ${filename} (${(buf.length / 1024).toFixed(1)} KB)`);
  return true;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  console.log(`Reading file ${FILE_KEY} ...`);
  const file = await api(`/files/${FILE_KEY}`);
  console.log(`File: "${file.name}" (last modified ${file.lastModified})\n`);

  // Full node tree -- the source of truth for colours, type and geometry.
  await mkdir(SPEC_DIR, { recursive: true });
  await writeFile(
    join(SPEC_DIR, "document.json"),
    JSON.stringify(file, null, 2),
  );
  console.log("Wrote figma-export/document.json\n");

  const nodes = [...walk(file.document)];
  const manifest = { file: file.name, fileKey: FILE_KEY, assets: [] };
  const used = new Set();

  const uniqueName = (base, ext) => {
    let name = `${base}.${ext}`;
    let n = 2;
    while (used.has(name)) name = `${base}-${n++}.${ext}`;
    used.add(name);
    return name;
  };

  // 1. Raster fills (photos, logos placed as images).
  const refs = new Set();
  for (const { node } of nodes) {
    for (const fill of node.fills ?? []) {
      if (fill.type === "IMAGE" && fill.imageRef) refs.add(fill.imageRef);
    }
  }
  if (refs.size) {
    console.log(`Image fills: ${refs.size}`);
    const { meta } = await api(`/files/${FILE_KEY}/images`);
    for (const ref of refs) {
      const url = meta.images?.[ref];
      if (!url) continue;
      const filename = uniqueName(`fill-${ref.slice(0, 8)}`, "png");
      if (await download(url, filename)) {
        manifest.assets.push({ kind: "fill", imageRef: ref, file: `/figma/${filename}` });
      }
    }
    console.log("");
  }

  // 2. Nodes the designer explicitly marked for export.
  const exportable = nodes.filter(({ node }) => node.exportSettings?.length);

  // 3. Optionally every vector/component too -- catches unmarked icons.
  const vectors = INCLUDE_VECTORS
    ? nodes.filter(
        ({ node }) =>
          !node.exportSettings?.length &&
          ["VECTOR", "COMPONENT", "BOOLEAN_OPERATION"].includes(node.type),
      )
    : [];

  const targets = [
    ...exportable.map((e) => ({
      ...e,
      format: (e.node.exportSettings[0].format ?? "PNG").toLowerCase(),
    })),
    ...vectors.map((v) => ({ ...v, format: "svg" })),
  ];

  if (!targets.length) {
    console.log(
      INCLUDE_VECTORS
        ? "No exportable nodes found."
        : "No nodes marked for export. Re-run with --vectors to grab icons anyway.",
    );
  }

  for (const [format, group] of Object.entries(
    Object.groupBy(targets, (t) => t.format),
  )) {
    console.log(`Exporting ${group.length} node(s) as ${format.toUpperCase()}:`);
    for (const batch of chunk(group, 50)) {
      const ids = batch.map((b) => b.node.id).join(",");
      const params = new URLSearchParams({ ids, format });
      if (format !== "svg") params.set("scale", String(SCALE));
      const { images, err } = await api(`/images/${FILE_KEY}?${params}`);
      if (err) {
        console.warn(`  ! ${err}`);
        continue;
      }
      for (const item of batch) {
        const url = images?.[item.node.id];
        if (!url) continue;
        const filename = uniqueName(slug(item.node.name), format);
        if (await download(url, filename)) {
          manifest.assets.push({
            kind: "export",
            name: item.node.name,
            id: item.node.id,
            path: item.path.join(" / "),
            file: `/figma/${filename}`,
          });
        }
      }
    }
    console.log("");
  }

  await writeFile(
    join(OUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );
  console.log(`Done: ${manifest.assets.length} asset(s) in public/figma/`);
}

main().catch((err) => {
  console.error(`\n${err.message}`);
  if (err.message.includes("403")) {
    console.error("Token rejected -- check it is valid and has file read scope.");
  }
  if (err.message.includes("404")) {
    console.error("File not found -- check FIGMA_FILE_KEY and your access to it.");
  }
  process.exit(1);
});
