import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Compass, MapPin, Sparkles, Stamp, Utensils } from "lucide-react";

import crowdAsset from "@/assets/marijaia-multitud.png.asset.json";
import bargeAsset from "@/assets/gabarra-athletic.png.asset.json";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pasaporte de pintxos — Explorando Bilbao" },
      { name: "description", content: "Sella una ruta por los pintxos, historias y rincones más bilbaínos." },
      { property: "og:title", content: "Pasaporte de pintxos — Explorando Bilbao" },
      { property: "og:description", content: "Sella una ruta por los pintxos, historias y rincones más bilbaínos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Stop = {
  id: number;
  name: string;
  handle: string;
  dish: string;
  price?: string;
  note: string;
  maps: string;
  color: "blue" | "red" | "green";
  curiosity?: string;
  challenge?: string;
};

const stops: Stop[] = [
  { id: 1, name: "El Globo", handle: "@elglobo.bilbao", dish: "Txangurro gratinado", note: "Uno de sus bocados más conocidos. El precio de barra puede cambiar.", maps: "https://www.google.com/maps/search/?api=1&query=El+Globo+Plaza+Nueva+1+Bilbao", color: "red", curiosity: "Plaza Nueva se inauguró en 1851 y hoy es uno de los grandes centros del pintxo bilbaíno." },
  { id: 2, name: "El Puertito", handle: "@el_puertito", dish: "Ostras al gusto", price: "desde 1,90 €*", note: "Pionero de las ostras en Bilbao y Bizkaia, abierto desde 2013.", maps: "https://www.google.com/maps/search/?api=1&query=El+Puertito+Bilbao", color: "blue", challenge: "Elige una ostra que nunca hayas probado y apunta su origen." },
  { id: 3, name: "Aitaren Boulevard", handle: "@aitaren", dish: "Bocado de buey", price: "4,95 € aportado*", note: "Casa hermana de Amaren, especializada en carne de buey.", maps: "https://www.google.com/maps/search/?api=1&query=Aitaren+Boulevard+Bilbao", color: "red", curiosity: "A los jugadores del Athletic se les llama leones por San Mamés, patrón representado junto a un león." },
  { id: 4, name: "Gure Toki", handle: "@guretoki", dish: "Pintxo creativo de temporada", price: "2,90 € aportado*", note: "Una barra premiada donde la propuesta cambia con frecuencia.", maps: "https://www.google.com/maps/search/?api=1&query=Gure+Toki+Plaza+Nueva+12+Bilbao", color: "green", challenge: "Pide una recomendación sin mirar la vitrina y déjate sorprender." },
  { id: 5, name: "Sorginzulo", handle: "@sorginzulo_bilbao", dish: "Tortilla de patata", note: "Finalista nacional de tortilla y ganador de premios de pintxos en Bizkaia.", maps: "https://www.google.com/maps/search/?api=1&query=Sorginzulo+Plaza+Nueva+Bilbao", color: "blue", curiosity: "El Casco Viejo también se llama Zazpikaleak: las Siete Calles del núcleo medieval." },
  { id: 6, name: "La Olla", handle: "@laolladebilbao", dish: "Barra de pintxos clásicos", note: "Parada en la Plaza Nueva; pregunta por el pintxo del día.", maps: "https://www.google.com/maps/search/?api=1&query=La+Olla+Plaza+Nueva+2+Bilbao", color: "green", challenge: "Aprende a decir «on egin» antes de probar el pintxo." },
  { id: 7, name: "La Viña del Ensanche", handle: "@lavinadelensanche", dish: "Foie, hongos y patata", note: "Combinación aportada para buscar en barra; puede depender de temporada.", maps: "https://www.google.com/maps/search/?api=1&query=La+Vina+del+Ensanche+Diputacion+10+Bilbao", color: "red", curiosity: "La Amatxu de Begoña es patrona de Bizkaia; su talla data de los siglos XIII–XIV." },
  { id: 8, name: "Taberna Basaras", handle: "Casco Viejo", dish: "Anchoa en trainera", note: "Taberna histórica, abierta desde 1940, célebre por sus anchoas y vinos.", maps: "https://www.google.com/maps/search/?api=1&query=Taberna+Basaras+Pelota+2+Bilbao", color: "blue", curiosity: "Las traineras nacieron como barcos de pesca; competir por llegar antes a puerto acabó convirtiéndose en regata." },
  { id: 9, name: "Gerri Taberna", handle: "@gerritaberna", dish: "Lámina de chuleta con patata rústica", price: "5,95 €*", note: "Un bocado de txuleta en pleno Casco Viejo.", maps: "https://www.google.com/maps/search/?api=1&query=Gerri+Taberna+Gerrikogin+8+Bilbao", color: "red", challenge: "Brinda con un «topa» y suma tu sello sin prisas." },
  { id: 10, name: "Dumpling+", handle: "Goienkale", dish: "Dumplings caseros", note: "Un giro internacional en una de las calles históricas del Casco Viejo.", maps: "https://www.google.com/maps/search/?api=1&query=Dumpling%2B+Goienkale+45+Bilbao", color: "green", curiosity: "Goienkale es Somera, una de las siete calles originales de la villa." },
];

