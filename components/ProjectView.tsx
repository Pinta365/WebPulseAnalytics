import { DelProjectButton } from "islands/DelProjectButton.tsx";
import { Project } from "lib/db.ts";

function printProject(project: Project, onDelete: (id: string) => void, onError: (msg: string) => void) {
    return (
        <details class="max-w-2xl mb-4">
            <summary class="cursor-pointer text-secondary font-medium p-3 bg-card rounded-lg">
                {project.name}
            </summary>
            <div class="mt-4 overflow-x-auto">
                <table class="w-full border-collapse my-4 bg-card text-base rounded-lg overflow-hidden shadow-sm text-primary">
                    <tbody>
                        <tr>
                            <td class="px-4 py-3 font-bold text-primary">Id</td>
                            <td class="px-4 py-3 text-secondary">{project._id?.toString() ?? ""}</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3 font-bold text-primary">Owner Id</td>
                            <td class="px-4 py-3 text-secondary">{project.ownerId}</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3 font-bold text-primary">Description</td>
                            <td class="px-4 py-3 text-secondary">{project.description || ""}</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3 font-bold text-primary">Options</td>
                            <td class="px-4 py-3 text-secondary">
                                {JSON.stringify(project.options)}
                            </td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3 font-bold text-primary">Allowed Origins</td>
                            <td class="px-4 py-3 text-secondary">
                                {project.allowedOrigins ? project.allowedOrigins.join(", ") : ""}
                            </td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3 font-bold text-primary">Snippet</td>
                            <td class="px-4 py-3 text-secondary">
                                <code class="bg-card-light px-2 py-1 rounded text-xs">
                                    {`<script async src="https://track.webpulseanalytics.com/client/${
                                        project._id?.toString() ?? ""
                                    }" type="module"></script>`}
                                </code>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="grid grid-cols-2 gap-4 mt-4">
                <div>
                    <a
                        href={"/dashboard/projects?edit=" + (project._id?.toString() ?? "")}
                        role="button"
                        class="btn-primary w-full text-center"
                    >
                        Edit
                    </a>
                </div>
                <div>
                    <DelProjectButton id={project._id?.toString() ?? ""} onDelete={onDelete} onError={onError} />
                </div>
            </div>
        </details>
    );
}

export function ProjectView(
    { projects, onDelete, onError }: {
        projects: Project[];
        onDelete: (id: string) => void;
        onError: (msg: string) => void;
    },
) {
    return (
        <section class="space-y-6">
            <h1 class="text-3xl font-bold text-primary mb-6">Projects</h1>
            {projects?.length > 0
                ? projects.map((project) => printProject(project, onDelete, onError))
                : <p class="text-secondary">No projects</p>}
        </section>
    );
}
