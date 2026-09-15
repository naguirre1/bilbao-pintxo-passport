import { useEffect, useState } from "react";
import { Dices, PartyPopper, RefreshCw, UserRound, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export const TEAM_RETOS = [
  "Consigue que alguien cuente un chiste.",
  "Consigue que alguien baile contigo la Macarena.",
  "Consigue que alguien cante contigo «Porque Asturias es mi patria».",
  "Que todos cuenten sus talentos inútiles y votad al más inútil de todos.",
  "Consigue que alguien te enseñe una palabra en euskera y úsala el resto de la ruta.",
  "Consigue que alguien te cuente su anécdota más vergonzosa en un bar.",
];

const FALLBACK_RETO = TEAM_RETOS[0] ?? "Haz un brindis con tu cuadrilla.";

function pick(prev?: string): string {
  if (TEAM_RETOS.length <= 1) return FALLBACK_RETO;
  let r = prev;
  while (r === prev) r = TEAM_RETOS[Math.floor(Math.random() * TEAM_RETOS.length)];
  return r ?? FALLBACK_RETO;
}

export default function TeamChallengeDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [person, setPerson] = useState(1);
  const [reto, setReto] = useState<string>(FALLBACK_RETO);

  useEffect(() => {
    if (!open) return;

    setPerson(1);
    setReto(pick());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      data-testid="team-challenge-dialog"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border-2 border-festival/40 bg-background shadow-2xl">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4 text-festival-foreground" />
        </button>

        <div className="relative bg-festival px-6 pb-4 pt-6 text-festival-foreground">
          <div className="absolute inset-0 confetti opacity-20" aria-hidden />
          <div className="relative">
            <h2 className="flex items-center gap-2 font-display text-3xl tracking-wide">
              <Dices className="size-7" /> Reto sorpresa de cuadrilla
            </h2>
            <p className="mt-2 text-sm font-semibold text-festival-foreground/90">
              Pasaos el móvil: a cada persona le toca el suyo. ¡A por ellos!
            </p>
          </div>
        </div>

        <div className="px-6 py-6">
          <p className="mb-2 flex items-center gap-1.5 text-sm font-extrabold uppercase text-primary" data-testid="team-person-label">
            <UserRound className="size-4" /> Turno de la persona {person}
          </p>
          <div
            key={`${person}-${reto}`}
            className="pop-in rounded-xl border-2 border-dashed border-festival/40 bg-sun/15 p-5 text-center font-hand text-2xl leading-snug text-foreground"
            data-testid="team-reto-text"
          >
            {reto}
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setReto((current) => pick(current))}
              data-testid="team-reroll-btn"
            >
              <RefreshCw className="size-4" /> Otro reto
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                setPerson((p) => p + 1);
                setReto((current) => pick(current));
              }}
              data-testid="team-next-person-btn"
            >
              <PartyPopper className="size-4" /> Siguiente persona
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