const culture = [
  ["Marijaia", "Nació en 1978 y abre los brazos a nueve días de fiesta popular."],
  ["Gigantes", "Hay referencias documentadas en Bilbao desde 1654; Don Terencio y Doña Tomasa encabezan la comparsa."],
  ["Txikiteo", "Es ir de bar en bar en cuadrilla, conversando y tomando pequeños vinos: importa más la compañía que la prisa."],
  ["Arrantzales", "La ropa festiva recuerda a pescadoras, pescadores y gentes de costa, con pañuelo, blusa y alpargatas."],
];

function Index() {
  const [visited, setVisited] = useState<number[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "visited">("all");
  const [expanded, setExpanded] = useState<number | null>(null);

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

  const filtered = useMemo(() => stops.filter((stop) => filter === "all" || (filter === "visited" ? visited.includes(stop.id) : !visited.includes(stop.id))), [filter, visited]);
  const progress = Math.round((visited.length / stops.length) * 100);

  const toggleStamp = (id: number) => {
    setVisited((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      window.localStorage.setItem("bilbao-passport-stamps", JSON.stringify(next));
      return next;
    });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-background paper-texture">
      <header className="relative min-h-[88vh] bg-primary text-primary-foreground">
        <img src={crowdAsset.url} alt="Marijaia ante la multitud de Aste Nagusia en Bilbao" className="absolute inset-0 size-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/55 to-primary" />
        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-10">
          <span className="font-display text-2xl">EXPLORANDO BILBAO</span>
          <span className="border border-primary-foreground/50 px-3 py-1 text-xs font-bold uppercase">Pasaporte 2026</span>
        </nav>
        <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-end px-5 pb-12 lg:px-10">
          <div className="mb-5 flex items-center gap-3 text-sm font-extrabold uppercase">
            <Compass className="size-5" /> 10 paradas · Bilbao
          </div>
          <h1 className="max-w-4xl font-display text-7xl leading-[.86] sm:text-8xl lg:text-[9rem]">PASAPORTE<br/><span className="text-sun">DE PINTXOS</span></h1>
          <div className="mt-7 flex max-w-3xl flex-col gap-6 border-t border-primary-foreground/40 pt-5 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-xl text-base font-semibold leading-relaxed sm:text-lg">Diez barras, historias de las Siete Calles y pequeños retos para saborear Bilbao a tu ritmo.</p>
            <Button asChild variant="secondary"><a href="#paradas"><Utensils className="size-4"/> Empezar la ruta</a></Button>
          </div>
        </div>
      </header>

      <section className="border-b border-border bg-card" aria-label="Progreso del pasaporte">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-7 sm:grid-cols-[1fr_auto] sm:items-center lg:px-10">
          <div>
            <div className="mb-2 flex justify-between text-sm font-extrabold"><span>{visited.length} de {stops.length} sellos</span><span>{progress}%</span></div>
            <div className="h-3 overflow-hidden rounded-full bg-muted"><div className="h-full bg-festival transition-all" style={{ width: `${progress}%` }} /></div>
          </div>
          <p className="text-sm text-muted-foreground">Tu progreso se guarda en este dispositivo.</p>
        </div>
      </section>

      <section id="paradas" className="mx-auto max-w-7xl px-5 py-16 lg:px-10">
        <div className="mb-9 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div><p className="mb-2 text-sm font-extrabold uppercase text-festival">La ruta</p><h2 className="font-display text-6xl leading-none text-primary sm:text-7xl">ELIGE TU PRÓXIMA PARADA</h2></div>
          <div className="flex gap-2" aria-label="Filtrar paradas">
            {(["all", "pending", "visited"] as const).map((value) => <Button key={value} variant={filter === value ? "primary" : "secondary"} onClick={() => setFilter(value)}>{value === "all" ? "Todas" : value === "pending" ? "Pendientes" : "Selladas"}</Button>)}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {filtered.map((stop) => {
            const isVisited = visited.includes(stop.id);
            const accent = stop.color === "red" ? "bg-festival" : stop.color === "green" ? "bg-green" : "bg-primary";
            return (
              <article key={stop.id} className="relative overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                <div className={`h-2 ${accent}`} />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4"><span className="font-display text-5xl text-primary/25">{String(stop.id).padStart(2, "0")}</span><div><p className="text-xs font-extrabold uppercase text-muted-foreground">{stop.handle}</p><h3 className="font-display text-4xl text-foreground">{stop.name}</h3></div></div>
                    {isVisited && <span className="stamp-mark animate-stamp flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-primary font-display text-lg text-primary">BILBAO</span>}
                  </div>
                  <div className="mt-5 border-y border-dashed border-border py-4">
                    <p className="flex items-center gap-2 text-lg font-extrabold"><Utensils className="size-5 text-festival" />{stop.dish}</p>
                    {stop.price && <p className="mt-1 text-sm font-bold text-primary">{stop.price}</p>}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ink-soft">{stop.note}</p>
                  {expanded === stop.id && (stop.curiosity || stop.challenge) && <div className="mt-4 bg-secondary p-4 text-sm leading-relaxed"><p className="mb-1 font-extrabold text-primary">{stop.challenge ? "RETO" : "CURIOSIDAD"}</p>{stop.challenge ?? stop.curiosity}</div>}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button variant={isVisited ? "primary" : "stamp"} onClick={() => toggleStamp(stop.id)}>{isVisited ? <Check className="size-4"/> : <Stamp className="size-4"/>}{isVisited ? "Sellado" : "Sellar visita"}</Button>
                    <Button asChild variant="secondary"><a href={stop.maps} target="_blank" rel="noreferrer"><MapPin className="size-4"/> Maps</a></Button>
                    {(stop.curiosity || stop.challenge) && <Button variant="secondary" size="icon" aria-label="Ver detalle" onClick={() => setExpanded(expanded === stop.id ? null : stop.id)}><ChevronDown className={`size-4 transition-transform ${expanded === stop.id ? "rotate-180" : ""}`} /></Button>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        {filtered.length === 0 && <p className="border border-dashed border-border bg-card p-10 text-center font-bold">No hay paradas en este filtro.</p>}
        <p className="mt-6 text-xs text-muted-foreground">* Precios orientativos según la información pública disponible o los datos aportados. Confirma carta, disponibilidad y precio en el local.</p>
      </section>

      <section className="bg-foreground text-background">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
          <div className="relative min-h-[420px]"><img src={bargeAsset.url} alt="Afición del Athletic celebrando en una embarcación" loading="lazy" className="absolute inset-0 size-full object-cover"/><div className="absolute inset-x-0 bottom-0 bg-foreground/80 p-5"><p className="font-display text-4xl">BILBAO RUGE Y REMA</p><p className="text-sm text-background/80">Athletic, ría y tradición de traineras en una misma ciudad.</p></div></div>
          <div className="p-7 sm:p-12"><p className="mb-2 flex items-center gap-2 text-sm font-extrabold uppercase text-sun"><Sparkles className="size-4"/> Espíritu bilbaíno</p><h2 className="font-display text-6xl leading-none">MÁS QUE UNA RUTA DE BARRA</h2><div className="mt-8 grid gap-px bg-background/20 sm:grid-cols-2">{culture.map(([title, text]) => <div key={title} className="bg-foreground p-5"><h3 className="font-display text-3xl text-sun">{title}</h3><p className="mt-2 text-sm leading-relaxed text-background/75">{text}</p></div>)}</div></div>
        </div>
      </section>

      <footer className="bg-primary px-5 py-8 text-primary-foreground"><div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="font-display text-3xl">EXPLORANDO BILBAO</p><p className="text-xs font-semibold">Come, camina, pregunta y cuida la ciudad. On egin!</p></div></footer>
    </main>
  );
}
