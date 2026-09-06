"use client";

import * as React from "react";
import {
  GitCommitDetails,
  GitHistory,
  VirtualList,
  type GitCommitDetailsData,
} from "@nessa-ui/react";
import {
  gitBranchCommits,
  gitCommits,
  withGitDetails,
} from "../story-support/git-demo-data";

export function GitHistoryDemo() {
  const [selectedHash, setSelectedHash] = React.useState(gitCommits[0]!.hash);

  return (
    <GitHistory
      className="w-full"
      commits={gitCommits}
      height={320}
      selectedHash={selectedHash}
      onSelect={(commit) => setSelectedHash(commit.hash)}
    />
  );
}

export function GitHistoryBranchesDemo() {
  return (
    <GitHistory
      className="w-full"
      commits={gitBranchCommits}
      height={280}
      palette={["#2764a5", "#a44775", "#36785d", "#9b641e"]}
    />
  );
}

export function GitCommitDetailsDemo() {
  return (
    <GitCommitDetails
      className="w-full max-w-md"
      commit={withGitDetails(gitCommits[0]!)}
      filesHeight={180}
    />
  );
}

export function GitCommitDetailsHistoryDemo() {
  const [selected, setSelected] = React.useState<GitCommitDetailsData | null>(
    withGitDetails(gitCommits[2]!)
  );

  return (
    <div className="grid w-full grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <GitHistory
        className="min-w-0"
        commits={gitCommits}
        height={360}
        selectedHash={selected?.hash}
        onSelect={(commit) => setSelected(withGitDetails(commit))}
      />
      <GitCommitDetails
        className="max-h-[28rem] min-w-0"
        commit={selected}
        onClose={() => setSelected(null)}
        filesHeight={160}
      />
    </div>
  );
}

const virtualRows = Array.from({ length: 200 }, (_, index) => `Row ${index + 1}`);

export function VirtualListDemo() {
  return (
    <VirtualList
      className="w-full rounded-lg border border-border"
      aria-label="Example rows"
      items={virtualRows}
      getKey={(item) => item}
      height={280}
    >
      {(item) => (
        <div className="flex h-full items-center border-b border-border px-3 text-sm">
          {item}
        </div>
      )}
    </VirtualList>
  );
}

export function VirtualListAllDemo() {
  const rows = virtualRows.slice(0, 12);

  return (
    <VirtualList
      className="w-full rounded-lg border border-border"
      aria-label="Every row mounted"
      items={rows}
      getKey={(item) => item}
      height={200}
      virtualize={false}
    >
      {(item) => (
        <div className="flex h-full items-center border-b border-border px-3 text-sm">
          {item}
        </div>
      )}
    </VirtualList>
  );
}
