import { useState } from "preact/hooks";
import { Icon } from "components/ui/Icon.tsx";
import { DelProjectButton } from "islands/DelProjectButton.tsx";
import type { Project } from "lib/db.ts";

function snippetFor(project: Project): string {
    const id = project._id?.toString() ?? "";
    return `<script async src="https://track.webpulseanalytics.com/client/${id}" type="module"></script>`;
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // Clipboard access can be denied; leave the button unchanged.
        }
    };

    return (
        <button type="button" class="btn-secondary btn-sm" onClick={copy} aria-live="polite">
            <Icon name={copied ? "check" : "copy"} class="w-3.5 h-3.5" />
            {copied ? "Copied" : "Copy"}
        </button>
    );
}

function TrackingChips({ project }: { project: Project }) {
    const o = project.options ?? {};
    const chips: string[] = [];
    if (o.pageLoads?.enabled) chips.push("Page views");
    if (o.pageClicks?.enabled) chips.push(o.pageClicks.captureAllClicks ? "All clicks" : "Clicks");
    if (o.pageScrolls?.enabled) chips.push("Scrolls");
    if (o.storeUserAgent) chips.push("User agent");
    if (o.storeLocation) chips.push("Location");
    if (o.storeUTM) chips.push("UTM");

    if (chips.length === 0) return <span class="text-xs text-fg-3">No tracking options enabled</span>;
    return (
        <div class="flex flex-wrap gap-1.5">
            {chips.map((chip) => <span key={chip} class="chip">{chip}</span>)}
        </div>
    );
}

function ProjectCard(
    { project, onDelete, onError }: {
        project: Project;
        onDelete: (id: string) => void;
        onError: (msg: string) => void;
    },
) {
    const id = project._id?.toString() ?? "";
    const snippet = snippetFor(project);

    return (
        <article class="card min-w-0 flex flex-col">
            <div class="card-header items-start">
                <div class="min-w-0">
                    <h3 class="font-semibold text-fg truncate">{project.name}</h3>
                    {project.description && <p class="mt-0.5 text-[13px] text-fg-2">{project.description}</p>}
                </div>
                <div class="flex items-center gap-1 shrink-0">
                    <a href={`/dashboard/analytics/${id}`} class="btn-secondary btn-sm">View analytics</a>
                    <a
                        href={`/dashboard/projects?edit=${id}`}
                        class="icon-btn"
                        aria-label={`Edit ${project.name}`}
                    >
                        <Icon name="pencil" />
                    </a>
                    <DelProjectButton id={id} name={project.name} onDelete={onDelete} onError={onError} />
                </div>
            </div>

            <div class="px-5 pb-4">
                <div class="flex items-center justify-between gap-3">
                    <span class="eyebrow">Tracking snippet</span>
                    <CopyButton text={snippet} />
                </div>
                <pre class="mt-2 font-mono text-xs bg-sunken rounded-lg p-3 overflow-x-auto text-fg-2">
                    <code>{snippet}</code>
                </pre>
            </div>

            <div class="mt-auto px-5 py-4 border-t border-line flex items-center justify-between gap-4">
                <TrackingChips project={project} />
                <span class="font-mono text-xs text-fg-3 shrink-0">{id}</span>
            </div>
        </article>
    );
}

export function ProjectView(
    { projects, onDelete, onError, onNew }: {
        projects: Project[];
        onDelete: (id: string) => void;
        onError: (msg: string) => void;
        onNew: () => void;
    },
) {
    if (!projects || projects.length === 0) {
        return (
            <div class="card flex flex-col items-center text-center py-16 px-6">
                <span class="w-12 h-12 rounded-full bg-sunken flex items-center justify-center text-fg-3">
                    <Icon name="folder" class="w-6 h-6" />
                </span>
                <h2 class="mt-4 text-[15px] font-semibold text-fg">No projects yet</h2>
                <p class="mt-1 max-w-sm text-[13px] text-fg-2">
                    Create your first project to get a tracking snippet and start collecting privacy-friendly analytics.
                </p>
                <button type="button" class="btn-primary mt-6" onClick={onNew}>
                    <Icon name="plus" />
                    New project
                </button>
            </div>
        );
    }

    return (
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {projects.map((project) => (
                <ProjectCard
                    key={project._id?.toString() ?? project.name}
                    project={project}
                    onDelete={onDelete}
                    onError={onError}
                />
            ))}
        </div>
    );
}
