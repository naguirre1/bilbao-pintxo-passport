import { useRef, useState } from "react";
import { Camera, ImageUp, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { uploadPhoto, type Photo } from "@/lib/photos";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stop: { id: number; name: string; photoChallenge?: { title: string; prompt: string } } | null;
  onUploaded: (photo: Photo) => void;
};

async function compress(file: File): Promise<Blob> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = dataUrl;
  });
  const max = 1280;
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, w, h);
  return new Promise<Blob>((resolve) =>
    canvas.toBlob((blob) => resolve(blob ?? file), "image/jpeg", 0.82),
  );
}

export default function PhotoUploadDialog({ open, onOpenChange, stop, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setFile(null);
    setPreview(null);
    setName("");
    setError(null);
    setBusy(false);
  };

  const pick = (f: File | undefined) => {
    if (!f) return;
    setError(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async () => {
    if (!file || !stop) return;
    setBusy(true);
    setError(null);
    try {
      const blob = await compress(file);
      const form = new FormData();
      form.append("file", new File([blob], "foto.jpg", { type: "image/jpeg" }));
      form.append("stopId", String(stop.id));
      form.append("name", name);
      const photo = await uploadPhoto({ data: form });
      onUploaded(photo);
      reset();
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo subir la foto");
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-w-md rounded-2xl border-2 border-primary/25" data-testid="upload-dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl tracking-wide text-primary">
            {stop?.photoChallenge?.title ?? "Sube tu foto"}
          </DialogTitle>
          <DialogDescription className="font-semibold text-ink-soft">
            {stop?.photoChallenge?.prompt}
          </DialogDescription>
        </DialogHeader>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          data-testid="upload-file-input"
          onChange={(e) => pick(e.target.files?.[0])}
        />

        {preview ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="group relative overflow-hidden rounded-xl border-2 border-primary/20"
            data-testid="upload-preview"
          >
            <img src={preview} alt="Vista previa" className="max-h-64 w-full object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-primary/80 py-1.5 text-center text-xs font-bold text-primary-foreground">
              Toca para cambiar la foto
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-secondary/50 py-10 font-bold text-primary transition-colors hover:bg-secondary"
            data-testid="upload-pick-btn"
          >
            <Camera className="size-8" />
            Elegir o hacer una foto
          </button>
        )}

        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre o cuadrilla (opcional)"
          maxLength={40}
          data-testid="upload-name-input"
        />

        {error && (
          <p className="text-sm font-bold text-festival" data-testid="upload-error">
            {error}
          </p>
        )}

        <Button
          variant="primary"
          disabled={!file || busy}
          onClick={submit}
          data-testid="upload-submit-btn"
        >
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          {busy ? "Subiendo..." : "Compartir en el muro"}
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-muted-foreground">
          <ImageUp className="size-3.5" /> Tu foto será pública en el muro de la ruta.
        </p>
      </DialogContent>
    </Dialog>
  );
}
