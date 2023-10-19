import { AddProject } from "islands/AddProject.tsx";
import { DelProjectButton } from "islands/DelProjectButton.tsx";
import { Project } from "lib/commonTypes.ts";

interface Projects {
    projects: Project[];
}

function printProject(project: Project) {
    return (
        <details class="w-50">
            <summary class="secondary">{project.name}</summary>
            <small>Id: {project.id}</small>
            {project.description &&
                <div>Description: {project.description}</div>}
            {project.options &&
                <div>Options: {JSON.stringify(project.options)}</div>}
            {project.allowedOrigins &&
                <div>Allowed Origins: {project.allowedOrigins}</div>}
            <p>
                <br />
                <a href="#" role="button" class="secondary outline">Edit</a>
                <DelProjectButton id={project.id} />
            </p>
        </details>
    );
}
export function ProjectView(data: Projects) {
    const { projects } = data;

    return (
        <section>
            <AddProject />
            <h1>Projects</h1>
            {projects?.length > 0 ? projects.map((project) => printProject(project)) : <p>No projects</p>}
        </section>
    );
}
