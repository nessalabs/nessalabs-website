export type TokenKind =
  | "plain"
  | "comment"
  | "string"
  | "keyword"
  | "number"
  | "tag"
  | "attr"
  | "punct"
  | "fn"
  | "prop";

export interface Token {
  kind: TokenKind;
  value: string;
}

const KEYWORDS = new Set([
  "import", "from", "export", "default", "const", "let", "var", "function",
  "return", "if", "else", "for", "while", "of", "in", "new", "class", "extends",
  "interface", "type", "enum", "implements", "async", "await", "try", "catch",
  "finally", "throw", "switch", "case", "break", "continue", "typeof",
  "instanceof", "as", "satisfies", "true", "false", "null", "undefined", "this",
  "void", "public", "private", "readonly", "static",
]);

const SHELL_BUILTINS = new Set([
  "npx", "npm", "pnpm", "yarn", "bun", "bunx", "cd", "git", "node", "echo",
]);

/**
 * A small tokenizer covering the languages the docs actually show. It is
 * deliberately regex-based and dependency-free: highlighting a doc snippet does
 * not justify shipping a full grammar engine to the client.
 */
export function highlight(code: string, lang = "tsx"): Token[] {
  return lang === "bash" || lang === "sh"
    ? tokenizeShell(code)
    : tokenizeTs(code);
}

function tokenizeShell(code: string): Token[] {
  const tokens: Token[] = [];
  const re = /(#[^\n]*)|("[^"]*"|'[^']*')|(\s+)|(--?[\w-]+)|([^\s]+)/g;
  let match: RegExpExecArray | null;

  while ((match = re.exec(code))) {
    const [value, comment, string, space, flag, word] = match;
    if (comment) tokens.push({ kind: "comment", value });
    else if (string) tokens.push({ kind: "string", value });
    else if (space) tokens.push({ kind: "plain", value });
    else if (flag) tokens.push({ kind: "attr", value });
    else if (word && SHELL_BUILTINS.has(word))
      tokens.push({ kind: "keyword", value });
    else tokens.push({ kind: "plain", value });
  }
  return tokens;
}

function tokenizeTs(code: string): Token[] {
  const tokens: Token[] = [];
  const re = new RegExp(
    [
      "(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)", // 1 comment
      "(`(?:\\\\.|[^`\\\\])*`|\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'\\\\])*')", // 2 string
      "(<\\/?[A-Za-z][\\w.]*)", // 3 jsx tag open
      "([A-Za-z_$][\\w$]*)(?=\\s*\\()", // 4 call
      "([A-Za-z_$][\\w$]*)(?=\\s*[:=](?![=>]))", // 5 property / attribute
      "([A-Za-z_$][\\w$]*)", // 6 word
      "(\\d+(?:\\.\\d+)?)", // 7 number
      "([{}()\\[\\].,;:<>/=+\\-*!?&|]+)", // 8 punctuation
      "(\\s+)", // 9 whitespace
    ].join("|"),
    "g"
  );

  let match: RegExpExecArray | null;
  while ((match = re.exec(code))) {
    const [value, comment, string, tag, call, prop, word, num, punct] = match;
    if (comment) tokens.push({ kind: "comment", value });
    else if (string) tokens.push({ kind: "string", value });
    else if (tag) tokens.push({ kind: "tag", value });
    else if (call) tokens.push({ kind: "fn", value });
    else if (prop)
      tokens.push({ kind: KEYWORDS.has(prop) ? "keyword" : "prop", value });
    else if (word)
      tokens.push({ kind: KEYWORDS.has(word) ? "keyword" : "plain", value });
    else if (num) tokens.push({ kind: "number", value });
    else if (punct) tokens.push({ kind: "punct", value });
    else tokens.push({ kind: "plain", value });
  }
  return tokens;
}
