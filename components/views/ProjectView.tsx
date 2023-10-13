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

interface Projects {
    projects: {
        id: string;
        realmId: string;
        ownerId?: string;
        name: string;
        description?: string;
        allowedOrigins?: string[];
        options?: ProjectOptions;
    }[];
}
export function ProjectView(data: Projects) {
    const { projects } = data;
    return (
        <section>
            <h1>Projects</h1>
            {projects.length === 0 ? <p>No projects</p> : (
                <ul>
                    {projects.map((project) => <li key={project.id}>{project.name}</li>)}
                </ul>
            )}
        </section>
    );
}
