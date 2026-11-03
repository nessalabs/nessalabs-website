---- MODULE PreviewAvailability ----
EXTENDS Naturals
VARIABLES source, tab, rendered, hadSource, chosenTab
vars == <<source,tab,rendered,hadSource,chosenTab>>
Init == /\ source = TRUE /\ tab = "preview" /\ rendered = "preview" /\ hadSource = TRUE /\ chosenTab = "preview"
SelectCode == /\ source /\ tab' = "code" /\ UNCHANGED <<source,rendered,hadSource,chosenTab>>
SelectPreview == /\ tab' = "preview" /\ UNCHANGED <<source,rendered,hadSource,chosenTab>>
ChangeExample == /\ source /\ source' = FALSE /\ UNCHANGED <<tab,rendered,hadSource,chosenTab>>
Render == /\ rendered' = IF tab = "code" /\ source THEN "code" ELSE "preview"
          /\ hadSource' = source /\ chosenTab' = tab /\ UNCHANGED <<source,tab>>
Next == SelectCode \/ SelectPreview \/ ChangeExample \/ Render
CodeNeedsSource == rendered = "code" => hadSource
PreviewSelection == chosenTab = "preview" => rendered = "preview"
====
