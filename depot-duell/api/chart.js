import { chart } from "../lib/market.js";
import { handler, send } from "../lib/http.js";

export default handler(async (req, res) => {
  const data = await chart(String(req.query.id || ""), String(req.query.range || "1mo"));
  if (!data) return send(res, 404, { error: "Für diesen Wert gibt es gerade keinen Chart." }, "public, s-maxage=60");
  send(res, 200, data, "public, s-maxage=300, stale-while-revalidate=3600");
});
