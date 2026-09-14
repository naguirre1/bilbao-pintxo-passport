import { createServerFn } from "@tanstack/react-start";

export type Photo = {
  id: string;
  stopId: number;
  name: string;
  file: string;
  createdAt: string;
};

export const listPhotos = createServerFn({ method: "GET" }).handler(async () => {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const indexFile = path.join(process.cwd(), "public", "photos", "_index.json");
  try {
    const raw = await fs.readFile(indexFile, "utf8");
    const data = JSON.parse(raw) as Photo[];
    if (!Array.isArray(data)) return [] as Photo[];
    return data.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  } catch {
    return [] as Photo[];
  }
});

export const uploadPhoto = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) throw new Error("Se esperaba FormData");
    return data;
  })
  .handler(async ({ data }) => {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");

    const dir = path.join(process.cwd(), "public", "photos");
    const indexFile = path.join(dir, "_index.json");
    await fs.mkdir(dir, { recursive: true });

    const file = data.get("file");
    if (!(file instanceof File)) throw new Error("Falta la foto");
    if (file.size > 8 * 1024 * 1024) throw new Error("La foto es demasiado grande (máx. 8 MB)");

    const stopId = Number(data.get("stopId")) || 0;
    const name = (String(data.get("name") ?? "").trim() || "Anónimo/a").slice(0, 40);

    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const ext = file.type === "image/png" ? "png" : "jpg";
    const filename = `${id}.${ext}`;

    const buf = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(dir, filename), buf);

    let photos: Photo[] = [];
    try {
      photos = JSON.parse(await fs.readFile(indexFile, "utf8")) as Photo[];
      if (!Array.isArray(photos)) photos = [];
    } catch {
      photos = [];
    }

    const photo: Photo = {
      id,
      stopId,
      name,
      file: `/photos/${filename}`,
      createdAt: new Date().toISOString(),
    };
    photos.push(photo);
    await fs.writeFile(indexFile, JSON.stringify(photos, null, 2));

    return photo;
  });
