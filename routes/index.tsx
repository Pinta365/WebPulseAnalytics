import type { Handlers } from "$fresh/server.ts";
import { Login } from "components/Login.tsx";
import { config } from "lib/config.ts";

export const handler: Handlers = {
    GET(_req, ctx) {
        if (ctx.state._id) {
            return Response.redirect(`${config.common.websiteBaseURL}/dashboard`);
        }

        return ctx.render();
    },
};

export default function Home() {
    return <Login />;
}
