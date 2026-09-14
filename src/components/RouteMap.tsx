import { useEffect, useRef } from "react";

export type MapStop = {
  id: number;
  name: string;
  dish: string;
  lat: number;
  lng: number;
  pin: string;
  maps: string;
};

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

/* eslint-disable @typescript-eslint/no-explicit-any */
function loadLeaflet(): Promise<any> {
  return new Promise((resolve, reject) => {
    const w = window as any;
    if (w.L) return resolve(w.L);
    if (!document.querySelector(`link[data-leaflet]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS;
      link.setAttribute("data-leaflet", "1");
      document.head.appendChild(link);
    }
    const existing = document.querySelector(`script[data-leaflet]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve((window as any).L));
      existing.addEventListener("error", reject);
      return;
    }
    const s = document.createElement("script");
    s.src = LEAFLET_JS;
    s.async = true;
    s.setAttribute("data-leaflet", "1");
    s.onload = () => resolve((window as any).L);
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

function pinHtml(label: string, color: string, done: boolean) {
  return `<div class="map-pin${done ? " is-done" : ""}" style="--pin:${color}"><span>${done ? "✓" : label}</span></div>`;
}

export default function RouteMap({ stops, visited }: { stops: MapStop[]; visited: number[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<number, any>>({});

  useEffect(() => {
    let cancelled = false;
    let started = false;

    const init = () => {
      if (started) return;
      started = true;
      loadLeaflet()
        .then((L) => {
          if (cancelled || !ref.current || mapRef.current) return;
          const map = L.map(ref.current, { scrollWheelZoom: false }).setView([43.2582, -2.929], 15);
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap',
            maxZoom: 19,
          }).addTo(map);

          const line = L.polyline(
            stops.map((s) => [s.lat, s.lng]),
            { color: "#1f5fa6", weight: 3, opacity: 0.5, dashArray: "2 8" },
          ).addTo(map);

          stops.forEach((s) => {
            const done = visited.includes(s.id);
            const marker = L.marker([s.lat, s.lng], {
              icon: L.divIcon({ className: "", html: pinHtml(String(s.id), s.pin, done), iconSize: [34, 34], iconAnchor: [17, 34] }),
            }).addTo(map);
            marker.bindPopup(
              `<div class="map-pop"><strong>${s.id}. ${s.name}</strong><span>${s.dish}</span><a href="${s.maps}" target="_blank" rel="noreferrer">Abrir en Google Maps →</a></div>`,
            );
            markersRef.current[s.id] = marker;
          });

          map.fitBounds(line.getBounds().pad(0.15));
          mapRef.current = map;
          setTimeout(() => map.invalidateSize(), 250);
        })
        .catch(() => {});
    };

    // Only load Leaflet (CDN) when the map scrolls into view — keeps it off the
    // critical load path so the page is interactive immediately.
    const el = ref.current;
    let observer: IntersectionObserver | undefined;
    if (el && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            observer?.disconnect();
            init();
          }
        },
        { rootMargin: "200px" },
      );
      observer.observe(el);
    } else {
      init();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapRef.current) return;
    stops.forEach((s) => {
      const marker = markersRef.current[s.id];
      if (!marker) return;
      const done = visited.includes(s.id);
      marker.setIcon(L.divIcon({ className: "", html: pinHtml(String(s.id), s.pin, done), iconSize: [34, 34], iconAnchor: [17, 34] }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visited]);

  return <div ref={ref} className="h-[420px] w-full sm:h-[500px]" data-testid="route-map" />;
}
