import { useSignal } from "@preact/signals";
import { AddProject } from "./AddProject.tsx";
import { ProjectView } from "../components/ProjectView.tsx";
import { NotificationProvider, useNotification } from "../components/NotificationContext.tsx";
import { NotificationBanner } from "../components/NotificationBanner.tsx";

export default function ProjectsIsland({ initialProjects }: { initialProjects: any[] }) {
    return (
        <NotificationProvider>
            <NotificationBannerWrapper />
            <ProjectsIslandContent initialProjects={initialProjects} />
        </NotificationProvider>
    );
}

function ProjectsIslandContent({ initialProjects }: { initialProjects: any[] }) {
    const projects = useSignal(initialProjects);
    const { showNotification } = useNotification();

    const handleProjectAdded = (newProject: any) => {
        if (newProject) {
            projects.value = [newProject, ...projects.value];
            showNotification("Project added!", "success");
        } else {
            showNotification("Project added (reload to see details).", "info");
        }
    };
    const handleError = (msg: string) => {
        showNotification(msg, "error");
    };
    const handleProjectDeleted = (id: string) => {
        projects.value = projects.value.filter((p: any) => p._id?.toString() !== id);
        showNotification("Project deleted!", "success");
    };

    return (
        <>
            <AddProject onProjectAdded={handleProjectAdded} onError={handleError} />
            <ProjectView projects={projects.value} onDelete={handleProjectDeleted} onError={handleError} />
        </>
    );
}

function NotificationBannerWrapper() {
    const { message, type, clearNotification } = useNotification();
    return <NotificationBanner message={message} type={type} onClose={clearNotification} />;
}
