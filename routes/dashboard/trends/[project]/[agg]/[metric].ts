import type { Handlers } from "$fresh/server.ts";
import { redirectTrends } from "lib/legacyRoutes.ts";

export const handler: Handlers = {
    GET: (req, ctx) => redirectTrends(req, ctx.params),
};
