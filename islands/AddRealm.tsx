import { useState } from "preact/hooks";

export function AddRealm() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const addRealmButton = async () => {
        const options = {
            method: "POST",
            body: new URLSearchParams({
                name,
                description,
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

    const cancelButton = () => {
        window.location.href = "/dashboard/realms";
        // Rensa formuläret
        //setName("");
        //setDescription("");
    };

    return (
        <details>
            <summary>+ Add Realm</summary>
            <input
                type="text"
                placeholder="Realm name"
                onChange={(e) => setName((e.target as HTMLInputElement).value)}
                class=""
            />
            <textarea
                type="text"
                placeholder="Realm Description"
                onChange={(e) => setDescription((e.target as HTMLInputElement).value)}
                rows={4}
                class=""
            />
            <footer>
                <button onClick={() => cancelButton()} class="">Cancel</button>
                <button onClick={() => addRealmButton()} class="">Add</button>
            </footer>
        </details>
    );
}
