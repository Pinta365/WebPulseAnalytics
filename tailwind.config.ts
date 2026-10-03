import { type Config } from "tailwindcss";

// Colors are CSS custom properties (RGB channels) defined in static/css/styles.css,
// so light/dark themes swap in one place and Tailwind opacity modifiers still work.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
    darkMode: "class",
    content: [
        "{routes,islands,components}/**/*.{ts,tsx,js,jsx}",
    ],
    theme: {
        extend: {
            colors: {
                canvas: token("canvas"),
                surface: token("surface"),
                sunken: token("sunken"),
                line: token("line"),
                fg: token("fg"),
                "fg-2": token("fg-2"),
                "fg-3": token("fg-3"),
                accent: token("accent"),
                "accent-fg": token("accent-fg"),
                good: token("good"),
                bad: token("bad"),
                live: token("live"),
            },
            fontFamily: {
                sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
                mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
            },
            boxShadow: {
                card: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
                pop: "0 12px 32px -8px rgb(0 0 0 / 0.25), 0 2px 6px -2px rgb(0 0 0 / 0.12)",
            },
        },
    },
} satisfies Config;
