import type { Handlers, PageProps } from "$fresh/server.ts";

import { NavTop } from "components/layout/NavTop.tsx";
import { NavSide } from "islands/NavSide.tsx";
import { RealTimeView } from "components/RealTimeView.tsx";
import { Footer } from "components/layout/Footer.tsx";
import { getProjects } from "db/db.ts";
import { genULID } from "lib/helper.ts";

export const handler: Handlers = {
    async GET(req, ctx) {
        // All projects
        const projects = await getProjects(ctx.state.userId as string);

        // Selected project
        let project = null;

        if (ctx.params.project !== "all") {
            project = projects.find(p => p.id === ctx.params.project);
            if (!project) {
                // 404!!
                return ctx.renderNotFound();
            }
        }

        // Go!
        return ctx.render({ state: ctx.state, project: project, projects: projects });
    },
};

export default function Projects({ data }: PageProps) {
    const { state, projects, project } = data;
    return (
        <body>
            <NavTop {...state} />
            <main class="container">
                <div class="grid">
                    <NavSide />
                    <RealTimeView project={project} projects={projects} />                </div>
            </main>
            <Footer />
            <script src="/js/pico.js"></script>
        </body>
    );
}