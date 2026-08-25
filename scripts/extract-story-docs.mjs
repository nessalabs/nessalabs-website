/**
 * Pulls each component's authored description out of the nessa-ui storybook so
 * the docs quote the library's own words instead of paraphrasing them.
 * Writes registry/story-docs.generated.json.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = process.argv[2] ?? "/Users/code/Documents/nessa/.claude/worktrees/tooltip-scrollable-actions-ed7d1b";
const dir = join(repo, "apps/storybook/stories");

const out = {};
for (const file of readdirSync(dir)) {
  if (!file.endsWith(".stories.tsx")) continue;
  const text = readFileSync(join(dir, file), "utf8");

  const title = text.match(/title:\s*"([^"]+)"/)?.[1];
  const component = text.match(/component:\s*([A-Za-z]+)/)?.[1];

  // meta → parameters.docs.description.component: "…"
  const description = text
    .match(/description:\s*\{\s*component:\s*\n?\s*"((?:[^"\\]|\\.)*)"/)?.[1]
    ?.replace(/\\"/g, '"')
    .replace(/\s+/g, " ");

  // Story names in file order, with their storyDocumentation() blurbs.
  const stories = [];
  const storyRe = /export const ([A-Za-z0-9_]+): Story = \{\s*(?:parameters:\s*storyDocumentation\(\s*\n?\s*"((?:[^"\\]|\\.)*)")?/g;
  let match;
  while ((match = storyRe.exec(text))) {
    stories.push({
      name: match[1],
      note: match[2]?.replace(/\\"/g, '"').replace(/\s+/g, " ") ?? null,
    });
  }

  out[file.replace(".stories.tsx", "")] = { title, component, description, stories };
}

writeFileSync(
  join(root, "registry/story-docs.generated.json"),
  `${JSON.stringify(out, null, 2)}\n`
);
console.log(`extracted docs for ${Object.keys(out).length} story files`);
