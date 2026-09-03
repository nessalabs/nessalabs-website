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
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRepo = process.argv[2] ?? "/Users/code/Documents/nessa";
const from = join(sourceRepo, "packages/react/src");
const to = join(root, "nessa-ui");

/**
 * The React package re-exports @nessa-ui/agent-stream, a dependency-free
 * sibling workspace package. It is unpublished like the React one, so it is
 * vendored beside it and resolved through the tsconfig path of the same name.
 * Tests stay behind: they pull in a runner this app does not have.
 */
const streamFrom = join(sourceRepo, "packages/agent-stream/src");
const streamTo = join(root, "agent-stream");

for (const dir of [from, streamFrom]) {
  if (!statSync(dir, { throwIfNoEntry: false })) {
    console.error(`No nessa-ui source at ${dir}`);
    process.exit(1);
  }
}

rmSync(to, { recursive: true, force: true });
mkdirSync(to, { recursive: true });
cpSync(from, to, { recursive: true });

rmSync(streamTo, { recursive: true, force: true });
mkdirSync(streamTo, { recursive: true });
cpSync(streamFrom, streamTo, {
  recursive: true,
  filter: (source) => !/\.test\.tsx?$/.test(source),
});

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
rewrite(streamTo);

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

writeFileSync(
  join(streamTo, "VENDORED.md"),
  `# Vendored @nessa-ui/agent-stream

Copied from \`packages/agent-stream/src\` by \`scripts/sync-nessa-ui.mjs\`,
because @nessa-ui/react re-exports it. Do not edit these files here — change
them in the nessa-ui repo and re-run \`npm run sync:ui\`.
`
);

console.log(`synced @nessa-ui/react@${version} → nessa-ui/, @nessa-ui/agent-stream → agent-stream/`);

/**
 * The catalog and its descriptions are read out of the same checkout, so they
 * cannot drift from the source that was just vendored: a sync that added a
 * component but left the docs quoting the previous storybook is the failure
 * this avoids.
 */
for (const script of ["extract-story-docs.mjs", "build-registry.mjs"]) {
  const result = spawnSync(
    process.execPath,
    [join(root, "scripts", script), sourceRepo],
    { stdio: "inherit" }
  );
  if (result.status !== 0) process.exit(result.status ?? 1);
}
