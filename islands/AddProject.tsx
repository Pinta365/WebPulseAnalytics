import { useState } from "preact/hooks";

export function AddProject() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const addProject = () => {
        console.log({ title: title, description: description });
        window.location.href = "/dashboard/realms";
    };

    return (
        <details>
            <summary>+ Add PRoject</summary>
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
                <button onClick={() => addProject()} class="">Add</button>
            </footer>
        </details>
    );
}
