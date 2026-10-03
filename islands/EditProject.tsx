import { useState } from "preact/hooks";
import { PageHeader } from "components/layout/AppShell.tsx";
import { Icon } from "components/ui/Icon.tsx";
import { NotificationProvider, useNotification } from "components/NotificationContext.tsx";
import { NotificationBanner } from "components/NotificationBanner.tsx";
import { ProjectOptionsForm, type ProjectOptionsValue } from "components/ProjectOptionsForm.tsx";
import type { Project } from "lib/db.ts";

export function EditProject({ project }: { project: Project }) {
    return (
        <NotificationProvider>
            <EditProjectContent project={project} />
        </NotificationProvider>
    );
}

function EditProjectContent({ project }: { project: Project }) {
    const { showNotification } = useNotification();
    const id = project._id?.toString() ?? "";
    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description || "");
    const [options, setOptions] = useState<ProjectOptionsValue>({
        pageLoadsChecked: project.options?.pageLoads?.enabled ?? false,
        storeUA: project.options?.storeUserAgent ?? false,
        storeLoc: project.options?.storeLocation ?? false,
        storeUTM: project.options?.storeUTM ?? false,
        pageClicksChecked: project.options?.pageClicks?.enabled ?? false,
        captureAllClicks: project.options?.pageClicks?.captureAllClicks ?? false,
        pageScrollsChecked: project.options?.pageScrolls?.enabled ?? false,
    });
    const [saving, setSaving] = useState(false);

    const updateOptions = (patch: Partial<ProjectOptionsValue>) => {
        setOptions((prev) => ({ ...prev, ...patch }));
    };

    const save = async (e: Event) => {
        e.preventDefault();
        if (!name.trim() || saving) return;
        setSaving(true);

        const body = new URLSearchParams(Object.entries({
            _id: id,
            name,
            description,
            pageLoadsChecked: options.pageLoadsChecked.toString(),
            storeUA: options.storeUA.toString(),
            storeLoc: options.storeLoc.toString(),
            storeUTM: options.storeUTM.toString(),
            pageClicksChecked: options.pageClicksChecked.toString(),
            captureAllClicks: options.captureAllClicks.toString(),
            pageScrollsChecked: options.pageScrollsChecked.toString(),
        }));

        try {
            const response = await fetch("/dashboard/projects", {
                method: "PUT",
                body,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json",
                },
            });
            if (response.ok) {
                globalThis.location.href = "/dashboard/projects";
            } else {
                showNotification("Failed to update project.", "error");
            }
        } catch {
            showNotification("Failed to update project.", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <NotificationBannerWrapper />
            <PageHeader title="Edit project" subtitle={project.name} />
            <a
                href="/dashboard/projects"
                class="inline-flex items-center gap-1.5 mb-4 text-[13px] text-fg-2 hover:text-fg transition-colors"
            >
                <Icon name="arrowRight" class="w-4 h-4 rotate-180" />
                Back to projects
            </a>

            <div class="card max-w-2xl">
                <form onSubmit={save}>
                    <div class="card-header border-b border-line">
                        <h2 class="card-title">Details</h2>
                    </div>

                    <div class="px-5 py-4 space-y-4">
                        <div>
                            <label class="label" for="project-name">Name</label>
                            <input
                                id="project-name"
                                type="text"
                                class="input-base"
                                value={name}
                                required
                                onInput={(e) => setName((e.target as HTMLInputElement).value)}
                            />
                        </div>
                        <div>
                            <label class="label" for="project-description">Description</label>
                            <textarea
                                id="project-description"
                                class="input-base"
                                rows={3}
                                value={description}
                                placeholder="Optional notes about this site"
                                onInput={(e) => setDescription((e.target as HTMLInputElement).value)}
                            />
                        </div>
                    </div>

                    <div class="border-t border-line">
                        <div class="px-5 pt-4">
                            <h3 class="card-title mb-1">Tracking</h3>
                        </div>
                        <div class="px-5 pb-2">
                            <ProjectOptionsForm value={options} onChange={updateOptions} />
                        </div>
                    </div>

                    <div class="px-5 py-4 border-t border-line flex justify-end gap-2">
                        <a href="/dashboard/projects" class="btn-secondary">Cancel</a>
                        <button type="submit" class="btn-primary" disabled={!name.trim() || saving}>
                            Save changes
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

function NotificationBannerWrapper() {
    const { message, type, clearNotification } = useNotification();
    return <NotificationBanner message={message} type={type} onClose={clearNotification} />;
}
