interface RealmData {
    id: string;
}

export function DelRealmButton(data: RealmData) {
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
        const response = await fetch("/dashboard/realms", options);
        if (response.ok) {
            window.location.href = "/dashboard/realms";
        } else {
            //Poppa varningsruta med fel
            console.error("Post failed");
        }
    };

    return <button type="button" onClick={() => delButtonClick(data.id)} class="secondary outline w-25">Delete</button>;
}
