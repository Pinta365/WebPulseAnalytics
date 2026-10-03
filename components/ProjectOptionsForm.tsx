/** Shared state for the tracking-option toggles used by Add and Edit project forms. */
export interface ProjectOptionsValue {
    pageLoadsChecked: boolean;
    storeUA: boolean;
    storeLoc: boolean;
    storeUTM: boolean;
    pageClicksChecked: boolean;
    captureAllClicks: boolean;
    pageScrollsChecked: boolean;
}

export const defaultProjectOptions: ProjectOptionsValue = {
    pageLoadsChecked: true,
    storeUA: true,
    storeLoc: true,
    storeUTM: false,
    pageClicksChecked: true,
    captureAllClicks: false,
    pageScrollsChecked: true,
};

interface OptionRowProps {
    id: string;
    label: string;
    hint: string;
    checked: boolean;
    disabled?: boolean;
    onChange: (checked: boolean) => void;
}

function OptionRow({ id, label, hint, checked, disabled, onChange }: OptionRowProps) {
    return (
        <div class="flex items-center justify-between gap-6 py-3">
            <label for={id} class="min-w-0">
                <span class="block text-[13px] font-medium text-fg">{label}</span>
                <span class="block text-xs text-fg-3 mt-0.5">{hint}</span>
            </label>
            <input
                type="checkbox"
                id={id}
                class="switch"
                checked={checked}
                disabled={disabled}
                onChange={(e) => onChange((e.target as HTMLInputElement).checked)}
            />
        </div>
    );
}

/** Renders the tracking option rows. Callers provide the surrounding card and padding. */
export function ProjectOptionsForm(
    { value, onChange }: { value: ProjectOptionsValue; onChange: (patch: Partial<ProjectOptionsValue>) => void },
) {
    return (
        <div class="divide-y divide-line">
            <OptionRow
                id="opt-page-loads"
                label="Page views"
                hint="Count a view each time a page loads."
                checked={value.pageLoadsChecked}
                onChange={(checked) => onChange({ pageLoadsChecked: checked })}
            />
            <OptionRow
                id="opt-user-agent"
                label="User agent"
                hint="Store browser and device details."
                checked={value.storeUA}
                disabled={!value.pageLoadsChecked}
                onChange={(checked) => onChange({ storeUA: checked })}
            />
            <OptionRow
                id="opt-location"
                label="Location"
                hint="Resolve an approximate country from IP, once per session."
                checked={value.storeLoc}
                disabled={!value.pageLoadsChecked}
                onChange={(checked) => onChange({ storeLoc: checked })}
            />
            <OptionRow
                id="opt-utm"
                label="UTM parameters"
                hint="Keep campaign parameters such as utm_source."
                checked={value.storeUTM}
                disabled={!value.pageLoadsChecked}
                onChange={(checked) => onChange({ storeUTM: checked })}
            />
            <OptionRow
                id="opt-page-clicks"
                label="Clicks"
                hint="By default only clicks on links are recorded."
                checked={value.pageClicksChecked}
                onChange={(checked) => onChange({ pageClicksChecked: checked })}
            />
            <OptionRow
                id="opt-capture-all-clicks"
                label="Capture all clicks"
                hint="Record clicks on any element, not just links."
                checked={value.captureAllClicks}
                disabled={!value.pageClicksChecked}
                onChange={(checked) => onChange({ captureAllClicks: checked })}
            />
            <OptionRow
                id="opt-page-scrolls"
                label="Scrolls"
                hint="Record how far visitors scroll down the page."
                checked={value.pageScrollsChecked}
                onChange={(checked) => onChange({ pageScrollsChecked: checked })}
            />
        </div>
    );
}
