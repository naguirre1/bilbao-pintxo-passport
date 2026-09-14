import { useEffect, useState } from "react";
import { Dices, PartyPopper, RefreshCw, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const TEAM_RETOS = [
  "Consigue que alguien cuente un chiste.",
  "Consigue que alguien baile contigo la Macarena.",
  "Consigue que alguien cante contigo «Porque Asturias es mi patria».",
  "Que todos cuenten sus talentos inútiles y votad al más inútil de todos.",
  "Consigue que alguien te enseñe una palabra en euskera y úsala el resto de la ruta.",
  "Consigue que alguien te cuente su anécdota más vergonzosa en un bar.",
];

function pick(prev?: string): string {
  if (TEAM_RETOS.length <= 1) return TEAM_RETOS[0];
  let r = prev;
  while (r === prev) r = TEAM_RETOS[Math.floor(Math.random() * TEAM_RETOS.length)];
  return r as string;
}

export default function TeamChallengeDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [person, setPerson] = useState(1);
  const [reto, setReto] = useState<string>(TEAM_RETOS[0]);

  useEffect(() => {
    if (open) {
      setPerson(1);
      setReto(pick());
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden rounded-2xl border-2 border-festival/40 p-0" data-testid="team-challenge-dialog">
        <div className="relative bg-festival px-6 pb-4 pt-6 text-festival-foreground">
          <div className="absolute inset-0 confetti opacity-20" aria-hidden />
          <DialogHeader className="relative">
            <DialogTitle className="flex items-center gap-2 font-display text-3xl tracking-wide">
              <Dices className="size-7" /> Reto sorpresa de cuadrilla
            </DialogTitle>
            <DialogDescription className="font-semibold text-festival-foreground/90">
              Pasaos el móvil: a cada persona le toca el suyo. ¡A por ellos!
            </DialogDescription>
          </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
}
