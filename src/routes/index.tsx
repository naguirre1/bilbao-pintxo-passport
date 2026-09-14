import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Compass, Crown, Fish, Flame, Landmark, MapPin, Music, PartyPopper, Sparkles, Stamp, Trophy, Utensils, Wine } from "lucide-react";

import { Button } from "@/components/ui/button";
import RouteMap, { type MapStop } from "@/components/RouteMap";
import Celebration from "@/components/Celebration";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pasaporte de Pintxos — Explorando Bilbao" },
      { name: "description", content: "Sella una ruta ilustrada por los pintxos, historias y personajes más bilbaínos: Marijaia, el león del Athletic, gigantes, txikiteros y más." },
      { property: "og:title", content: "Pasaporte de Pintxos — Explorando Bilbao" },
      { property: "og:description", content: "Una ruta ilustrada por los pintxos y las tradiciones de Bilbao." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Color = "blue" | "red" | "green";

type Stop = {
  id: number;
  name: string;
  handle: string;
  dish: string;
  price?: string;
  img: string;
  note: string;
  maps: string;
  color: Color;
  lat: number;
  lng: number;
  curiosity?: string;
  challenge?: string;
};

const PIN: Record<Color, string> = { blue: "#1f5fa6", red: "#cf3b2a", green: "#2f9e5f" };
const ACCENT: Record<Color, string> = { blue: "bg-primary", red: "bg-festival", green: "bg-green" };

const stops: Stop[] = [
  { id: 1, name: "El Globo", handle: "@elglobo.bilbao", dish: "Txangurro gratinado", price: "2,40 €", img: "/ill/txangurro.png", note: "Uno de sus bocados más famosos. El precio de barra puede variar.", maps: "https://www.google.com/maps/search/?api=1&query=El+Globo+Diputacion+8+Bilbao", color: "red", lat: 43.2626, lng: -2.9345, curiosity: "El Casco Viejo son las Siete Calles (Zazpikaleak), el núcleo medieval de la villa del siglo XIV." },
  { id: 2, name: "El Puertito", handle: "@el_puertito", dish: "Ostras al gusto", img: "/ill/ostras.png", note: "Pionero de las ostras en Bilbao y Bizkaia, abierto desde 2013.", maps: "https://www.google.com/maps/search/?api=1&query=El+Puertito+Bilbao", color: "blue", lat: 43.2615, lng: -2.9332, challenge: "Elige una ostra que nunca hayas probado y apunta su origen en el pasaporte." },
  { id: 3, name: "Aitaren", handle: "@aitaren", dish: "Bocado de buey", price: "4,95 €", img: "/ill/buey.png", note: "Casa hermana de Amaren, especializada en carne de buey.", maps: "https://www.google.com/maps/search/?api=1&query=Aitaren+Boulevard+Bilbao", color: "red", lat: 43.2601, lng: -2.9282, curiosity: "A los jugadores del Athletic se les llama 'leones' por San Mamés, el santo lanzado a los leones." },
  { id: 4, name: "Gure Toki", handle: "@guretoki", dish: "Pintxo creativo de temporada", price: "2,90 €", img: "/ill/creativo.png", note: "Barra premiada donde la propuesta cambia con frecuencia.", maps: "https://www.google.com/maps/search/?api=1&query=Gure+Toki+Plaza+Nueva+12+Bilbao", color: "green", lat: 43.2571, lng: -2.9235, challenge: "Pide una recomendación sin mirar la vitrina y déjate sorprender." },
  { id: 5, name: "Sorginzulo", handle: "@sorginzulo_bilbao", dish: "Tortilla de patata", price: "12,95 €", img: "/ill/tortilla.png", note: "Finalista nacional de tortilla y premiado por sus pintxos en Bizkaia.", maps: "https://www.google.com/maps/search/?api=1&query=Sorginzulo+Plaza+Nueva+Bilbao", color: "blue", lat: 43.2570, lng: -2.9240, curiosity: "La Plaza Nueva se inauguró en 1851; los domingos acoge mercado de sellos, libros y pintxos." },
  { id: 6, name: "La Olla", handle: "@laolladebilbao", dish: "Barra de pintxos clásicos", img: "/ill/clasico.png", note: "Parada en la Plaza Nueva; pregunta por el pintxo del día.", maps: "https://www.google.com/maps/search/?api=1&query=La+Olla+Plaza+Nueva+Bilbao", color: "green", lat: 43.2568, lng: -2.9243, challenge: "Aprende a decir «on egin» (buen provecho) antes de probar el pintxo." },
  { id: 7, name: "La Viña del Ensanche", handle: "@lavinadelensanche", dish: "Foie, hongos y patata", img: "/ill/foie.png", note: "Combinación para buscar en barra; puede depender de la temporada.", maps: "https://www.google.com/maps/search/?api=1&query=La+Vina+del+Ensanche+Diputacion+10+Bilbao", color: "red", lat: 43.2624, lng: -2.9348, curiosity: "La Amatxu de Begoña es la patrona de Bizkaia; su talla data de los siglos XIII–XIV." },
  { id: 8, name: "Taberna Basaras", handle: "Casco Viejo", dish: "Anchoa en trainera", img: "/ill/anchoa.png", note: "Taberna histórica desde 1940, célebre por sus anchoas y vinos.", maps: "https://www.google.com/maps/search/?api=1&query=Taberna+Basaras+Pelota+2+Bilbao", color: "blue", lat: 43.2561, lng: -2.9246, curiosity: "Las traineras nacieron como barcos de pesca; competir por llegar antes a puerto acabó siendo regata." },
  { id: 9, name: "Gerri Taberna", handle: "Casco Viejo", dish: "Lámina de txuleta con patata", img: "/ill/chuleta.png", note: "Un bocado de txuleta en pleno Casco Viejo.", maps: "https://www.google.com/maps/search/?api=1&query=Gerri+Taberna+Bilbao", color: "red", lat: 43.2556, lng: -2.9232, challenge: "Brinda con un «topa» y suma tu sello sin prisas." },
  { id: 10, name: "Dumpling+", handle: "Goienkale", dish: "Dumplings caseros", img: "/ill/dumpling.png", note: "Un giro internacional en una de las calles históricas del Casco Viejo.", maps: "https://www.google.com/maps/search/?api=1&query=Dumpling+Goienkale+Bilbao", color: "green", lat: 43.2585, lng: -2.9252, curiosity: "Goienkale (Somera) es una de las siete calles originales de la villa." },
];

type Character = { key: string; name: string; role: string; img: string; icon: React.ReactNode; curiosity: string };

const characters: Character[] = [
  { key: "marijaia", name: "Marijaia", role: "Reina de la Aste Nagusia", img: "/ill/marijaia.png", icon: <Sparkles className="size-4" />, curiosity: "Creada en 1978 por la artista Mari Puri Herrero, preside las fiestas con los brazos en alto. La última noche se despide ardiendo sobre la ría entre fuegos artificiales." },
  { key: "leon", name: "El León", role: "Símbolo del Athletic", img: "/ill/leon.png", icon: <Trophy className="size-4" />, curiosity: "San Mamés, 'La Catedral', debe su nombre al santo lanzado a los leones. Por eso a los jugadores del Athletic se les llama leones, y el club solo juega con cantera vasca desde 1898." },
  { key: "gigantes", name: "Gigantes y Cabezudos", role: "Reyes de la comparsa", img: "/ill/gigantes.png", icon: <Crown className="size-4" />, curiosity: "Enormes figuras de reyes y reinas que desfilan por las calles al son del txistu, mientras los cabezudos persiguen a la chavalería en fiestas." },
  { key: "txikiteros", name: "Txikiteros", role: "Con txapela y txikito", img: "/ill/txikitero.png", icon: <Wine className="size-4" />, curiosity: "El 11 de octubre es el Día del Txikitero: cuadrillas que recorren el Casco Viejo cantando y brindando con pequeños vasos de vino, la txapela siempre puesta." },
  { key: "arrantzales", name: "Arrantzales", role: "El traje del mar", img: "/ill/arrantzale.png", icon: <Fish className="size-4" />, curiosity: "El traje tradicional de arrantzale y sardinera llena de color los desfiles: pañuelo, mandil de rayas y cesta al hombro." },
  { key: "begona", name: "Amatxu de Begoña", role: "Patrona de Bizkaia", img: "/ill/begona.png", icon: <Landmark className="size-4" />, curiosity: "Su basílica corona el monte Begoña. 'Amatxu' significa 'madre' en euskera; su talla data de los siglos XIII–XIV." },
];

const funFacts = [
  "El Casco Viejo son las Siete Calles: Zazpikaleak.",
  "La Plaza Nueva se inauguró en 1851.",
  "El Athletic solo juega con cantera vasca desde 1898.",
  "El Mercado de la Ribera es uno de los mayores mercados cubiertos de Europa.",
  "A los del Athletic se les llama 'leones' por San Mamés.",
  "La gabarra recorre la ría para celebrar los títulos.",
  "La Amatxu de Begoña es la patrona de Bizkaia.",
  "Txikiteo: rondas de txikitos con la cuadrilla, txapela incluida.",
];

const mapStops: MapStop[] = stops.map((s) => ({ id: s.id, name: s.name, dish: s.dish, lat: s.lat, lng: s.lng, pin: PIN[s.color], maps: s.maps }));

function Index() {
  const [visited, setVisited] = useState<number[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "visited">("all");
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("bilbao-passport-stamps");
    if (saved) {
      try {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every((item) => typeof item === "number")) setVisited(parsed);
      } catch {
        window.localStorage.removeItem("bilbao-passport-stamps");
      }
    }
  }, []);

  const filtered = useMemo(
    () => stops.filter((stop) => filter === "all" || (filter === "visited" ? visited.includes(stop.id) : !visited.includes(stop.id))),
    [filter, visited],
  );
  const progress = Math.round((visited.length / stops.length) * 100);
  const completed = visited.length === stops.length;

  const toggleStamp = (id: number) => {
    setVisited((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      window.localStorage.setItem("bilbao-passport-stamps", JSON.stringify(next));
      if (next.length === stops.length && current.length === stops.length - 1) {
        setTimeout(() => setShowCelebration(true), 380);
      }
      return next;
    });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-background paper-texture">
      {/* ---------------- HERO ---------------- */}
      <header className="relative isolate bg-primary text-primary-foreground">
        <div className="absolute inset-0 confetti opacity-25" aria-hidden />
        <img src="/ill/skyline.png" alt="" aria-hidden className="pointer-events-none absolute bottom-0 left-0 z-0 w-full select-none object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/70 to-primary/20" aria-hidden />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-10">
          <span className="font-display text-2xl tracking-wide" data-testid="brand">EXPLORANDO BILBAO</span>
          <span className="rounded-full border border-primary-foreground/50 px-3 py-1 text-xs font-bold uppercase">Pasaporte 2026</span>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 px-5 pb-40 pt-6 sm:pb-48 lg:grid-cols-[1.3fr_1fr] lg:px-10 lg:pb-56">
          <div className="rise-in">
            <div className="mb-5 flex items-center gap-3 text-sm font-extrabold uppercase">
              <Compass className="size-5" /> 10 paradas · Casco Viejo & Ensanche
            </div>
            <h1 className="font-display text-7xl leading-[.82] drop-shadow-sm sm:text-8xl lg:text-[8.5rem]">
              PASAPORTE
              <br />
              <span className="text-sun">DE PINTXOS</span>
            </h1>
            <p className="mt-6 max-w-xl text-base font-semibold leading-relaxed sm:text-lg">
              Diez barras, historias de las Siete Calles y pequeños retos para saborear Bilbao a tu ritmo. Sella cada visita y colecciona a los personajes más bilbaínos.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild variant="secondary" data-testid="cta-start">
                <a href="#paradas"><Utensils className="size-4" /> Empezar la ruta</a>
              </Button>
              <Button asChild variant="stamp" className="!text-primary-foreground !border-primary-foreground/60 hover:!bg-primary-foreground hover:!text-primary" data-testid="cta-map">
                <a href="#mapa"><MapPin className="size-4" /> Ver el mapa</a>
              </Button>
            </div>
          </div>

          <div className="relative hidden h-[420px] lg:block">
            <div className="float-slow absolute right-0 top-0 z-20 w-64 rotate-3 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-2xl">
              <img src="/ill/marijaia.png" alt="Marijaia, reina de la Aste Nagusia" className="h-64 w-full object-cover" />
              <p className="bg-primary py-1 text-center font-display text-xl tracking-wide text-primary-foreground">MARIJAIA</p>
            </div>
            <div className="wobble absolute -left-2 bottom-2 z-10 w-44 -rotate-6 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-2xl">
              <img src="/ill/leon.png" alt="León del Athletic" className="h-44 w-full object-cover" />
              <p className="bg-festival py-0.5 text-center font-display text-base tracking-wide text-white">EL LEÓN</p>
            </div>
            <div className="absolute left-40 top-20 z-0 w-40 rotate-2 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl">
              <img src="/ill/txikitero.png" alt="Txikitera con txapela" className="h-40 w-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      {/* ---------------- FUN FACTS MARQUEE ---------------- */}
      <section aria-label="Curiosidades de Bilbao" className="relative z-20 -mt-6 overflow-hidden border-y-2 border-primary/20 bg-sun py-3 text-primary">
        <div className="marquee">
          {[...funFacts, ...funFacts].map((fact, i) => (
            <span key={i} className="flex shrink-0 items-center gap-2 font-hand text-lg">
              <Sparkles className="size-4" /> {fact}
            </span>
          ))}
        </div>
      </section>

      {/* ---------------- PROGRESS ---------------- */}
      <section className="border-b border-border bg-card" aria-label="Progreso del pasaporte">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-7 sm:grid-cols-[1fr_auto] sm:items-center lg:px-10">
          <div>
            <div className="mb-2 flex justify-between text-sm font-extrabold">
              <span data-testid="progress-count">{visited.length} de {stops.length} sellos</span>
              <span data-testid="progress-percent">{progress}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-festival transition-all duration-500" style={{ width: `${progress}%` }} data-testid="progress-bar" />
            </div>
          </div>
          {completed ? (
            <Button variant="primary" onClick={() => setShowCelebration(true)} data-testid="celebration-replay">
              <PartyPopper className="size-4" /> Ver celebración
            </Button>
          ) : (
            <p className="text-sm font-semibold text-muted-foreground">Tu progreso se guarda en este dispositivo.</p>
          )}
        </div>
      </section>

      {/* ---------------- MAP ---------------- */}
      <section id="mapa" className="mx-auto max-w-7xl px-5 py-16 lg:px-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-extrabold uppercase text-festival">El mapa</p>
          <h2 className="font-display text-6xl leading-none text-primary sm:text-7xl">LA RUTA SOBRE EL PLANO</h2>
          <p className="mt-3 max-w-2xl text-sm font-semibold text-ink-soft">Todas las paradas caben en un paseo por el Casco Viejo y el Ensanche. Toca un chincheta para ver el pintxo y abrir Google Maps.</p>
        </div>
        <div className="overflow-hidden rounded-2xl border-2 border-primary/25 shadow-md">
          <RouteMap stops={mapStops} visited={visited} />
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold">
          <span className="flex items-center gap-2"><i className="inline-block size-3 rounded-full" style={{ background: PIN.blue }} /> Por sellar</span>
          <span className="flex items-center gap-2"><i className="inline-block size-3 rounded-full" style={{ background: "#2f9e5f" }} /> Sellado</span>
        </div>
      </section>

      {/* ---------------- STOPS ---------------- */}
      <section id="paradas" className="mx-auto max-w-7xl px-5 pb-20 lg:px-10">
        <div className="mb-9 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-extrabold uppercase text-festival">Las paradas</p>
            <h2 className="font-display text-6xl leading-none text-primary sm:text-7xl">ELIGE TU PRÓXIMO PINTXO</h2>
          </div>
          <div className="flex gap-2" role="group" aria-label="Filtrar paradas">
            {(["all", "pending", "visited"] as const).map((value) => (
              <Button key={value} variant={filter === value ? "primary" : "secondary"} onClick={() => setFilter(value)} data-testid={`filter-${value}`}>
                {value === "all" ? "Todas" : value === "pending" ? "Pendientes" : "Selladas"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((stop) => {
            const isVisited = visited.includes(stop.id);
            return (
              <article key={stop.id} className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-border bg-card shadow-sm transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-xl" data-testid={`stop-card-${stop.id}`}>
                <div className="relative flex h-44 items-center justify-center bg-white">
                  <span className={`absolute left-3 top-3 z-10 flex size-9 items-center justify-center rounded-full font-display text-xl text-white shadow ${ACCENT[stop.color]}`}>{stop.id}</span>
                  {stop.price && <span className="absolute right-3 top-3 z-10 rounded-full bg-sun px-2.5 py-1 font-hand text-sm text-primary shadow-sm">{stop.price}</span>}
                  <img src={stop.img} alt={stop.dish} className="h-44 w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                  {isVisited && (
                    <span className="stamp-mark animate-stamp absolute bottom-2 right-3 flex size-16 items-center justify-center rounded-full border-2 border-primary bg-card/70 font-display text-lg text-primary" data-testid={`stamp-badge-${stop.id}`}>
                      BILBAO
                    </span>
                  )}
                </div>

                <div className={`h-1.5 ${ACCENT[stop.color]}`} />

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-extrabold uppercase text-muted-foreground">{stop.handle}</p>
                  <h3 className="font-display text-3xl leading-tight text-foreground">{stop.name}</h3>
                  <p className="mt-2 flex items-center gap-2 text-base font-extrabold text-primary"><Utensils className="size-4 shrink-0" /> {stop.dish}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{stop.note}</p>

                  {(stop.curiosity || stop.challenge) && (
                    <div className={`mt-4 rounded-lg p-3.5 text-sm leading-relaxed ${stop.challenge ? "bg-festival/10" : "bg-secondary"}`}>
                      <p className="mb-1 flex items-center gap-1.5 font-extrabold uppercase text-primary">
                        {stop.challenge ? <><Flame className="size-4 text-festival" /> Reto</> : <><Sparkles className="size-4" /> Curiosidad</>}
                      </p>
                      {stop.challenge ?? stop.curiosity}
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-2 pt-1">
                    <Button variant={isVisited ? "primary" : "stamp"} onClick={() => toggleStamp(stop.id)} data-testid={`stamp-btn-${stop.id}`}>
                      {isVisited ? <Check className="size-4" /> : <Stamp className="size-4" />}
                      {isVisited ? "Sellado" : "Sellar visita"}
                    </Button>
                    <Button asChild variant="secondary" data-testid={`maps-btn-${stop.id}`}>
                      <a href={stop.maps} target="_blank" rel="noreferrer"><MapPin className="size-4" /> Maps</a>
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        {filtered.length === 0 && <p className="rounded-xl border-2 border-dashed border-border bg-card p-10 text-center font-bold">No hay paradas en este filtro.</p>}
      </section>

      {/* ---------------- CHARACTERS ---------------- */}
      <section id="personajes" className="relative border-t-2 border-primary/15 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-10">
          <div className="mb-9">
            <p className="mb-2 flex items-center gap-2 text-sm font-extrabold uppercase text-festival"><Music className="size-4" /> Álbum de cromos</p>
            <h2 className="font-display text-6xl leading-none text-primary sm:text-7xl">PERSONAJES DE BILBAO</h2>
            <p className="mt-3 max-w-2xl text-sm font-semibold text-ink-soft">Los rostros que dan color a las fiestas y a la ría. Cada cromo, su historia.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {characters.map((c) => (
              <article key={c.key} className="group flex flex-col overflow-hidden rounded-2xl border-2 border-border bg-card shadow-sm transition-transform duration-300 hover:-translate-y-1.5 hover:rotate-[-0.5deg] hover:shadow-xl" data-testid={`character-${c.key}`}>
                <div className="flex h-52 items-center justify-center bg-white">
                  <img src={c.img} alt={c.name} className="h-52 w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="mb-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-sun px-2.5 py-0.5 text-xs font-extrabold uppercase text-primary">{c.icon}{c.role}</span>
                  <h3 className="font-display text-3xl leading-tight text-foreground">{c.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.curiosity}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="relative overflow-hidden bg-primary px-5 py-10 text-primary-foreground">
        <div className="absolute inset-0 confetti opacity-15" aria-hidden />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-4xl">EXPLORANDO BILBAO</p>
            <p className="mt-1 text-xs font-semibold text-primary-foreground/80">Come, camina, pregunta y cuida la ciudad. On egin! · Aupa!</p>
          </div>
          <div className="w-28 -rotate-3 overflow-hidden rounded-xl border-4 border-white bg-white shadow-lg">
            <img src="/ill/gigantes.png" alt="Gigantes de Bilbao" className="h-28 w-full object-cover" />
          </div>
        </div>
      </footer>

      <Celebration open={showCelebration} onClose={() => setShowCelebration(false)} />
    </main>
  );
}
