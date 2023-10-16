import { useState } from "preact/hooks";

export function AddRealm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const addRealm = () => {
        console.log({ title: title, description: description });
        window.location.href = "/dashboard/realms";
    };

    return (
        <details>
            <summary>+ Add Realm</summary>
            <input
                type="text"
                placeholder="Project Title"
                onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
                class=""
            />
            <textarea
                type="text"
                placeholder="Project Description"
                onChange={(e) => setDescription((e.target as HTMLInputElement).value)}
                rows={4}
                class=""
            />
            <footer>
                <button class="">Cancel</button>
                <button onClick={() => addRealm()} class="">Add</button>
            </footer>
        </details>
    );
}
