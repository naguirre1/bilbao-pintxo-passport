import { useEffect, useMemo } from "react";
import { PartyPopper, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const COLORS = ["#1f5fa6", "#cf3b2a", "#2f9e5f", "#f4c02c", "#ffffff", "#e86a17"];

type Piece = { left: number; delay: number; duration: number; size: number; color: string; round: boolean };

function useConfetti(n: number): Piece[] {
  return useMemo(
    () =>
      Array.from({ length: n }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.9,
        duration: 2.6 + Math.random() * 2.4,
        size: 7 + Math.random() * 9,
        color: COLORS[i % COLORS.length],
        round: Math.random() > 0.6,
      })),
    [n],
  );
}

export default function Celebration({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pieces = useConfetti(100);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Pasaporte completado" data-testid="celebration-overlay">
      <div className="absolute inset-0 bg-primary/70 backdrop-blur-sm" onClick={onClose} />

      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {pieces.map((p, i) => (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: p.round ? "50%" : "2px",
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="pop-in relative z-10 w-full max-w-md overflow-hidden rounded-3xl border-4 border-white bg-card text-center shadow-2xl">
        <button
          onClick={onClose}
          data-testid="celebration-close"
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20"
        >
          <X className="size-5" />
        </button>

        <div className="bg-white px-6 pt-8">
          <img src={`${import.meta.env.BASE_URL}ill/marijaia.png`} alt="Marijaia celebrando" className="float-slow mx-auto h-56 w-auto" />
        </div>

        <div className="px-6 pb-8 pt-5">
          <p className="flex items-center justify-center gap-2 text-sm font-extrabold uppercase text-festival">
            <PartyPopper className="size-4" /> Pasaporte completado
          </p>
          <h2 className="font-display text-6xl leading-none text-primary">¡ZORIONAK!</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm font-semibold leading-relaxed text-ink-soft">
            Has sellado las 10 paradas del Pasaporte de Pintxos. Marijaia lo celebra contigo: ¡gora Bilbao! Ahora toca brindar con la cuadrilla. On egin!
          </p>
          <Button onClick={onClose} className="mt-6" data-testid="celebration-cta">
            <PartyPopper className="size-4" /> ¡Aupa!
          </Button>
        </div>
      </div>
    </div>
  );
}
