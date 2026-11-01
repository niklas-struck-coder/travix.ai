import { HttpError } from "./store.js";

export function send(res, status, body, cache = "no-store") {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", cache);
  res.status(status).send(JSON.stringify(body));
}

// Einheitliche Fehlerbehandlung für alle Endpunkte
export function handler(fn) {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (e) {
      if (e instanceof HttpError) return send(res, e.status, { error: e.message });
      console.error(e);
      send(res, 500, { error: "Da ist etwas schiefgelaufen. Bitte gleich nochmal versuchen." });
    }
  };
}

export function body(req) {
  if (req.method !== "POST") throw new HttpError(405, "Nur POST erlaubt.");
  const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  return b;
}
