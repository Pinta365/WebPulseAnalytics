import { useState } from "preact/hooks";
import { Icon } from "components/ui/Icon.tsx";
import { defaultProjectOptions, ProjectOptionsForm, type ProjectOptionsValue } from "components/ProjectOptionsForm.tsx";

export function AddProject(
    { onProjectAdded, onError, onClose }: {
        onProjectAdded: (project: unknown) => void;
        onError: (msg: string) => void;
        onClose?: () => void;
    },
) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [options, setOptions] = useState<ProjectOptionsValue>(defaultProjectOptions);
    const [submitting, setSubmitting] = useState(false);

    const updateOptions = (patch: Partial<ProjectOptionsValue>) => {
        setOptions((prev) => ({ ...prev, ...patch }));
    };

    const resetForm = () => {
        setName("");
        setDescription("");
        setOptions(defaultProjectOptions);
    };

    const submit = async (e: Event) => {
        e.preventDefault();
        if (!name.trim() || submitting) return;
        setSubmitting(true);

        const body = new URLSearchParams(Object.entries({
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
                method: "POST",
                body,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json",
                },
            });
            if (response.ok) {
                let newProject: unknown = null;
                try {
                    newProject = await response.json();
                } catch {
                    newProject = null; // fallback if no JSON
                }
                resetForm();
                onProjectAdded(newProject);
            } else {
                onError("Failed to add project");
            }
        } catch {
            onError("Failed to add project");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={submit} class="flex flex-col">
            <div class="card-header border-b border-line">
                <h2 class="card-title">New project</h2>
                <button type="button" class="icon-btn" onClick={onClose} aria-label="Close dialog">
                    <Icon name="close" />
                </button>
            </div>

            <div class="px-5 py-4 space-y-4 overflow-y-auto max-h-[70vh]">
                <div>
                    <label class="label" for="project-name">Name</label>
                    <input
                        id="project-name"
                        type="text"
                        class="input-base"
                        value={name}
                        placeholder="My website"
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

                <div>
                    <h3 class="card-title mb-1">Tracking</h3>
                    <ProjectOptionsForm value={options} onChange={updateOptions} />
                </div>
            </div>

            <div class="px-5 py-4 border-t border-line flex justify-end gap-2">
                <button type="button" class="btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" class="btn-primary" disabled={!name.trim() || submitting}>
                    Create project
                </button>
            </div>
        </form>
    );
}
