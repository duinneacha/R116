# R116 address audit

Audit date: 9 October 2026.  
Live list: `houses.js` (212 properties, 9 streets).  
Nothing in this report was marked verified. No house number or coordinate was changed for this audit.

A copy of the list as it stood for the audit is in `audit/houses-snapshot-2026-10-09.js`.

## Summary

| | |
|---|---|
| Properties in the live list | 212 |
| Streets | 9 |
| Verified at the door | 0 |
| Flagged rows in `address-audit.csv` | 89 |
| Critical or high pins still on the map | 45 |

Confirmed problem: the same house number is stored more than once on one street, and the pins are tens or hundreds of metres apart. That is in the file. It is not a guess.

Not confirmed: which of those pins is the real door. Both stay until someone reads the number on the door.

## How the app is built

The published site is one page, `index.html`, plus `houses.js`. There is no build step. Leaflet draws one marker per house.

Each house is `{n, street, lat, lon}`. The id used for saved progress is `house number|latitude to 5 decimals|longitude to 5 decimals`. A saved "called" house is that string in `localStorage` under `r116-called`. Moving a pin or changing its number creates a new id, so the phone forgets that the old pin was called. The house list itself is not stored on the phone. Only the worker's actions are: called houses, the trace, and the day history (`r116-days`, `r116-round`).

Clearing the round does not delete the house list.

Until this update, `markPassed` marked a house called when the GPS reading was within 25 metres of accuracy and the phone was within 18 metres of the pin. Walking past a door counted as a completed delivery. That no longer happens. Standing near a house only marks it nearby. A delivery is completed only when the house is tapped.

## Duplicate numbers

These were counted from `houses.js`, not taken on trust from an earlier note.

| Street | Number | Pins | Farthest pair | In the preliminary list |
|---|---|---|---|---|
| Delford Drive | 9 | 2 | 221 m | Yes. Coordinates match 51.8768365, -8.4184448 and 51.8787635, -8.4192041 |
| Delford Drive | 22 | 2 | 85 m | Yes |
| Delford Drive | 32 | 2 | 139 m | Yes |
| Delford Drive | 33 | 2 | 151 m | Yes |
| Delford Drive | 34 | 2 | 164 m | Yes |
| Delford Drive | 39 | 2 | 209 m | Yes |
| Delford Drive | 42 | 2 | 213 m | Yes |
| Delford Drive | 44 | 2 | 218 m | Yes |
| Kiltegan Lawn | 2 | 3 | 156 m | Yes |
| Kiltegan Lawn | 10 | 2 | 42 m | Yes |
| Kiltegan Lawn | 13 | 2 | 209 m | Yes |

Kiltegan Lawn 3 and Kiltegan Lawn 4 are not duplicates in the current file. Each has one pin. A second pin for each was removed on 9 October 2026 after a geocoder check, without anyone reading the door. Those removed positions are in the CSV so they can be put back if the door number was the one that was deleted.

No two live properties share the same id. No property is missing a number or a coordinate. None sits more than 800 metres from the middle of the round.

Twenty pairs of pins are under 8 metres apart and are the next number on the same street. Those are treated as neighbouring houses, not as duplicates. One pair is different: Kiltegan Crescent 11 is 7.4 metres from a Kiltegan Lawn 10. That may be one door with two labels.

## Numbers added without a door check

On 6 October 2026, 39 Newlyn Vale pins were added from an address geocoder. On 9 October 2026, 9 Kiltegan Crescent pins and then further Lawn and Kiltegan Park pins were added the same way. Some Lawn pins were also renumbered from geocoder results (5 became 15, 7 became 11).

A geocoder is not a door check. Those pins are unverified. They are listed in the CSV. They were not removed in this audit, because deleting them would itself be a guess.

## Gap that is still empty

The terrace on the east side of Kiltegan Lawn, south of the pins numbered 22, 23 and 24, has houses on the map and no numbers in `houses.js`. No number was invented for them.

## What was not used as proof

OpenStreetMap for this estate has almost no house numbers. Eircode Finder was not queried. No coordinate was accepted because it continued a number sequence. No address in this file is classified as verified.

## Saved progress

Existing called houses, traces and day totals are left as they are. Houses that were marked called only because the phone walked past them stay called until the round is cleared. New address notes are stored separately (`r116-corrections`, `r116-checks`) and do not change `houses.js`.
