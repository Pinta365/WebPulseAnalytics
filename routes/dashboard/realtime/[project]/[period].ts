import type { Handlers } from "$fresh/server.ts";
import { redirectRealtime } from "lib/legacyRoutes.ts";

export const handler: Handlers = {
    GET: (req, ctx) => redirectRealtime(req, ctx.params),
};
