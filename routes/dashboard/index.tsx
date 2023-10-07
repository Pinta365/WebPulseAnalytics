import type { Handlers, PageProps } from "$fresh/server.ts";
import { NavTop } from "components/NavTop.tsx";
import { NavSide } from "islands/NavSide.tsx";
import { LandingView } from "components/views/LandingView.tsx";
import { Footer } from "components/Footer.tsx";
import { SessionUser } from "lib/commonTypes.ts";

export const handler: Handlers = {
    GET(_req, ctx) {
        return ctx.render(ctx.state);
    },
};

export default function Realms({ data }: PageProps<SessionUser>) {
    return (
        <body>
            <NavTop {...data} />

            <main class="container">
                <div class="grid">
                    <NavSide />
                    <LandingView />
                </div>
            </main>

            <Footer />
            <script src="/js/pico.js"></script>
        </body>
    );
}
