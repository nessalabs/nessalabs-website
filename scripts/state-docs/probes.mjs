const cases = [
  {
    owner: "previews",
    name: "render-code-without-source",
    rule: "CodeNeedsSource",
    from: 'IF tab = "code" /\\ source THEN "code" ELSE "preview"',
    to: 'IF tab = "code" THEN "code" ELSE "preview"',
  },
  {
    owner: "previews",
    name: "ignore-preview-selection",
    rule: "PreviewSelection",
    from: 'IF tab = "code" /\\ source THEN "code" ELSE "preview"',
    to: 'IF source THEN "code" ELSE "preview"',
  },
  {
    owner: "theme",
    name: "leave-dark-class-stale",
    rule: "ConsistentSurfaces",
    from: 'darkClass\' = "light"',
    to: "darkClass' = darkClass",
  },
  {
    owner: "theme",
    name: "gate-visible-change-on-storage",
    rule: "VisibleDespiteStorage",
    from: 'dataTheme\' = "light" /\\ darkClass\' = "light" /\\ colorScheme\' = "light"',
    to: 'dataTheme\' = (IF persists THEN "light" ELSE dataTheme) /\\ darkClass\' = (IF persists THEN "light" ELSE darkClass) /\\ colorScheme\' = (IF persists THEN "light" ELSE colorScheme)',
  },
  {
    owner: "pricing",
    name: "retain-old-search-timer",
    rule: "LatestTimerOnly",
    from: "timers' = {current + 1}",
    to: "timers' = timers \\cup {current + 1}",
  },
  {
    owner: "pricing",
    name: "leave-timer-after-unmount",
    rule: "NoRetiredCallback",
    from: "mounted' = FALSE /\\ timers' = {}",
    to: "mounted' = FALSE /\\ timers' = timers",
  },
];
export const probes = cases.map(({ owner, name, rule, from, to }) => ({
  document: owner,
  name,
  expectedRules: [rule],
  mutate(spec) {
    if (spec.split(from).length !== 2)
      throw new Error("Mutation target must match once");
    return spec.replace(from, to);
  },
}));
