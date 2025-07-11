import type { Handlers, PageProps } from "$fresh/server.ts";
import { EditProject } from "islands/EditProject.tsx";
import ProjectsIsland from "islands/ProjectsIsland.tsx";
import { deleteProject, getProject, getProjects, upsertProject } from "lib/db.ts";
import { ObjectId } from "mongodb";
import { NotificationProvider } from "../../components/NotificationContext.tsx";

export const handler: Handlers = {
    async GET(req, ctx) {
        const edit = new URL(req.url).searchParams.get("edit");
        if (edit) {
            // render for editing a project
            const editProject = await getProject(ctx.state._id as string, edit);
            return ctx.render({ state: ctx.state, editProject: editProject });
        } else {
            // render for listing projects
            const projects = await getProjects(ctx.state._id as string);
            return ctx.render({ state: ctx.state, projects: projects });
        }
    },
    async POST(req, ctx) {
        const params = new URLSearchParams(await req.text());
        const name = params.get("name");
        const description = params.get("description") || "";
        const ownerId = ctx.state._id as string;
        const pageLoadsChecked = params.get("pageLoadsChecked") === "true";
        const storeUA = params.get("storeUA") === "true";
        const storeLoc = params.get("storeLoc") === "true";
        const storeUTM = params.get("storeUTM") === "true";
        const pageClicksChecked = params.get("pageClicksChecked") === "true";
        const captureAllClicks = params.get("captureAllClicks") === "true";
        const pageScrollsChecked = params.get("pageScrollsChecked") === "true";
        if (name && ownerId) {
            const projectToInsert = {
                ownerId,
                name,
                description,
                //allowedOrigins, //Keep for later
                options: {
                    storeUserAgent: storeUA,
                    storeLocation: storeLoc,
                    storeUTM: storeUTM,
                    pageLoads: {
                        enabled: pageLoadsChecked,
                    },
                    pageClicks: {
                        enabled: pageClicksChecked,
                        captureAllClicks: captureAllClicks,
                    },
                    pageScrolls: {
                        enabled: pageScrollsChecked,
                    },
                },
            };
            const id = await upsertProject(projectToInsert);
            if (id) {
                const newProject = await getProject(ownerId, id.toString());
                if (newProject) {
                    return new Response(JSON.stringify(newProject), {
                        status: 201,
                        headers: { "Content-Type": "application/json" },
                    });
                } else {
                    return new Response("Inserted but not found.", { status: 201 });
                }
            } else {
                return new Response("Not inserted.", { status: 422 });
            }
        }

        return new Response("Bad Request", { status: 400 });
    },

    async DELETE(req, ctx) {
        const params = new URLSearchParams(await req.text());
        const ownerId = ctx.state._id as string;
        const _id = params.get("_id");
        if (ownerId && _id) {
            const del = await deleteProject(ownerId, _id);
            if (del) {
                return new Response("Ok", { status: 200 });
            } else {
                return new Response("Not deleted.", { status: 422 });
            }
        }

        return new Response("Bad Request", { status: 400 });
    },
    async PUT(req, ctx) {
        const params = new URLSearchParams(await req.text());
        const _id = params.get("_id");
        const name = params.get("name");
        const description = params.get("description") || "";
        const ownerId = ctx.state._id as string;
        const pageLoadsChecked = params.get("pageLoadsChecked") === "true";
        const storeUA = params.get("storeUA") === "true";
        const storeLoc = params.get("storeLoc") === "true";
        const storeUTM = params.get("storeUTM") === "true";
        const pageClicksChecked = params.get("pageClicksChecked") === "true";
        const captureAllClicks = params.get("captureAllClicks") === "true";
        const pageScrollsChecked = params.get("pageScrollsChecked") === "true";
        if (_id && name && ownerId) {
            const insert = await upsertProject({
                _id: new ObjectId(_id),
                ownerId,
                name,
                description,
                //allowedOrigins,
                options: {
                    storeUserAgent: storeUA,
                    storeLocation: storeLoc,
                    storeUTM: storeUTM,
                    pageLoads: {
                        enabled: pageLoadsChecked,
                    },
                    pageClicks: {
                        enabled: pageClicksChecked,
                        captureAllClicks: captureAllClicks,
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
};

export default function Projects({ data }: PageProps) {
    const { editProject, projects } = data;
    return (
        <>
            {editProject ? <EditProject project={editProject} /> : (
                <NotificationProvider>
                    <ProjectsIsland initialProjects={projects} />
                </NotificationProvider>
            )}
        </>
    );
}
