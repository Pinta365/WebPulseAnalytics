import type { Handlers, PageProps } from "$fresh/server.ts";
import { Login } from "components/Login.tsx";
import { Footer } from "components/layout/Footer.tsx";
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
    return (
        <body>
            <Login />

            <Footer />
        </body>
    );
}
