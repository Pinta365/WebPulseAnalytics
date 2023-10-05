import type { Handlers, PageProps } from "$fresh/server.ts";
import { MainContent } from "components/MainContent.tsx";
import { NavTop } from "components/NavTop.tsx";
import { Footer } from "components/Footer.tsx";
import { SessionUser } from "lib/commonTypes.ts";

export const handler: Handlers = {
    GET(_req, ctx) {
        return ctx.render(ctx.state);
    },
};

export default function Home({ data }: PageProps<SessionUser>) {
    return (
        <body>
            <NavTop {...data} />

            <MainContent {...data} />

            <Footer />
            <script src="/js/pico.js"></script>
        </body>
    );
}
