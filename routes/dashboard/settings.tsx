import type { Handlers, PageProps } from "$fresh/server.ts";
import { NavTop } from "components/layout/NavTop.tsx";
import { NavSide } from "islands/NavSide.tsx";
import { Footer } from "components/layout/Footer.tsx";

export const handler: Handlers = {
    GET(_req, ctx) {
        return ctx.render({
            state: ctx.state,
        });
    },
};

export default function SettingsPage({ data }: PageProps) {
    const { state } = data;
    return (
        <body>
            <NavTop {...state} />
            <main class="container">
                <div class="grid">
                    <NavSide />

                    <section style={{ padding: "2em 1.5em" }}>
                        <h1 style={{ fontSize: "2em", marginBottom: "0.5em" }}>Settings</h1>
                        <div style={{ color: "#aaa", marginBottom: "2em" }}>
                            <div class="card" style={{ padding: "1.5em", maxWidth: 500 }}>
                                <img
                                    src={state.avatar}
                                    alt={state.displayName}
                                    style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                                />
                                <h2 style={{ fontSize: "1.2em", marginBottom: "0.7em" }}>{state.displayName}</h2>
                                <div style={{ marginTop: "1.5em" }}>
                                    <label
                                        style={{
                                            fontWeight: 600,
                                            fontSize: "1.05em",
                                            marginBottom: "0.5em",
                                            display: "block",
                                        }}
                                    >
                                        Theme
                                    </label>
                                    <div
                                        id="theme-switcher"
                                        style={{ display: "flex", gap: "1.2em", alignItems: "center" }}
                                    >
                                        <label style={{ display: "flex", alignItems: "center", gap: "0.4em" }}>
                                            <input type="radio" name="theme" value="auto" /> Auto
                                        </label>
                                        <label style={{ display: "flex", alignItems: "center", gap: "0.4em" }}>
                                            <input type="radio" name="theme" value="light" /> Light
                                        </label>
                                        <label style={{ display: "flex", alignItems: "center", gap: "0.4em" }}>
                                            <input type="radio" name="theme" value="dark" /> Dark
                                        </label>
                                    </div>
                                    <div style={{ color: "#888", fontSize: "0.95em", marginTop: "0.5em" }}>
                                        "Auto" follows your system preference.
                                    </div>
                                </div>
                            </div>
                            Manage your account and preferences. More settings coming soon!
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
            <script
                dangerouslySetInnerHTML={{
                    __html: `
(function() {
    const THEME_KEY = 'theme-preference';
    const root = document.documentElement;
    function applyTheme(theme) {
        if (theme === 'auto') {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', theme);
        }
    }
    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    function getSavedTheme() {
        return localStorage.getItem(THEME_KEY) || 'auto';
    }
    function setTheme(theme) {
        localStorage.setItem(THEME_KEY, theme);
        applyTheme(theme);
    }
    // Set initial state
    const saved = getSavedTheme();
    applyTheme(saved);
    // Set radio button
    const radios = document.querySelectorAll('#theme-switcher input[type=radio][name=theme]');
    radios.forEach(r => {
        r.checked = (r.value === saved);
        r.addEventListener('change', (e) => {
            setTheme(e.target.value);
        });
    });
    // Listen for system theme changes if auto
    if (saved === 'auto') {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (getSavedTheme() === 'auto') {
                applyTheme('auto');
            }
        });
    }
})();
`,
                }}
            />
        </body>
    );
}
