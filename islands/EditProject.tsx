import { useState } from "preact/hooks";
import { Project } from "lib/db.ts";

interface ProjectData {
    project: Project;
}

export function EditProject(data: ProjectData) {
    const { project } = data;
    const _id = project._id;
    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description || "");
    const [pageLoadsChecked, setPageLoadsChecked] = useState(project.options.pageLoads.enabled || false);
    const [storeUA, setStoreUA] = useState(project.options.storeUserAgent || false);
    const [storeLoc, setStoreLoc] = useState(project.options.storeLocation || false);
    const [pageClicksChecked, setPageClicksChecked] = useState(project.options.pageClicks.enabled || false);
    const [captureAllClicks, setCaptureAllClicks] = useState(project.options.pageClicks.captureAllClicks || false);
    const [pageScrollsChecked, setPageScrollsChecked] = useState(project.options.pageScrolls.enabled || false);

    const updateProjectButton = async () => {

        //Kontroller på indatat?

        const options = {
            method: "PUT",
            body: new URLSearchParams({
                _id: _id?.toString(),
                name,
                description,
                pageLoadsChecked: pageLoadsChecked.toString(),
                storeUA: storeUA.toString(),
                storeLoc: storeLoc.toString(),
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
        // Bye
        window.location.href = "/dashboard/projects";
    };

    return (
        <div>
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
                        <label for="StoreUA">
                            <input
                                type="checkbox"
                                id="StoreUA"
                                name="StoreUA"
                                checked={storeUA}
                                disabled={!pageLoadsChecked}
                                onChange={() => setStoreUA(!storeUA)}
                            />
                            Store user agent
                        </label>
                    </li>
                    <li style="list-style-type: none;">
                        <label for="StoreLoc">
                            <input
                                type="checkbox"
                                id="StoreLoc"
                                name="StoreLoc"
                                checked={storeLoc}
                                disabled={!pageLoadsChecked}
                                onChange={() => setStoreLoc(!storeLoc)}
                            />
                            Store user location
                        </label>
                    </li>
                    <hr />
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
            <div class="grid">
                <div>
                    <button onClick={() => clearForm()} class="secondary">Cancel</button>
                </div>
                <div>
                    <button onClick={() => updateProjectButton()} class="">Update</button>
                </div>
            </div>
        </div>
    );
}
