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
- 16 custom comic illustrations (10 pintxos + 6 characters) + skyline hero backdrop.
- Illustrated hero with Marijaia/León/txikitera cromos, blue Bilbao palette, curiosities marquee.
- 10 illustrated stop cards with price, dish, note, and either a Curiosidad or Reto; Sellar/Maps buttons; BILBAO stamp on seal; progress bar; all/pending/visited filters.
- Casco Viejo & Athletic curiosities woven into cards + marquee.
- "Personajes de Bilbao" section: 6 cromos (Marijaia, León, Gigantes y Cabezudos, Txikiteros, Arrantzales, Amatxu de Begoña) with a curiosity each.
- Interactive Leaflet route map with 10 numbered pins (turn green when sealed) + Google Maps popups.
- Tested end-to-end by testing agent: 100% frontend pass, no bugs.

## Backlog / next
- P2: Extract `stops`/`characters` data + card components into separate files if the page grows.
- P2: Optionally bundle leaflet via npm instead of CDN for offline reliability.
- P2: More stops from README (Amaren, El Puertito variants), share-progress, dark mode.

## Test credentials
None — no authentication, no backend.
