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
    const [storeUTM, setStoreUTM] = useState(project.options.storeUTM ?? false);
    const [pageClicksChecked, setPageClicksChecked] = useState(project.options.pageClicks.enabled || false);
    const [captureAllClicks, setCaptureAllClicks] = useState(project.options.pageClicks.captureAllClicks || false);
    const [pageScrollsChecked, setPageScrollsChecked] = useState(project.options.pageScrolls.enabled || false);

    const updateProjectButton = async () => {
        //Kontroller på indatat?

        const options = {
            method: "PUT",
            body: new URLSearchParams(Object.entries({
                _id: _id?.toString() ?? "",
                name,
                description,
                pageLoadsChecked: pageLoadsChecked.toString(),
                storeUA: storeUA.toString(),
                storeLoc: storeLoc.toString(),
                storeUTM: storeUTM.toString(),
                pageClicksChecked: pageClicksChecked.toString(),
                captureAllClicks: captureAllClicks.toString(),
                pageScrollsChecked: pageScrollsChecked.toString(),
            })),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
            },
        };

        const response = await fetch("/dashboard/projects", options);
        if (response.ok) {
            //clearForm();
            //reloadar sidan så länge som en workaround för att få det nya projected
            globalThis.location.href = "/dashboard/projects";
        } else {
            //Poppa varningsruta med fel
            console.error("Update failed");
        }
    };

    const clearForm = () => {
        // Bye
        globalThis.location.href = "/dashboard/projects";
    };

    return (
        <div class="space-y-4">
            <input
                type="text"
                placeholder="Project Name"
                value={name}
                onChange={(e) => setName((e.target as HTMLInputElement).value)}
                class="input-base"
            />
            <textarea
                placeholder="Project Description"
                value={description}
                onChange={(e) => setDescription((e.target as HTMLInputElement).value)}
                rows={4}
                class="input-base"
            />
            <p class="text-secondary font-medium">Tracking options for this project</p>
            <fieldset class="space-y-4">
                <hr class="border-input" />
                <ul class="space-y-3">
                    <li>
                        <label for="StoreUA" class="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                id="StoreUA"
                                name="StoreUA"
                                checked={storeUA}
                                disabled={!pageLoadsChecked}
                                onChange={() => setStoreUA(!storeUA)}
                                class="checkbox-base"
                            />
                            <span class="text-secondary">Store user agent</span>
                        </label>
                    </li>
                    <li>
                        <label for="StoreLoc" class="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                id="StoreLoc"
                                name="StoreLoc"
                                checked={storeLoc}
                                disabled={!pageLoadsChecked}
                                onChange={() => setStoreLoc(!storeLoc)}
                                class="checkbox-base"
                            />
                            <span class="text-secondary">Store user location</span>
                        </label>
                    </li>
                    <li>
                        <label for="StoreUTM" class="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                id="StoreUTM"
                                name="StoreUTM"
                                checked={storeUTM}
                                disabled={!pageLoadsChecked}
                                onChange={() => setStoreUTM(!storeUTM)}
                                class="checkbox-base"
                            />
                            <span class="text-secondary">Store UTM parameters</span>
                        </label>
                    </li>
                    <hr class="border-input" />
                    <li>
                        <label for="PageLoads" class="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                id="PageLoads"
                                name="PageLoads"
                                role="switch"
                                checked={pageLoadsChecked}
                                onChange={() => setPageLoadsChecked(!pageLoadsChecked)}
                                class="checkbox-base"
                            />
                            <span class="text-secondary">Track page loads</span>
                        </label>
                    </li>
                    <hr class="border-input" />
                    <li>
                        <label for="PageClicks" class="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                id="PageClicks"
                                name="PageClicks"
                                role="switch"
                                checked={pageClicksChecked}
                                onChange={() => setPageClicksChecked(!pageClicksChecked)}
                                class="checkbox-base"
                            />
                            <span class="text-secondary">
                                Track page clicks. The default is to only track clicks made to link elements
                            </span>
                        </label>

                        <ul class="ml-6 mt-2 space-y-2">
                            <li>
                                <label for="PageClicksCaptureAll" class="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="PageClicksCaptureAll"
                                        name="PageClicksCaptureAll"
                                        checked={captureAllClicks}
                                        disabled={!pageClicksChecked}
                                        onChange={() => setCaptureAllClicks(!captureAllClicks)}
                                        class="checkbox-base"
                                    />
                                    <span class="text-secondary">Capture all page clicks</span>
                                </label>
                            </li>
                        </ul>
                    </li>
                    <hr class="border-input" />
                    <li>
                        <label for="PageScrolls" class="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                id="PageScrolls"
                                name="PageScrolls"
                                role="switch"
                                checked={pageScrollsChecked}
                                onChange={() => setPageScrollsChecked(!pageScrollsChecked)}
                                class="checkbox-base"
                            />
                            <span class="text-secondary">Track page scrolls</span>
                        </label>
                    </li>
                </ul>
            </fieldset>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <button
                        onClick={() => clearForm()}
                        class="btn-secondary w-full"
                    >
                        Cancel
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => updateProjectButton()}
                        class="btn-primary w-full"
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
}
