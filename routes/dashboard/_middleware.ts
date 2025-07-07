import { FreshContext } from "$fresh/server.ts";
import { getConfig } from "lib/config.ts";
import { SessionUser } from "lib/commonTypes.ts";

export function handler(
    _req: Request,
    ctx: FreshContext<SessionUser>,
) {
    if (!ctx?.state?._id) {
        return Response.redirect(getConfig().common.websiteBaseURL);
    }

    return ctx.next();
}
