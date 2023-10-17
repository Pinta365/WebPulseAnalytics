interface ProjectData {
    id: string;
}

export function DelProjectButton(data: ProjectData) {
    const delButtonClick = async (id: string) => {
        const options = {
            method: "DELETE",
            body: new URLSearchParams({
                id,
            }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
            },
        };
        const response = await fetch("/dashboard/projects", options);
        if (response.ok) {
            window.location.href = "/dashboard/projects";
        } else {
            //Poppa varningsruta med fel
            console.error("Post failed");
        }
    };

    return <button onClick={() => delButtonClick(data.id)} class="secondary outline w-25">Delete</button>;
}
