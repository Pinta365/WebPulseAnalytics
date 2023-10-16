import type { Handlers, PageProps } from "$fresh/server.ts";
import { NavTop } from "components/layout/NavTop.tsx";
import { NavSide } from "islands/NavSide.tsx";
import { ProjectView } from "components/ProjectView.tsx";
import { Footer } from "components/layout/Footer.tsx";
import { SessionUser } from "lib/commonTypes.ts";

interface ProjectOptions {
    pageLoads: {
        enabled: boolean;
        storeUserAgent: boolean;
    };
    pageClicks: {
        enabled: boolean;
        capureAllClicks: boolean;
    };
    pageScrolls: {
        enabled: boolean;
    };
}

interface Project {
    id: string;
    realmId: string;
    ownerId?: string;
    name: string;
    description?: string;
    allowedOrigins?: string[];
    options?: ProjectOptions;
}

async function getProjects(userId: string) {
    const database = await Deno.openKv(Deno.env.get("WEBPULSE_STAT_DATABASE"));
    // Need an index to get user projects. Will filter on userId in the for loop for now.
    const projectList = database.list({ prefix: ["projects"] });
    const projects: Project[] = [];
    for await (const project of projectList) {
        const proj = project.value as Project;
        if (proj.ownerId === userId) {
            projects.push(proj as Project);
        }
    }

    return projects;
}

export const handler: Handlers = {
    async GET(_req, ctx) {
        const projects = await getProjects(ctx.state.userId as string);
        return ctx.render({ state: ctx.state, projects: projects });
    },
};
export default function Projects({ data }: PageProps) {
    const { state, projects } = data;
    return (
        <body>
            <NavTop {...state} />

            <main class="container">
                <div class="grid">
                    <NavSide />
                    <ProjectView projects={projects} />
                </div>
            </main>

            <Footer />
            <script src="/js/pico.js"></script>
        </body>
    );
}
