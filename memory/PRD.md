# Bilbao Pintxo Passport — PRD

## Original problem statement
Prettify and complete the Bilbao Pintxo Passport website by adding funny colored drawings related to Bilbao (Marijaia, Athletic lion, gigantes y cabezudos, txikiteros, arrantzales, Amatxu de Begoña). Add curiosities of Casco Viejo / Athletic, a "Personajes de Bilbao" section, and a map. Language: Spanish (castellano). Illustration style: hand-drawn comic/cartoon, colorful.

## Tech stack / architecture
- TanStack Start (Vite 8) + React 19 + Tailwind v4 (Lovable project), single page.
- Purely frontend, NO backend. State (sealed stops) persisted in `localStorage` key `bilbao-passport-stamps`.
- Served on port 3000 via supervisor `frontend` program → launcher `/app/frontend/package.json` execs `yarn dev` in `/app`. Port forced to 3000 + `allowedHosts:true` via `vite.config.ts` (`vite.server`). Installed deps with `yarn install --ignore-engines` (TanStack wants node ≥22, pod has node 20 — works fine for dev).
- Map: Leaflet loaded from unpkg CDN client-side (`src/components/RouteMap.tsx`) with OpenStreetMap tiles + numbered teardrop pins.
- Custom illustrations generated (Gemini image), stored in `/app/public/ill/*.png` (served at `/ill/...`). Sticker/comic style on white bg, presented as trading-card tiles.

## Key files
- `src/routes/index.tsx` — full page: hero (cromo tiles), fun-facts marquee, progress, map, 10 stop cards, Personajes section, footer. Contains `stops[]`, `characters[]`, `funFacts[]`.
- `src/components/RouteMap.tsx` — client-only Leaflet map.
- `src/styles.css` — Bilbao-blue theme + festive utilities (confetti, marquee, float, wobble, map-pin).
- `vite.config.ts`, `/app/frontend/package.json` — serving glue for this environment.

## Implemented (2026-06)
- 16 custom comic illustrations (10 pintxos + hero/footer character art) + skyline hero backdrop.
- Illustrated hero, curiosities marquee, progress, Leaflet route map, 10 illustrated stop cards, footer.
- Characters are woven INTO the stop-card curiosities (no separate cromos section): León→card 3, Txikiteros→card 4, Gigantes→card 5, Amatxu→card 7, Arrantzales→card 8, Marijaia→card 9. Casco Viejo facts kept on cards 1, 5, 10. Retos remain only on cards 2 and 6 (removed from 4 and 9 per user).
- "Sello Marijaia": full-screen confetti + Marijaia "¡ZORIONAK!" modal when all 10 stops are sealed, with a "Ver celebración" replay button.
- Tested end-to-end by testing agent: 100% frontend pass.

## Backlog / next
- P2: Extract `stops`/`characters` data + card components into separate files if the page grows.
- P2: Optionally bundle leaflet via npm instead of CDN for offline reliability.
- P2: More stops from README (Amaren, El Puertito variants), share-progress, dark mode.

## Test credentials
None — no authentication, no backend.
