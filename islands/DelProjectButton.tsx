interface ProjectData {
    id: string;
}

export function DelProjectButton(data: ProjectData) {
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
            globalThis.location.href = "/dashboard/projects";
        } else {
            //Poppa varningsruta med fel
            console.error("Post failed");
        }
    };

    return (
        <button
            type="button"
            onClick={() => delButtonClick(data.id)}
            class="btn-danger"
        >
            Delete
        </button>
    );
}
