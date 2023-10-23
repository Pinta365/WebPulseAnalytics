import type { Handlers, PageProps } from "$fresh/server.ts";

import { NavTop } from "components/layout/NavTop.tsx";
import { NavSide } from "islands/NavSide.tsx";
import { RealTimeView } from "components/RealTimeView.tsx";
import { Footer } from "components/layout/Footer.tsx";
import { getProjects } from "db/db.ts";
import { genULID } from "lib/helper.ts";

export const handler: Handlers = {
    async GET(req, ctx) {
        // render for listing projects
        const projects = await getProjects(ctx.state.userId as string);
        return ctx.render({ state: ctx.state, projects: projects });
    },
};

export default function Projects({ data }: PageProps) {
    const { state, projects } = data;
    const project: Project | null = null; // null = Total
    return (
        <body>
            <NavTop {...state} />

            <main class="container">
                <div class="grid">
                    <NavSide />

                    <RealTimeView project={project} />
                </div>
            </main>

            <Footer />
            <script src="/js/pico.js"></script>
        </body>
    );
}