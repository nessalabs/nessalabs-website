"use client";

import * as React from "react";
import { toISO, type ISODate } from "./date";

function subscribe() {
  // The date only matters at day granularity; nothing to subscribe to.
  return () => {};
}

/**
 * The current date as `YYYY-MM-DD`, or null while server-rendering.
 *
 * Components take `today` as an optional prop so tests and stories can pin it;
 * when it is omitted they fall back to this. The server snapshot is null rather
 * than a guessed date, so a UTC server and a local client can never disagree
 * during hydration — the real date arrives on the client's first render.
 */
export function useSystemToday(): ISODate | null {
  return React.useSyncExternalStore(
    subscribe,
    () => toISO(localMidnight()),
    () => null
  );
}

/** Today in the viewer's own timezone, expressed as a UTC-midnight instant. */
function localMidnight() {
  const now = new Date();
  return new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  );
}
