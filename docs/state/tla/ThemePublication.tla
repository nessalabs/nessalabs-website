---- MODULE ThemePublication ----
EXTENDS Naturals
VARIABLES persists, applied, wanted, dataTheme, darkClass, colorScheme, saved
vars == <<persists,applied,wanted,dataTheme,darkClass,colorScheme,saved>>
Init == /\ persists \in BOOLEAN /\ applied = FALSE /\ wanted = "dark" /\ dataTheme = "dark" /\ darkClass = "dark" /\ colorScheme = "dark" /\ saved = "dark"
Toggle == /\ ~applied /\ applied' = TRUE /\ wanted' = "light"
          /\ dataTheme' = "light" /\ darkClass' = "light" /\ colorScheme' = "light"
          /\ saved' = (IF persists THEN "light" ELSE saved) /\ UNCHANGED persists
Next == Toggle
ConsistentSurfaces == dataTheme = darkClass /\ dataTheme = colorScheme
VisibleDespiteStorage == applied => dataTheme = wanted
====
