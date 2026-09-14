import { useState } from "react";
import { Camera, ImagePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Photo } from "@/lib/photos";

type Props = {
  photos: Photo[];
  stopName: (id: number) => string;
  onAdd: () => void;
};

export default function PhotoWall({ photos, stopName, onAdd }: Props) {
  const [active, setActive] = useState<Photo | null>(null);

  return (
    <section id="muro" className="mx-auto max-w-7xl px-5 pb-24 lg:px-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-sm font-extrabold uppercase text-festival">La comunidad</p>
          <h2 className="font-display text-6xl leading-none text-primary sm:text-7xl">MURO DE FOTOS</h2>
          <p className="mt-3 max-w-2xl text-sm font-semibold text-ink-soft">
            Las fotos de los retos de toda la gente que recorre la ruta. ¡Súmate con la tuya!
          </p>
        </div>
        <Button variant="primary" onClick={onAdd} data-testid="wall-add-btn">
          <ImagePlus className="size-4" /> Subir mi foto
        </Button>
      </div>

      {photos.length === 0 ? (
        <div
          className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-primary/30 bg-card p-14 text-center"
          data-testid="wall-empty"
        >
          <Camera className="size-10 text-primary/60" />
          <p className="font-display text-3xl text-primary">Aún no hay fotos</p>
          <p className="max-w-md text-sm font-semibold text-ink-soft">
            Sé la primera persona en completar un reto y aparecer en el muro de Explorando Bilbao.
          </p>
        </div>
      ) : (
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4" data-testid="photo-wall">
          {photos.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActive(p)}
              className="group block w-full break-inside-avoid overflow-hidden rounded-xl border-2 border-white bg-white shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
              data-testid={`wall-photo-${p.id}`}
              style={{ rotate: `${(p.id.charCodeAt(0) % 5) - 2}deg` }}
            >
              <img
                src={p.file}
                alt={`Reto de ${p.name}`}
                loading="lazy"
                className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex items-center justify-between gap-2 px-2.5 py-1.5">
                <span className="truncate font-hand text-base text-primary">{p.name}</span>
                <span className="shrink-0 rounded-full bg-sun px-2 py-0.5 text-[10px] font-extrabold uppercase text-primary">
                  {stopName(p.stopId)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-2xl overflow-hidden rounded-2xl border-2 border-primary/25 p-0" data-testid="lightbox">
          {active && (
            <>
              <DialogTitle className="sr-only">Foto de {active.name}</DialogTitle>
              <img src={active.file} alt={`Reto de ${active.name}`} className="max-h-[70vh] w-full object-contain bg-black/90" />
              <div className="flex items-center justify-between gap-3 px-5 py-3">
                <span className="font-hand text-xl text-primary">{active.name}</span>
                <span className="rounded-full bg-sun px-3 py-1 text-xs font-extrabold uppercase text-primary">
                  {stopName(active.stopId)}
                </span>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
