interface ProjectData {
    id: string;
    onDelete: (id: string) => void;
    onError: (msg: string) => void;
}

export function DelProjectButton({ id, onDelete, onError }: ProjectData) {
    const delButtonClick = async (id: string) => {
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
        const response = await fetch("/dashboard/projects", options);
        if (response.ok) {
            onDelete(id);
        } else {
            onError("Failed to delete project");
            console.error("Post failed");
        }
    };

    return (
        <button
            type="button"
            onClick={() => delButtonClick(id)}
            class="btn-danger"
        >
            Delete
        </button>
    );
}
