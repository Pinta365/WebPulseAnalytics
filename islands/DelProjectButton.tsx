import { useRef, useState } from "preact/hooks";
import { Icon } from "components/ui/Icon.tsx";

interface ProjectData {
    id: string;
    name: string;
    onDelete: (id: string) => void;
    onError: (msg: string) => void;
}
const DIALOG_CLASS =
    "w-[calc(100%_-_2rem)] max-w-md m-auto p-0 bg-surface text-fg border border-line rounded-xl shadow-pop " +
    "[&::backdrop]:bg-fg/25 [&::backdrop]:backdrop-blur-sm";

export function DelProjectButton({ id, name, onDelete, onError }: ProjectData) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [busy, setBusy] = useState(false);

    const confirmDelete = async () => {
        if (busy) return;
        setBusy(true);

        const options = {
            method: "DELETE",
            body: new URLSearchParams({
                _id: id,
            }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
            },
        };

        try {
            const response = await fetch("/dashboard/projects", options);
            if (response.ok) {
                dialogRef.current?.close();
                onDelete(id);
            } else {
                dialogRef.current?.close();
                onError("Failed to delete project");
            }
        } catch {
            dialogRef.current?.close();
            onError("Failed to delete project");
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => dialogRef.current?.showModal()}
                class="icon-btn hover:text-bad"
                aria-label={`Delete ${name}`}
            >
                <Icon name="trash" />
            </button>

            <dialog ref={dialogRef} class={DIALOG_CLASS} aria-label={`Delete ${name}`}>
                <div class="card-header border-b border-line">
                    <h2 class="card-title">Delete {name}?</h2>
                </div>
                <p class="px-5 py-4 text-[13px] text-fg-2 leading-relaxed">
                    Analytics data stops being collected for this site immediately. This cannot be undone.
                </p>
                <div class="px-5 py-4 border-t border-line flex justify-end gap-2">
                    <button type="button" class="btn-secondary" onClick={() => dialogRef.current?.close()}>
                        Cancel
                    </button>
                    <button type="button" class="btn-danger" onClick={confirmDelete} disabled={busy}>
                        Delete
                    </button>
                </div>
            </dialog>
        </>
    );
}
