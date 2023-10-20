import { useState } from "preact/hooks";

export function AddProject() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [pageLoadsChecked, setPageLoadsChecked] = useState(true);
    const [storeUA, setStoreUA] = useState(true);
    const [pageClicksChecked, setPageClicksChecked] = useState(true);
    const [captureAllClicks, setCaptureAllClicks] = useState(false);
    const [pageScrollsChecked, setPageScrollsChecked] = useState(true);

    const addProjectButton = async () => {
        const options = {
            method: "POST",
            body: new URLSearchParams({
                name,
                description,
                pageLoadsChecked: pageLoadsChecked.toString(),
                storeUA: storeUA.toString(),
                pageClicksChecked: pageClicksChecked.toString(),
                captureAllClicks: captureAllClicks.toString(),
                pageScrollsChecked: pageScrollsChecked.toString(),
            }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
            },
        };

        const response = await fetch("/dashboard/projects", options);
        if (response.ok) {
            //clearForm();
            //reloadar sidan så länge som en workaround för att få det nya projected
            window.location.href = "/dashboard/projects";
        } else {
            //Poppa varningsruta med fel
            console.error("Update failed");
        }
    };

    const clearForm = () => {
        // Reset form input values
        setName("");
        setDescription("");

        // Reset checkbox states
        setPageLoadsChecked(true);
        setStoreUA(true);
        setPageClicksChecked(true);
        setCaptureAllClicks(false);
        setPageScrollsChecked(true);
        const addProjectPane = document.getElementById("addProjectPane");
        if (addProjectPane) {
            addProjectPane.removeAttribute("open");
        }
    };

    return (
        <details id="addProjectPane">
            <summary>+ Add Project</summary>
            <input
                type="text"
                placeholder="Project Name"
                value={name}
                onChange={(e) => setName((e.target as HTMLInputElement).value)}
                class=""
            />
            <textarea
                type="text"
                placeholder="Project Description"
                value={description}
                onChange={(e) => setDescription((e.target as HTMLInputElement).value)}
                rows={4}
                class=""
            />
            <p>Tracking options for this project</p>
            <fieldset>
                <hr />
                <ul>
                    <li style="list-style-type: none;">
                        <label for="PageLoads">
                            <input
                                type="checkbox"
                                id="PageLoads"
                                name="PageLoads"
                                role="switch"
                                checked={pageLoadsChecked}
                                onChange={() => setPageLoadsChecked(!pageLoadsChecked)}
                            />
                            Track page loads
                        </label>

                        <ul>
                            <li style="list-style-type: none;">
                                <label for="PageLoadsStoreUA">
                                    <input
                                        type="checkbox"
                                        id="PageLoadsStoreUA"
                                        name="PageLoadsStoreUA"
                                        checked={storeUA}
                                        disabled={!pageLoadsChecked}
                                        onChange={() => setStoreUA(!storeUA)}
                                    />
                                    Store user agent
                                </label>
                            </li>
                        </ul>
                    </li>
                    <hr />
                    <li style="list-style-type: none;">
                        <label for="PageClicks">
                            <input
                                type="checkbox"
                                id="PageClicks"
                                name="PageClicks"
                                role="switch"
                                checked={pageClicksChecked}
                                onChange={() => setPageClicksChecked(!pageClicksChecked)}
                            />
                            Track page clicks. The default is to only track clicks made to link elements
                        </label>

                        <ul>
                            <li style="list-style-type: none;">
                                <label for="PageClicksCaptureAll">
                                    <input
                                        type="checkbox"
                                        id="PageClicksCaptureAll"
                                        name="PageClicksCaptureAll"
                                        checked={captureAllClicks}
                                        disabled={!pageClicksChecked}
                                        onChange={() => setCaptureAllClicks(!captureAllClicks)}
                                    />
                                    Capture all page clicks
                                </label>
                            </li>
                        </ul>
                    </li>
                    <hr />
                    <li style="list-style-type: none;">
                        <label for="PageScrolls">
                            <input
                                type="checkbox"
                                id="PageClicks"
                                name="PageClicks"
                                role="switch"
                                checked={pageScrollsChecked}
                                onChange={() => setPageScrollsChecked(!pageScrollsChecked)}
                            />
                            Track page scrolls
                        </label>
                    </li>
                </ul>
            </fieldset>
            <br />
            <footer>
                <button onClick={() => clearForm()} class="">Cancel</button>
                <button onClick={() => addProjectButton()} class="">Add</button>
            </footer>
        </details>
    );
}
