import { useSignal } from "@preact/signals";
import { AddProject } from "./AddProject.tsx";
import { ProjectView } from "../components/ProjectView.tsx";
import { NotificationBanner } from "../components/NotificationBanner.tsx";

export default function ProjectsIsland({ initialProjects }: { initialProjects: any[] }) {
    const projects = useSignal(initialProjects);
    const notification = useSignal("");

    const handleProjectAdded = (newProject: any) => {
        if (newProject) {
            projects.value = [newProject, ...projects.value];
            notification.value = "Project added!";
        } else {
            notification.value = "Project added (reload to see details).";
        }
    };
    const handleError = (msg: string) => {
        notification.value = msg;
    };
    const handleProjectDeleted = (id: string) => {
        projects.value = projects.value.filter((p: any) => p._id?.toString() !== id);
        notification.value = "Project deleted!";
    };
    const handleCloseNotification = () => {
        notification.value = "";
    };

    return (
        <>
            <NotificationBanner message={notification.value} onClose={handleCloseNotification} />
            <AddProject onProjectAdded={handleProjectAdded} onError={handleError} />
            <ProjectView projects={projects.value} onDelete={handleProjectDeleted} onError={handleError} />
        </>
    );
}
