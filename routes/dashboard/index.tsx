import type { Handlers, PageProps } from "$fresh/server.ts";
import { NavTop } from "components/layout/NavTop.tsx";
import { NavSide } from "islands/NavSide.tsx";
import { LandingView } from "components/LandingView.tsx";
import { Footer } from "components/layout/Footer.tsx";
import { SessionUser } from "lib/commonTypes.ts";

export const handler: Handlers = {
    GET(_req, ctx) {
        return ctx.render(ctx.state);
    },
};

export default function DashboardLanding({ data }: PageProps<SessionUser>) {
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
