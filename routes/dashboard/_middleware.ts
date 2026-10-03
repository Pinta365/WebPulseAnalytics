import { FreshContext } from "$fresh/server.ts";
import { getConfig } from "lib/config.ts";
import { SessionUser } from "lib/commonTypes.ts";
import { getProjects } from "lib/db.ts";

export async function handler(
    req: Request,
    ctx: FreshContext<SessionUser>,
) {
    if (!ctx?.state?._id) {
        return Response.redirect(getConfig().common.websiteBaseURL);
    }

    // The sidebar lists the user's projects on every page. Skip for non-page requests.
    if (req.method === "GET" && ctx.destination === "route") {
        const projects = await getProjects(ctx.state._id);
        ctx.state.navProjects = projects
            .filter((p) => p._id)
            .map((p) => ({ id: p._id!.toString(), name: p.name }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    return ctx.next();
}
