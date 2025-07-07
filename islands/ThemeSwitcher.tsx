import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

const THEME_KEY = "theme-preference";
type Theme = "auto" | "light" | "dark";

function isTheme(value: any): value is Theme {
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

    if (!IS_BROWSER) return <div />;

    return (
        <div class="flex gap-5 items-center" id="theme-switcher">
            {["auto", "light", "dark"].map((value) => (
                <label class="flex items-center gap-2 cursor-pointer" key={value}>
                    <input
                        type="radio"
                        name="theme"
                        value={value}
                        checked={theme === value}
                        onChange={() => setTheme(value as Theme)}
                        class="checkbox-base"
                    />
                    <span class="text-secondary">
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                </label>
            ))}
        </div>
    );
}
