import type { Handlers, PageProps } from "$fresh/server.ts";
import { NavTop } from "components/layout/NavTop.tsx";
import { NavSide } from "islands/NavSide.tsx";
import { ProjectView } from "components/ProjectView.tsx";
import { Footer } from "components/layout/Footer.tsx";
import { deleteProject, getProjects, insertProject } from "db/db.ts";
import { genULID } from "lib/helper.ts";

export const handler: Handlers = {
    async GET(_req, ctx) {
        const projects = await getProjects(ctx.state.userId as string);
        return ctx.render({ state: ctx.state, projects: projects });
    },
    async POST(req, ctx) {
        const params = new URLSearchParams(await req.text());
        const id = genULID();
        const name = params.get("name");
        const description = params.get("description") || "";
        const ownerId = ctx.state.userId as string;
        const pageLoadsChecked = params.get("pageLoadsChecked") === "true";
        const storeUA = params.get("storeUA") === "true";
        const pageClicksChecked = params.get("pageClicksChecked") === "true";
        const captureAllClicks = params.get("captureAllClicks") === "true";
        const pageScrollsChecked = params.get("pageScrollsChecked") === "true";

        if (name && ownerId) {
            const insert = await insertProject({
                id,
                ownerId,
                name,
                description,
                //allowedOrigins,
                options: {
                    pageLoads: {
                        enabled: pageLoadsChecked,
                        storeUserAgent: storeUA,
                    },
                    pageClicks: {
                        enabled: pageClicksChecked,
                        capureAllClicks: captureAllClicks,
                    },
                    pageScrolls: {
                        enabled: pageScrollsChecked,
                    },
                },
            });

            if (insert) {
                return new Response("Ok", { status: 201 });
            } else {
                return new Response("Not insterted.", { status: 422 });
            }
        }

        return new Response("Bad Request", { status: 400 });
    },

    async DELETE(req, ctx) {
        const params = new URLSearchParams(await req.text());
        const ownerId = ctx.state.userId as string;
        const id = params.get("id");
        if (ownerId && id) {
            const del = await deleteProject(ownerId, id);

            if (del) {
                return new Response("Ok", { status: 200 });
            } else {
                return new Response("Not deleted.", { status: 422 });
            }
        }

        return new Response("Bad Request", { status: 400 });
    },
    //async PUT(req, ctx){}, /* Uppdatera ett proj */
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
