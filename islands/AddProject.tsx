import { useState } from "preact/hooks";

export function AddProject() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [realmId, setRealm] = useState("");
    const [realmTest, setRealmTest] = useState("");

    const addProjectButton = async () => {
        const options = {
            method: "POST",
            body: new URLSearchParams({
                name,
                description,
                realmId,
                realmTest,
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

    const cancelButton = () => {
        window.location.href = "/dashboard/projects";
        // Rensa formuläret
        //setName("");
        //setDescription("");
    };

    return (
        <details>
            <summary>+ Add Project</summary>
            <input
                type="text"
                placeholder="Project Name"
                onChange={(e) => setName((e.target as HTMLInputElement).value)}
                class=""
            />
            <textarea
                type="text"
                placeholder="Project Description"
                onChange={(e) => setDescription((e.target as HTMLInputElement).value)}
                rows={4}
                class=""
            />
            <input
                type="text"
                placeholder="Realm Id"
                onChange={(e) => setRealm((e.target as HTMLInputElement).value)}
                class=""
            />
            <select title="realmSelector" onChange={(e) => setRealmTest((e.target as HTMLInputElement).value)}>
                <option value="123">Använd inte dropdownen än! Kopiera från realm sidan och kör på rutan ovan</option>
                <option value="123">Ska ersätta den manuella realm id rutan</option>
                <option value="456">med den här dynamiska dropdownen.... Ska bara...</option>
            </select>
            <div>HÄR LISTAS RESTEN AV OPTIONSARNA som check/radioboxar</div>
            <br />
            <footer>
                <button onClick={() => cancelButton()} class="">Cancel</button>
                <button onClick={() => addProjectButton()} class="">Add</button>
            </footer>
        </details>
    );
}
