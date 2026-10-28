import { get, put, list, BlobPreconditionFailedError } from "@vercel/blob";

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

export async function writeJson(path, data, { etag, create } = {}) {
  return put(path, JSON.stringify(data), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: !create,
    ...(etag ? { ifMatch: etag } : {}),
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

// Liest das Spiel, wendet fn an und schreibt nur, wenn niemand dazwischen geschrieben hat.
export async function mutateGame(code, fn) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const cur = await readGame(code);
    if (!cur) throw new HttpError(404, "Spiel nicht gefunden. Prüfe den Code.");
    const result = await fn(cur.data);
    try {
      await writeJson(gamePath(code), cur.data, { etag: cur.etag });
      return { game: cur.data, result };
    } catch (e) {
      if (e instanceof BlobPreconditionFailedError && attempt < 4) continue;
      throw e;
    }
  }
  throw new HttpError(409, "Gerade viel los. Bitte nochmal versuchen.");
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
