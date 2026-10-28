import { getQuotes } from "../lib/market.js";
import { ASSETS } from "../lib/assets.js";
import { handler, send } from "../lib/http.js";

const META = ASSETS.map(({ id, name, cls, sector }) => ({ id, name, cls, sector }));

export default handler(async (req, res) => {
  const { at, quotes } = await getQuotes();
  send(res, 200, { at, assets: META, quotes }, "public, s-maxage=60, stale-while-revalidate=600");
});
