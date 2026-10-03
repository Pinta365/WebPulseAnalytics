import { useEffect, useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { PageHeader } from "components/layout/AppShell.tsx";
import { Icon } from "components/ui/Icon.tsx";
import { AddProject } from "./AddProject.tsx";
import { ProjectView } from "../components/ProjectView.tsx";
import { NotificationProvider, useNotification } from "../components/NotificationContext.tsx";
import { NotificationBanner } from "../components/NotificationBanner.tsx";
import type { Project } from "lib/db.ts";
const DIALOG_CLASS =
    "w-[calc(100%_-_2rem)] max-w-lg m-auto p-0 bg-surface text-fg border border-line rounded-xl shadow-pop " +
    "[&::backdrop]:bg-fg/25 [&::backdrop]:backdrop-blur-sm";

export default function ProjectsIsland({ initialProjects }: { initialProjects: Project[] }) {
    return (
        <NotificationProvider>
            <ProjectsIslandContent initialProjects={initialProjects} />
        </NotificationProvider>
    );
}

function ProjectsIslandContent({ initialProjects }: { initialProjects: Project[] }) {
    const projects = useSignal<Project[]>(initialProjects);
    const { showNotification } = useNotification();
    const dialogRef = useRef<HTMLDialogElement>(null);

    const openAddDialog = () => dialogRef.current?.showModal();

    useEffect(() => {
        if (globalThis.location.hash === "#new") {
            dialogRef.current?.showModal();
        }
    }, []);

    const handleProjectAdded = (newProject: unknown) => {
        if (newProject) {
            projects.value = [newProject as Project, ...projects.value];
            showNotification("Project added!", "success");
        } else {
            showNotification("Project added (reload to see details).", "info");
        }
        dialogRef.current?.close();
    };

    const handleError = (msg: string) => {
        showNotification(msg, "error");
    };

    const handleProjectDeleted = (id: string) => {
        projects.value = projects.value.filter((p: Project) => p._id?.toString() !== id);
        showNotification("Project deleted!", "success");
    };

    return (
        <>
            <NotificationBannerWrapper />

            <PageHeader title="Projects" subtitle="Sites you track with WebPulse.">
                <button type="button" class="btn-primary" onClick={openAddDialog}>
                    <Icon name="plus" />
                    New project
                </button>
            </PageHeader>

            <ProjectView
                projects={projects.value}
                onDelete={handleProjectDeleted}
                onError={handleError}
                onNew={openAddDialog}
            />

            <dialog ref={dialogRef} class={DIALOG_CLASS} aria-label="New project">
                <AddProject
                    onProjectAdded={handleProjectAdded}
                    onError={handleError}
                    onClose={() => dialogRef.current?.close()}
                />
            </dialog>
        </>
    );
}

function NotificationBannerWrapper() {
    const { message, type, clearNotification } = useNotification();
    return <NotificationBanner message={message} type={type} onClose={clearNotification} />;
}
