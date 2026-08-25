/**
 * Generates registry/preview-source.generated.ts from registry/previews.tsx.
 *
 * The docs must show the code that actually renders each preview, so the code
 * tab is extracted from the preview file itself rather than written by hand.
 * For every entry in the `previews` object we emit its JSX plus every
 * module-level helper it references, transitively, and an import line for the
 * nessa-ui components it uses.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** The previews map, plus the demo modules its entries render. */
const previewsFile = readFileSync(join(root, "registry/previews.tsx"), "utf8");
const demoDir = join(root, "registry/demos");
const demoFiles = readdirSync(demoDir)
  .filter((name) => name.endsWith(".tsx"))
  .map((name) => readFileSync(join(demoDir, name), "utf8"));

const source = [previewsFile, ...demoFiles].join("\n\n");

/** Everything exported by the library, so we can build the import line. */
const importedNames = [
  ...source.matchAll(/import \{([\s\S]*?)\} from "@nessa-ui\/react";/g),
]
  .map((m) => m[1])
  .join(",")
  .split(",")
  .map((name) => name.trim())
  .filter(Boolean);

const libraryExports = new Set(
  importedNames.map((name) => name.replace(/^type\s+/, ""))
);
/** Names imported for their type only, so the import line can say so. */
const typeOnly = new Set(
  importedNames
    .filter((name) => name.startsWith("type "))
    .map((name) => name.replace(/^type\s+/, ""))
);

/** Reads a balanced region starting at `start`, honouring strings and comments. */
function readBalanced(text, start, open, close) {
  let depth = 0;
  let i = start;
  let quote = null;
  while (i < text.length) {
    const char = text[i];
    const prev = text[i - 1];
    if (quote) {
      if (char === quote && prev !== "\\") quote = null;
      i++;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      i++;
      continue;
    }
    if (char === "/" && text[i + 1] === "/") {
      i = text.indexOf("\n", i) + 1 || text.length;
      continue;
    }
    if (char === open) depth++;
    else if (char === close) {
      depth--;
      if (depth === 0) return i;
    }
    i++;
  }
  return -1;
}

/**
 * Blanks out template-literal contents while preserving offsets, so code inside
 * a demo's sample string is never mistaken for a declaration.
 */
function maskTemplates(text) {
  let out = "";
  let i = 0;
  while (i < text.length) {
    if (text[i] === "`") {
      let j = i + 1;
      while (j < text.length && !(text[j] === "`" && text[j - 1] !== "\\")) j++;
      out += "`" + " ".repeat(Math.max(0, j - i - 1)) + "`";
      i = j + 1;
      continue;
    }
    out += text[i];
    i++;
  }
  return out;
}

