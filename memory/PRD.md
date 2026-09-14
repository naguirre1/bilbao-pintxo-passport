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

## 2026-06 — Foto Personaje
- Cada curiosidad con personaje (tarjetas 3 león, 4 txikitera, 5 gigantes, 7 Amatxu, 8 arrantzale, 9 Marijaia) muestra un pequeño retrato redondo (`.character-badge`, `data-testid="character-img-{id}"`) dentro del recuadro. Sin volver a los cromos.

## 2026-06 — Sellos Ilustrados
- Al sellar una parada, el badge genérico "BILBAO" se sustituye por un sello dibujado tipo tampón: anillo de tinta con el color de la parada, texto arqueado "BILBAO / SELLADO" (SVG textPath) y en el centro el personaje de la parada (o su pintxo si no tiene personaje).
- Componente en `src/routes/index.tsx` (`.ill-stamp`, `data-testid="stamp-badge-{id}"`), estilos en `src/styles.css` (`.ill-stamp*`, variantes de tinta blue/red/green). Conserva la animación `animate-stamp`. Verificado por captura.

## 2026-09 — Retos con foto + Muro de fotos (compartido)
- Backend ligero con TanStack Start `createServerFn` en `src/lib/photos.ts`: `uploadPhoto` (POST, FormData) guarda la imagen en `public/photos/<id>.jpg` + metadatos en `public/photos/_index.json`; `listPhotos` (GET) las devuelve. Fotos PÚBLICAS, visibles por cualquiera (servidas estáticamente).
- 3 retos de foto voluntarios con prompts distintos (variedad): card 4 "Txikitero por un día", card 5 "Modo Gigante", card 9 "Pose Marijaia" (campo `photoChallenge` en `src/routes/index.tsx`).
- `PhotoUploadDialog.tsx`: file picker/cámara, compresión client-side (canvas → jpeg 1280px), nombre opcional. `PhotoWall.tsx`: muro tipo masonry con lightbox (sección `#muro`).
- Cada foto subida se fija sobre su tarjeta (`.photo-pin`, `data-testid="card-photo-pin-{id}"`) y aparece en el muro. Verificado E2E por captura (subida → archivo servido 200 → aparece en muro y en tarjeta).
- NOTA: las fotos viven en el disco del pod (`public/photos`); persisten en preview pero se perderían en un redeploy limpio (no hay object storage/DB configurados).

## 2026-09 — Merge de GitHub (despliegue GitHub Pages)
- Integrados los 6 commits de `origin/main` (naguirre1/bilbao-pintxo-passport) que configuran despliegue estático en GitHub Pages, conservando nuestras features (sellos ilustrados + retos con foto). Merge sin conflictos (commit 44f8de0).
- Nuevos archivos: `.github/workflows/deploy.yml` (Action → build con Bun → deploy a Pages), `index.html` + `src/entry-client.tsx` (entrada SPA client-only con `basepath = BASE_URL`), `vite.config.pages.ts` (build SPA, base `/bilbao-pintxo-passport/`).
- `getAssetUrl(path)` usa `import.meta.env.BASE_URL` para prefijar todas las imágenes `/ill/*` (y el sello). En dev BASE_URL=`/` → sin cambios en preview. `vite.config.ts` añade base/ssr condicionales (solo activos en producción/MODE=spa), preview SSR intacto.
- `package.json`: `build`→pages, `build:ssr`→SSR original, `preview`→pages.
- ⚠️ IMPORTANTE: GitHub Pages es ESTÁTICO. Las server functions (`src/lib/photos.ts`) NO funcionan allí → la subida de fotos y el muro solo funcionan en el preview de Emergent (SSR). En la web de Pages, la ruta/sellos/mapa sí funcionan pero el muro estará vacío y "Subir foto" fallará.

## 2026-09 — Fotos en GitHub Pages con Firebase (Firestore, NoSQL)
- Motivo: GitHub Pages es estático → las server functions no sirven. Se migró el muro de fotos a **Firebase Firestore** (SDK cliente), que funciona igual en preview y en Pages.
- Solo Firestore (sin Storage, para no salir del plan gratis Spark). La imagen se guarda **en base64 dentro del documento** de la colección `photos` (campos: stopId, name, image, createdAt ISO). Compresión adaptativa en cliente (`PhotoUploadDialog.tsx`) para quedar < ~900 KB (límite doc Firestore 1 MB).
- `src/lib/firebase.ts`: init (config web pública hardcodeada, segura), `uploadPhoto(dataUrl, stopId, name)` (addDoc) y `listPhotos()` (query orderBy createdAt desc, limit 300). Reglas Firestore públicas (read/write: if true) — acordado abierto/sin login.
- Eliminado `src/lib/photos.ts` (server fn) y carpeta `public/photos`. Verificado E2E: subida → muro → persiste tras recargar (desde Firestore) sin errores de permisos.
- Proyecto Firebase: `prueba-e0682`. NOTA SEGURIDAD: el usuario pegó por error una clave de servicio (admin) en el chat; se le indicó revocarla. NO usamos Admin SDK; solo config web pública.
- ⚠️ La subida es abierta (cualquiera puede subir). Sin panel de moderación (el usuario lo aceptó público).

## 2026-09 — Fix "página en blanco/bloqueada" en GitHub Pages
- Causa raíz: el build desplegado en Pages estaba OBSOLETO. Versiones previas del muro usaban server functions de TanStack Start (`src/lib/photos.ts` con `createServerFn`, imports server-only) que en un build SPA estático (vite.config.pages.ts, sin plugin de Start) rompen en runtime → pantalla en blanco y el diálogo no abría.
- Ya resuelto en el código actual: fotos con Firebase Firestore (100% cliente), sin imports server-only en el bundle de Pages (verificado: 0 refs a createStart/server-entry en dist).
- Robustez añadida: Leaflet se carga DIFERIDO con IntersectionObserver (fuera del camino crítico) en `RouteMap.tsx`; `entry-client.tsx` envuelto en un ErrorBoundary (evita blanco total ante cualquier error); fuentes de Google en `index.html` no bloqueantes (media=print/onload).
- Verificado por testing_agent (iteration_2.json, ~95%): la home NO se queda en blanco, el diálogo 'Subir mi foto' ABRE (parada y muro), subida a Firestore + persistencia tras recarga OK, mapa no bloquea. Solo 1 issue LOW cosmético (visibilidad del sello en headless).
- ACCIÓN PENDIENTE DEL USUARIO: re-desplegar (Save to GitHub) para publicar esta versión limpia en Pages. El fallo desaparece con el código actual.
