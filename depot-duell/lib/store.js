import { get, put, list } from "@vercel/blob";

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export async function readJson(path) {
  const r = await get(path, { access: "private", useCache: false });
  if (!r || r.statusCode !== 200) return null;
  const text = await new Response(r.stream).text();
  return { data: JSON.parse(text), etag: r.blob.etag };
}

export async function writeJson(path, data, { create } = {}) {
  return put(path, JSON.stringify(data), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: !create,
  });
}

const gamePath = (code) => `games/${code}.json`;

export async function readGame(code) {
  if (!/^[A-Z0-9]{6}$/.test(code || "")) return null;
  return readJson(gamePath(code));
}

export async function createGame(code, game) {
  await writeJson(gamePath(code), game, { create: true });
}

// Liest das Spiel, wendet fn an und schreibt zurück (einfaches Überschreiben).
// Bei einem Freundesspiel mit wenigen Spielern ist das robust genug.
export async function mutateGame(code, fn) {
  const cur = await readGame(code);
  if (!cur) throw new HttpError(404, "Spiel nicht gefunden. Prüfe den Code.");
  const result = await fn(cur.data);
  await writeJson(gamePath(code), cur.data);
  return { game: cur.data, result };
}

export async function listGameCodes() {
  const codes = [];
  let cursor;
  do {
    const r = await list({ prefix: "games/", cursor, limit: 1000 });
    for (const b of r.blobs) {
      const m = b.pathname.match(/^games\/([A-Z0-9]{6})\.json$/);
      if (m) codes.push(m[1]);
    }
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor);
  return codes;
}
