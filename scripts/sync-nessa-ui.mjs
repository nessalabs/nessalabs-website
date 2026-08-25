/**
 * Vendors @nessa-ui/react into this repo.
 *
 * The website documents the real library, so its source is copied in rather
 * than re-implemented. Run `npm run sync:ui -- <path-to-nessa-checkout>` after
 * changing the package; the only edits made here are import rewrites, because
 * the package resolves "@/…" against its own src while this app resolves it
 * against the repo root.
 *
 * Publishing @nessa-ui/react to npm would replace this script with a plain
 * dependency — that is the intended end state.
 */
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRepo = process.argv[2] ?? "/Users/code/Documents/nessa";
const from = join(sourceRepo, "packages/react/src");
const to = join(root, "nessa-ui");

if (!statSync(from, { throwIfNoEntry: false })) {
  console.error(`No nessa-ui source at ${from}`);
  process.exit(1);
}

rmSync(to, { recursive: true, force: true });
mkdirSync(to, { recursive: true });
cpSync(from, to, { recursive: true });

/** Rewrite the package's own "@/…" imports to paths that resolve here. */
function rewrite(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      rewrite(path);
      continue;
    }
    if (!/\.(tsx?|css)$/.test(entry.name)) continue;

    const text = readFileSync(path, "utf8");
    const next = text.replace(/(["'])@\/([^"']+)\1/g, (_, quote, target) => {
      const absolute = join(to, target);
      let rel = relative(dirname(path), absolute).replace(/\\/g, "/");
      if (!rel.startsWith(".")) rel = `./${rel}`;
      return `${quote}${rel}${quote}`;
    });
    if (next !== text) writeFileSync(path, next);
  }
}

rewrite(to);

const version = JSON.parse(
  readFileSync(join(sourceRepo, "packages/react/package.json"), "utf8")
).version;

writeFileSync(
  join(to, "VENDORED.md"),
  `# Vendored @nessa-ui/react

Version ${version}, copied from \`packages/react/src\` by
\`scripts/sync-nessa-ui.mjs\`. Do not edit these files here — change them in the
nessa-ui repo and re-run \`npm run sync:ui\`.
`
);

console.log(`synced @nessa-ui/react@${version} → nessa-ui/`);
