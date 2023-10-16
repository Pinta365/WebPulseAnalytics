import { AddProject } from "islands/AddProject.tsx";

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

interface Projects {
    projects: Project[];
}

function printProject(project: Project) {
    return (
        <details class="w-50">
            <summary class="secondary" role="button">{project.name}</summary>

            {project.description &&
                <div>Description: {project.description}</div>}
            {project.allowedOrigins &&
                <div>Allowed Origins: {project.allowedOrigins}</div>}
            <p>
                <br />
                <a href="#" role="button" class="secondary outline w-25">Edit</a>
                <a href="#" role="button" class="secondary outline w-25">Delete</a>
            </p>
        </details>
    );
}
export function ProjectView(data: Projects) {
    const { projects } = data;
    return (
        <section>
            <h1>Projects</h1>
            <AddProject />
            {projects.length === 0 ? <p>No projects</p> : projects.map((project) => printProject(project))}
        </section>
    );
}