/** Module-level `const NAME = …` and `function Name(…) {…}` declarations. */
function collectDeclarations() {
  const declarations = new Map();

  const masked = maskTemplates(source);
  const constRe = /^(?:export )?const ([A-Za-z_$][\w$]*)(?::[^=]+)?\s*=/gm;
  let match;
  while ((match = constRe.exec(masked))) {
    const startOfLine = match.index;
    const valueStart = match.index + match[0].length;
    const opener = source.slice(valueStart).match(/[[{(`]/);
    let end;
    const leading = opener
      ? source.slice(valueStart, valueStart + opener.index).trim()
      : "x";
    if (opener && leading === "" && opener[0] === "`") {
      // Template literal: run to the matching unescaped backtick.
      let i = valueStart + opener.index + 1;
      while (i < source.length && !(source[i] === "`" && source[i - 1] !== "\\")) i++;
      end = i + 1;
    } else if (opener && leading === "") {
      const openIndex = valueStart + opener.index;
      const pairs = { "[": "]", "{": "}", "(": ")" };
      end = readBalanced(source, openIndex, opener[0], pairs[opener[0]]) + 1;
    } else {
      end = source.indexOf("\n", valueStart);
    }
    const text = source.slice(startOfLine, end).replace(/;?\s*$/, "");
    declarations.set(match[1], `${text}${text.endsWith(";") ? "" : ";"}`);
  }

  const fnRe = /^(?:export )?function ([A-Za-z_$][\w$]*)\s*\(/gm;
  while ((match = fnRe.exec(masked))) {
    // Close the parameter list first — destructured params contain braces of
    // their own, so the body starts after the balanced ")".
    const parenStart = match.index + match[0].length - 1;
    const parenEnd = readBalanced(source, parenStart, "(", ")");
    const braceStart = source.indexOf("{", parenEnd);
    const end = readBalanced(source, braceStart, "{", "}") + 1;
    declarations.set(match[1], source.slice(match.index, end));
  }

  return declarations;
}

const declarations = collectDeclarations();

/** Entries of the `previews` object literal, in order. */
function collectPreviews() {
  const objectStart = previewsFile.indexOf(
    "export const previews: Record<string, React.ReactNode> = {"
  );
  const braceStart = previewsFile.indexOf("{", objectStart);
  const braceEnd = readBalanced(previewsFile, braceStart, "{", "}");
  const body = previewsFile.slice(braceStart + 1, braceEnd);

  const entries = [];
  let i = 0;
  while (i < body.length) {
    const keyMatch = /(?:"([^"]+)"|([A-Za-z_$][\w$]*))\s*:/y;
    keyMatch.lastIndex = i;
    // skip whitespace, commas and comments before a key
    const rest = body.slice(i);
    const lead = rest.match(/^[\s,]*(?:\/\/[^\n]*\n[\s,]*)*/);
    if (lead) i += lead[0].length;
    keyMatch.lastIndex = i;
    const key = keyMatch.exec(body);
    if (!key) break;

    const key_ = key[1] ?? key[2];
    let valueStart = key.index + key[0].length;
    while (/\s/.test(body[valueStart])) valueStart++;

    let valueEnd;
    if (body[valueStart] === "(") {
      valueEnd = readBalanced(body, valueStart, "(", ")") + 1;
    } else if (body[valueStart] === "<") {
      // a bare JSX element: read to the comma that ends the entry
      let depth = 0;
      let j = valueStart;
      for (; j < body.length; j++) {
        if (body[j] === "<") depth++;
        else if (body[j] === ">") depth--;
        else if (body[j] === "," && depth <= 0) break;
      }
      valueEnd = j;
    } else {
      valueEnd = body.indexOf(",", valueStart);
    }

    let value = body.slice(valueStart, valueEnd).trim();
    if (value.startsWith("(") && value.endsWith(")")) {
      value = value.slice(1, -1).trim();
    }
    entries.push([key_, dedent(value)]);
    i = valueEnd + 1;
  }
  return entries;
}

function dedent(text) {
  const lines = text.split("\n");
  const indents = lines
    .slice(1)
    .filter((line) => line.trim())
    .map((line) => line.match(/^ */)[0].length);
  const indent = indents.length ? Math.min(...indents) : 0;
  return lines
    .map((line, i) => (i === 0 ? line : line.slice(indent)))
    .join("\n")
    .trim();
}

/** Helper declarations referenced by a snippet, transitively. */
function dependenciesOf(snippet, seen = new Set()) {
  const out = [];
  const identifiers = snippet.match(/\b[A-Za-z_$][\w$]*\b/g) ?? [];
  for (const name of identifiers) {
    if (seen.has(name) || !declarations.has(name)) continue;
    seen.add(name);
    const decl = declarations.get(name);
    out.push(...dependenciesOf(decl, seen), decl);
  }
  return out;
}

function importLine(blocks) {
  const used = new Set();
  const text = blocks.join("\n");
  for (const name of text.match(/\b[A-Z][\w$]*\b/g) ?? []) {
    // Locally declared demos are printed inline; only library names import.
    if (libraryExports.has(name) && !declarations.has(name)) used.add(name);
  }
  if (!used.size) return null;
  const names = [...used]
    .sort()
    .map((name) => (typeOnly.has(name) ? `type ${name}` : name));
  return `import { ${names.join(", ")} } from "@nessa-ui/react"`;
}

const output = [];
for (const [key, snippet] of collectPreviews()) {
  const helpers = [...new Set(dependenciesOf(snippet))];
  const blocks = [...helpers, snippet];
  const imports = importLine(blocks);
  const code = [imports, "", helpers.join("\n\n"), helpers.length ? "" : null, snippet]
    .filter((part) => part !== null && part !== "")
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  output.push([key, code]);
}

const file = `// Generated by scripts/extract-preview-source.mjs — do not edit.
// The docs show the code that actually renders each preview, extracted from
// registry/previews.tsx so the two can never drift.

export const previewSource: Record<string, string> = {
${output
  .map(([key, code]) => `  ${JSON.stringify(key)}: ${JSON.stringify(code)},`)
  .join("\n")}
};
`;

writeFileSync(join(root, "registry/preview-source.generated.ts"), file);
console.log(`extracted ${output.length} preview sources`);
