import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Icon, type IconName } from "components/ui/Icon.tsx";

const THEME_KEY = "theme-preference";
type Theme = "auto" | "light" | "dark";

const OPTIONS: { value: Theme; label: string; icon: IconName }[] = [
    { value: "auto", label: "System", icon: "laptop" },
    { value: "light", label: "Light", icon: "sun" },
    { value: "dark", label: "Dark", icon: "moon" },
];

function isTheme(value: unknown): value is Theme {
    return value === "auto" || value === "light" || value === "dark";
}

function getSystemTheme(): Theme {
    return IS_BROWSER && globalThis.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
    if (!IS_BROWSER) return;
    const root = document.documentElement;
    if (theme === "auto") {
        root.classList.remove("dark");
        if (getSystemTheme() === "dark") {
            root.classList.add("dark");
        }
    } else if (theme === "dark") {
        root.classList.add("dark");
    } else {
        root.classList.remove("dark");
    }
}

export default function ThemeSwitcher() {
    const [theme, setTheme] = useState<Theme>("auto"); // default theme

    useEffect(() => {
        if (IS_BROWSER) {
            const storedTheme = localStorage.getItem(THEME_KEY);
            if (isTheme(storedTheme)) setTheme(storedTheme);
        }
    }, []);

    useEffect(() => {
        if (IS_BROWSER) {
            applyTheme(theme);
            localStorage.setItem(THEME_KEY, theme);

            if (theme === "auto") {
                const handler = () => applyTheme("auto");
                globalThis.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", handler);
                return () =>
                    globalThis.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", handler);
            }
        }
    }, [theme]);

    return (
        <div class="segmented" id="theme-switcher" role="group" aria-label="Theme">
            {OPTIONS.map((option) => (
                <button
                    type="button"
                    key={option.value}
                    class="gap-1.5"
                    aria-pressed={IS_BROWSER ? theme === option.value : undefined}
                    onClick={() => setTheme(option.value)}
                >
                    <Icon name={option.icon} class="w-3.5 h-3.5" />
                    {option.label}
                </button>
            ))}
        </div>
    );
}
