import type { GitCommit, GitCommitDetailsData } from "@nessa-ui/react";

export const gitCommits: GitCommit[] = [
  {
    hash: "c8f1a02e",
    parents: ["e3b9d14a"],
    subject: "Rename elapsed-time port to Clock",
    author: "Nessa",
    date: "2026-09-04T20:55:33Z",
    refs: ["HEAD → main"],
  },
  {
    hash: "e3b9d14a",
    parents: ["a91c4e80"],
    subject: "Add an explicit uptime clock dependency",
    author: "Nessa",
    date: "2026-09-04T20:54:03Z",
  },
  {
    hash: "a91c4e80",
    parents: ["b7d2c10f", "f4e81a39"],
    subject: "Merge conversation echo",
    author: "Saurav",
    date: "2026-09-04T18:40:43Z",
    refs: ["origin/main"],
  },
  {
    hash: "f4e81a39",
    parents: ["d12aa90c"],
    subject: "Fix silent echo failures",
    author: "Nessa",
    date: "2026-09-04T14:34:22Z",
  },
  {
    hash: "d12aa90c",
    parents: ["9c30e551"],
    subject: "Document conversation.echo in the README",
    author: "Nessa",
    date: "2026-09-04T09:16:11Z",
  },
  {
    hash: "9c30e551",
    parents: ["b7d2c10f"],
    subject: "Wire conversation.echo through the client",
    author: "Nessa",
    date: "2026-09-04T09:15:57Z",
  },
  {
    hash: "b7d2c10f",
    parents: ["11ab4d27", "88e0c19b"],
    subject: "Merge stage-scoped local data",
    author: "Saurav",
    date: "2026-09-04T03:52:52Z",
  },
  {
    hash: "88e0c19b",
    parents: ["11ab4d27"],
    subject: "Move keybindings onto the server",
    author: "Nessa",
    date: "2026-09-04T02:10:00Z",
  },
  {
    hash: "11ab4d27",
    parents: ["55f90aa1"],
    subject: "Scope local data by stage",
    author: "Nessa",
    date: "2026-09-03T22:00:00Z",
  },
  {
    hash: "55f90aa1",
    parents: ["2a1e7cc4"],
    subject: "Split the workspace into resizable panes",
    author: "Nessa",
    date: "2026-09-03T18:12:00Z",
  },
  {
    hash: "2a1e7cc4",
    parents: ["0c44b817"],
    subject: "Add the composer queue",
    author: "Nessa",
    date: "2026-09-03T16:40:00Z",
  },
  {
    hash: "0c44b817",
    parents: [],
    subject: "Initial commit",
    author: "Nessa",
    date: "2026-09-01T12:00:00Z",
  },
];

const extras: Record<string, Omit<GitCommitDetailsData, keyof GitCommit>> = {
  c8f1a02e: {
    email: "nessa@nessalabs.ai",
    files: [
      { path: "crates/server/src/app/dependencies.rs", status: "M", additions: 10, deletions: 10 },
      { path: "crates/server/src/app/ports.rs", status: "M", additions: 1, deletions: 1 },
      { path: "crates/server/src/app/state.rs", status: "M", additions: 4, deletions: 4 },
    ],
    comparisonLabel: "Compared with first parent",
    resources: [
      {
        id: "clock-session",
        kind: "Agent session",
        title: "Uptime clock dependency",
        description: "Host-provided session link; not inferred from Git.",
      },
    ],
  },
  a91c4e80: {
    email: "saurav@nessalabs.ai",
    body: "Conversation echo plus a server.ping link probe.",
    files: [
      { path: "README.md", status: "M", additions: 6, deletions: 6 },
      { path: "crates/server/src/app/state.rs", status: "M", additions: 16, deletions: 4 },
      { path: "crates/server/src/conversation/mod.rs", status: "A", additions: 3, deletions: 0 },
      { path: "crates/server/src/lib.rs", status: "M", additions: 6, deletions: 2 },
      { path: "packages/client/src/echo.ts", status: "A", additions: 48, deletions: 0 },
    ],
    comparisonLabel: "Compared with first parent",
    resources: [
      {
        id: "echo-plan",
        kind: "Plan",
        title: "Conversation echo + server ping",
        description: "The host can attach plans, issues or reviews to any commit.",
      },
    ],
  },
};

export function withGitDetails(commit: GitCommit): GitCommitDetailsData {
  return { ...commit, ...extras[commit.hash] };
}

export const gitBranchCommits: GitCommit[] = [
  {
    hash: "merge",
    parents: Array.from({ length: 8 }, (_, i) => `branch-${i}`),
    subject: "Octopus merge: eight branches",
    author: "Nessa",
    date: "2026-09-04T00:00:00Z",
  },
  ...Array.from({ length: 8 }, (_, i) => ({
    hash: `branch-${i}`,
    parents: ["root"],
    subject: `Branch ${i + 1}`,
    author: "Nessa",
    date: "2026-09-03T00:00:00Z",
  })),
  {
    hash: "root",
    parents: [],
    subject: "Shared root",
    author: "Nessa",
    date: "2026-09-01T00:00:00Z",
  },
];
