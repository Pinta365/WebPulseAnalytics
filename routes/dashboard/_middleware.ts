import { FreshContext } from "$fresh/server.ts";
import { config } from "lib/config.ts";
import { SessionUser } from "lib/commonTypes.ts";

export function handler(
    _req: Request,
    ctx: FreshContext<SessionUser>,
) {
    if (!ctx?.state?._id) {
        return Response.redirect(config.common.websiteBaseURL);
    }

    return ctx.next();
}
