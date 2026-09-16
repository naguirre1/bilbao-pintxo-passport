import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Camera, Check, Compass, Dices, Flame, ImagePlus, MapPin, PartyPopper, Sparkles, Stamp, Utensils } from "lucide-react";

import { Button } from "@/components/ui/button";
import RouteMap, { type MapStop } from "@/components/RouteMap";
import Celebration from "@/components/Celebration";
import PhotoUploadDialog from "@/components/PhotoUploadDialog";
import PhotoWall from "@/components/PhotoWall";
import TeamChallengeDialog from "@/components/TeamChallengeDialog";
import { listPhotos, type Photo } from "@/lib/firebase";

const getAssetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.startsWith('/') ? path.slice(1) : path}`;

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
  character?: { img: string; alt: string };
  photoChallenge?: { title: string; prompt: string };
  teamChallenge?: boolean;
};

const PIN: Record<Color, string> = { blue: "#1f5fa6", red: "#cf3b2a", green: "#2f9e5f" };
const ACCENT: Record<Color, string> = { blue: "bg-primary", red: "bg-festival", green: "bg-green" };

const STAMPS_KEY = "bilbao-passport-stamps-v2";

const stops: Stop[] = [
  { id: 1, name: "El Globo", handle: "@elglobo.bilbao", dish: "Txangurro gratinado", price: "2,40 €", img: "/ill/txangurro.png", note: "Uno de sus bocados más famosos. El precio de barra puede variar.", maps: "https://www.google.com/maps/search/?api=1&query=El+Globo+Diputacion+8+Bilbao", color: "red", lat: 43.2626, lng: -2.9345, curiosity: "El Casco Viejo son las Siete Calles (Zazpikaleak), el núcleo medieval de la villa del siglo XIV:\n\n• Somera (Goienkale): La calle de arriba.\n• Artekale: La calle del medio.\n• Tendería (Dendarikale): La calle de las tiendas y el comercio.\n• Belostikale: La calle de la pluma o del pescado.\n• Carnicería Vieja (Harategi Zahar): Zona del primer matadero municipal.\n• Barrenkale: La calle de abajo.\n• Barrenkale Barrena: La calle de más abajo (la más próxima a la ría)." },
  { id: 2, name: "La Viña del Ensanche", handle: "@lavinadelensanche", dish: "Foie, hongos y patata", img: "/ill/foie.png", note: "Combinación para buscar en barra; puede depender de la temporada.", maps: "https://www.google.com/maps/search/?api=1&query=La+Vina+del+Ensanche+Diputacion+10+Bilbao", color: "red", lat: 43.2624, lng: -2.9348, curiosity: "La Amatxu de Begoña, patrona de Bizkaia, corona su monte; 'amatxu' significa 'madre' en euskera y su talla data de los siglos XIII–XIV.", character: { img: "/ill/begona.png", alt: "Amatxu de Begoña" } },
  { id: 3, name: "El Puertito", handle: "@el_puertito", dish: "Ostras al gusto", img: "/ill/ostras.png", note: "Pionero de las ostras en Bilbao y Bizkaia, abierto desde 2013.", maps: "https://www.google.com/maps/search/?api=1&query=El+Puertito+Bilbao", color: "blue", lat: 43.2615, lng: -2.9332, challenge: "Elige una ostra que nunca hayas probado y apunta su origen en el pasaporte." },
  { id: 4, name: "Aitaren", handle: "@aitaren", dish: "Bocado de buey", price: "4,95 €", img: "/ill/buey.png", note: "Casa hermana de Amaren, especializada en carne de buey.", maps: "https://www.google.com/maps/search/?api=1&query=Aitaren+Boulevard+Bilbao", color: "red", lat: 43.2601, lng: -2.9282, curiosity: "San Mamés, 'La Catedral', debe su nombre al santo lanzado a los leones: por eso a los jugadores del Athletic se les llama leones, y el club solo juega con cantera vasca desde 1898.", character: { img: "/ill/leon.png", alt: "León del Athletic" } },
  { id: 5, name: "Gure Toki", handle: "@guretoki", dish: "Pintxo creativo de temporada", price: "2,90 €", img: "/ill/creativo.png", note: "Barra premiada donde la propuesta cambia con frecuencia.", maps: "https://www.google.com/maps/search/?api=1&query=Gure+Toki+Plaza+Nueva+12+Bilbao", color: "green", lat: 43.2571, lng: -2.9235, curiosity: "El 11 de octubre es el Día del Txikitero: cuadrillas con txapela recorren el Casco Viejo cantando y brindando con pequeños vasos de vino (txikitos).", character: { img: "/ill/txikitero.png", alt: "Txikitera con txapela" }, photoChallenge: { title: "Txikitero por un día", prompt: "Brinda con tu txikito (vino en vaso pequeño) bien en alto, como una auténtica cuadrilla. ¡Aupa!" } },
  { id: 6, name: "Sorginzulo", handle: "@sorginzulo_bilbao", dish: "Tortilla de patata", price: "12,95 €", img: "/ill/tortilla.png", note: "Finalista nacional de tortilla y premiado por sus pintxos en Bizkaia.", maps: "https://www.google.com/maps/search/?api=1&query=Sorginzulo+Plaza+Nueva+Bilbao", color: "blue", lat: 43.2570, lng: -2.9240, curiosity: "La Plaza Nueva se inauguró en 1851; los domingos acoge mercado de sellos y pintxos, y por sus soportales desfilan los gigantes y cabezudos al son del txistu.", character: { img: "/ill/gigantes.png", alt: "Gigantes de Bilbao" }, teamChallenge: true },
  { id: 7, name: "La Olla", handle: "@laolladebilbao", dish: "Barra de pintxos clásicos", img: "/ill/clasico.png", note: "Parada en la Plaza Nueva; pregunta por el pintxo del día.", maps: "https://www.google.com/maps/search/?api=1&query=La+Olla+Plaza+Nueva+Bilbao", color: "green", lat: 43.2568, lng: -2.9243, challenge: "Aprende a decir «on egin» (buen provecho) antes de probar el pintxo." },
  { id: 8, name: "Taberna Basaras", handle: "Casco Viejo", dish: "Anchoa en trainera", img: "/ill/anchoa.png", note: "Taberna histórica desde 1940, célebre por sus anchoas y vinos.", maps: "https://www.google.com/maps/search/?api=1&query=Taberna+Basaras+Pelota+2+Bilbao", color: "blue", lat: 43.2561, lng: -2.9246, curiosity: "Célebre por sus anchoas desde 1940. El traje de arrantzale y sardinera —pañuelo, mandil de rayas y cesta— llena de color los desfiles, herencia de las traineras que competían por llegar antes a puerto.", character: { img: "/ill/arrantzale.png", alt: "Arrantzale y sardinera" } },
  { id: 9, name: "Gerri Taberna", handle: "Casco Viejo", dish: "Lámina de txuleta con patata", img: "/ill/chuleta.png", note: "Un bocado de txuleta en pleno Casco Viejo.", maps: "https://www.google.com/maps/search/?api=1&query=Gerri+Taberna+Bilbao", color: "red", lat: 43.2556, lng: -2.9232, curiosity: "Marijaia, reina de la Aste Nagusia, preside las fiestas con los brazos en alto desde 1978; la última noche se despide ardiendo sobre la ría entre fuegos artificiales.", character: { img: "/ill/marijaia.png", alt: "Marijaia" }, photoChallenge: { title: "Pose Marijaia", prompt: "Levanta los dos brazos al cielo celebrando como Marijaia en la Aste Nagusia. ¡Gora Bilbo!" } },
  { id: 10, name: "Dumpling+", handle: "Goienkale", dish: "Dumplings caseros", img: "/ill/dumpling.png", note: "Un giro internacional en una de las calles históricas del Casco Viejo.", maps: "https://www.google.com/maps/search/?api=1&query=Dumpling+Goienkale+Bilbao", color: "green", lat: 43.2585, lng: -2.9252, curiosity: "Goienkale (Somera) es una de las siete calles originales de la villa." },
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
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploadStop, setUploadStop] = useState<Stop | null>(null);
  const [teamOpen, setTeamOpen] = useState(false);

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

  useEffect(() => {
    listPhotos().then(setPhotos).catch(() => setPhotos([]));
  }, []);

  const photosByStop = useMemo(() => {
    const map = new Map<number, Photo[]>();
    for (const p of photos) {
      const list = map.get(p.stopId) ?? [];
      list.push(p);
      map.set(p.stopId, list);
    }
    return map;
  }, [photos]);

  const stopName = (id: number) => stops.find((s) => s.id === id)?.name ?? "Bilbao";

  const handleUploaded = (photo: Photo) => {
    setPhotos((current) => [photo, ...current]);
  };

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
    <>
    <main className="min-h-screen overflow-hidden bg-background paper-texture">
      {/* ---------------- HERO ---------------- */}
      <header className="relative isolate bg-primary text-primary-foreground">
        <div className="absolute inset-0 confetti opacity-25" aria-hidden />
        <img src={getAssetUrl("/ill/skyline.png")} alt="" aria-hidden className="pointer-events-none absolute bottom-0 left-0 z-0 w-full select-none object-cover opacity-90" />
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
              Diez barras, historias de las Siete Calles y curiosidades de sus personajes —Marijaia, el león, los gigantes, los txikiteros...— para saborear Bilbao a tu ritmo. Sella cada visita y completa el pasaporte.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild variant="secondary" data-testid="cta-start">
                <a href="#paradas"><Utensils className="size-4" /> Empezar la ruta</a>
              </Button>
              <Button asChild variant="secondary" data-testid="cta-map">
                <a href="#mapa"><MapPin className="size-4" /> Ver el mapa</a>
              </Button>
            </div>
          </div>

          <div className="relative hidden h-[420px] lg:block">
            <div className="float-slow absolute right-0 top-0 z-20 w-64 rotate-3 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-2xl">
              <img src={getAssetUrl("/ill/marijaia.png")} alt="Marijaia, reina de la Aste Nagusia" className="h-64 w-full object-cover" />
              <p className="bg-primary py-1 text-center font-display text-xl tracking-wide text-primary-foreground">MARIJAIA</p>
            </div>
            <div className="wobble absolute -left-2 bottom-2 z-10 w-44 -rotate-6 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-2xl">
              <img src={getAssetUrl("/ill/leon.png")} alt="León del Athletic" className="h-44 w-full object-cover" />
              <p className="bg-festival py-0.5 text-center font-display text-base tracking-wide text-white">EL LEÓN</p>
            </div>
            <div className="absolute left-40 top-20 z-0 w-40 rotate-2 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl">
              <img src={getAssetUrl("/ill/txikitero.png")} alt="Txikitera con txapela" className="h-40 w-full object-cover" />
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
            const stopPhotos = photosByStop.get(stop.id) ?? [];
            return (
              <article key={stop.id} className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-border bg-card shadow-sm transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-xl" data-testid={`stop-card-${stop.id}`}>
                <div className="relative flex h-44 items-center justify-center bg-white">
                  <span className={`absolute left-3 top-3 z-10 flex size-9 items-center justify-center rounded-full font-display text-xl text-white shadow ${ACCENT[stop.color]}`}>{stop.id}</span>
                  {stop.price && <span className="absolute right-3 top-3 z-10 rounded-full bg-sun px-2.5 py-1 font-hand text-sm text-primary shadow-sm">{stop.price}</span>}
                  <img src={getAssetUrl(stop.img)} alt={stop.dish} className="h-44 w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                  {isVisited && (
                    <div className="ill-stamp animate-stamp" data-ink={stop.color} data-testid={`stamp-badge-${stop.id}`}>
                      <svg viewBox="0 0 100 100" className="ill-stamp__ring" aria-hidden>
                        <defs>
                          <path id={`arc-top-${stop.id}`} d="M 15 50 A 35 35 0 0 1 85 50" />
                          <path id={`arc-bot-${stop.id}`} d="M 17 53 A 33 33 0 0 0 83 53" />
                        </defs>
                        <circle cx="50" cy="50" r="46" className="ill-stamp__disc" />
                        <circle cx="50" cy="50" r="47" className="ill-stamp__c-outer" />
                        <circle cx="50" cy="50" r="32" className="ill-stamp__c-inner" />
                        <text className="ill-stamp__txt">
                          <textPath href={`#arc-top-${stop.id}`} startOffset="50%" textAnchor="middle">BILBAO</textPath>
                        </text>
                        <text className="ill-stamp__txt">
                          <textPath href={`#arc-bot-${stop.id}`} startOffset="50%" textAnchor="middle">SELLADO</textPath>
                        </text>
                      </svg>
                      <img src={getAssetUrl(stop.character?.img ?? stop.img)} alt="" className="ill-stamp__art" />
                    </div>
                  )}
                  {stopPhotos.length > 0 && (
                    <a
                      href="#muro"
                      className="photo-pin"
                      title={`${stopPhotos.length} foto(s) en el muro`}
                      data-testid={`card-photo-pin-${stop.id}`}
                    >
                      <img src={stopPhotos[0]?.file} alt={`Foto del reto de ${stopPhotos[0]?.name ?? stop.name}`} />
                      {stopPhotos.length > 1 && <span className="photo-pin__count">+{stopPhotos.length - 1}</span>}
                    </a>
                  )}
                </div>

                <div className={`h-1.5 ${ACCENT[stop.color]}`} />

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-extrabold uppercase text-muted-foreground">{stop.handle}</p>
                  <h3 className="font-display text-3xl leading-tight text-foreground">{stop.name}</h3>
                  <p className="mt-2 flex items-center gap-2 text-base font-extrabold text-primary"><Utensils className="size-4 shrink-0" /> {stop.dish}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{stop.note}</p>

                  {(stop.curiosity || stop.challenge) && (
                    <div className={`mt-4 flex gap-3 rounded-lg p-3.5 text-sm leading-relaxed ${stop.challenge ? "bg-festival/10" : "bg-secondary"}`}>
                      {stop.character && (
                        <img
                          src={getAssetUrl(stop.character.img)}
                          alt={stop.character.alt}
                          title={stop.character.alt}
                          className="character-badge"
                          data-testid={`character-img-${stop.id}`}
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="mb-1 flex items-center gap-1.5 font-extrabold uppercase text-primary">
                          {stop.challenge ? <><Flame className="size-4 text-festival" /> Reto</> : <><Sparkles className="size-4" /> Curiosidad</>}
                        </p>
                        <p className="whitespace-pre-line">{stop.challenge ?? stop.curiosity}</p>
                      </div>
                    </div>
                  )}

                  {stop.photoChallenge && (
                    <div className="mt-4 rounded-lg border-2 border-dashed border-primary/35 bg-sun/15 p-3.5" data-testid={`photo-challenge-${stop.id}`}>
                      <p className="mb-1 flex items-center gap-1.5 text-sm font-extrabold uppercase text-primary">
                        <Camera className="size-4 text-festival" /> Reto foto · {stop.photoChallenge.title}
                      </p>
                      <p className="text-sm leading-relaxed text-ink-soft">{stop.photoChallenge.prompt}</p>
                      {stopPhotos.length > 0 && (
                        <div className="mt-3 flex items-center gap-1.5">
                          <a href="#muro" className="flex -space-x-2" data-testid={`photo-thumbs-${stop.id}`}>
                            {stopPhotos.slice(0, 4).map((p) => (
                              <img key={p.id} src={p.file} alt={`Foto de ${p.name}`} className="size-9 rounded-full border-2 border-white object-cover shadow" />
                            ))}
                          </a>
                          <span className="text-xs font-bold text-muted-foreground">
                            {stopPhotos.length} {stopPhotos.length === 1 ? "foto" : "fotos"}
                          </span>
                        </div>
                      )}
                      <Button
                        variant="stamp"
                        className="mt-3 w-full"
                        onClick={() => setUploadStop(stop)}
                        data-testid={`photo-upload-btn-${stop.id}`}
                      >
                        <ImagePlus className="size-4" /> Subir mi foto
                      </Button>
                    </div>
                  )}

                  {stop.teamChallenge && (
                    <div className="mt-4 rounded-lg border-2 border-dashed border-festival/40 bg-festival/10 p-3.5" data-testid={`team-challenge-block-${stop.id}`}>
                      <p className="mb-1 flex items-center gap-1.5 text-sm font-extrabold uppercase text-festival">
                        <Dices className="size-4" /> Reto sorpresa de cuadrilla
                      </p>
                      <p className="mb-3 text-sm leading-relaxed text-ink-soft">
                        Un reto de team building para animar la parada. ¡Pasaos el móvil!
                      </p>
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => setTeamOpen(true)}
                        data-testid={`team-challenge-btn-${stop.id}`}
                      >
                        <Dices className="size-4" /> ¡Dame un reto!
                      </Button>
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

      {/* ---------------- PHOTO WALL ---------------- */}
      <PhotoWall photos={photos} stopName={stopName} onAdd={() => setUploadStop(stops.find((s) => s.photoChallenge) ?? stops[0] ?? null)} />

      {/* ---------------- FOOTER ---------------- */}
      <footer className="relative overflow-hidden bg-primary px-5 py-10 text-primary-foreground">
        <div className="absolute inset-0 confetti opacity-15" aria-hidden />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-4xl">EXPLORANDO BILBAO</p>
            <p className="mt-1 text-xs font-semibold text-primary-foreground/80">Come, camina, pregunta y cuida la ciudad. On egin! · Aupa!</p>
          </div>
          <div className="w-28 -rotate-3 overflow-hidden rounded-xl border-4 border-white bg-white shadow-lg">
            <img src={getAssetUrl("/ill/gigantes.png")} alt="Gigantes de Bilbao" className="h-28 w-full object-cover" />
          </div>
        </div>
      </footer>

      <Celebration open={showCelebration} onClose={() => setShowCelebration(false)} />
      <TeamChallengeDialog open={teamOpen} onOpenChange={setTeamOpen} />
    </main>
    {uploadStop && (
      <PhotoUploadDialog
        open={true}
        onOpenChange={(o) => !o && setUploadStop(null)}
        stop={uploadStop}
        onUploaded={handleUploaded}
      />
    )}
    </>
  );
}
