// Stroke icons drawn on a 24px grid (shapes follow the Lucide set, ISC license).
const paths = {
    overview: "M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z",
    analytics: "M22 12h-4l-3 9L9 3l-3 9H2",
    folder:
        "M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
    settings:
        "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
    logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
    chevronDown: "m6 9 6 6 6-6",
    chevronUpDown: "m7 15 5 5 5-5M7 9l5-5 5 5",
    check: "M20 6 9 17l-5-5",
    plus: "M12 5v14M5 12h14",
    copy: "M8 8h12v12H8zM4 16V4h12",
    external: "M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
    globe:
        "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
    monitor: "M2 3h20v14H2zM8 21h8M12 17v4",
    pencil: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z",
    trash: "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
    menu: "M4 6h16M4 12h16M4 18h16",
    close: "M18 6 6 18M6 6l12 12",
    file: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2zM14 2v6h6",
    arrowRight: "M5 12h14M12 5l7 7-7 7",
    code: "m16 18 6-6-6-6M8 6l-6 6 6 6",
    shield:
        "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
    sun: "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41",
    moon: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",
    laptop:
        "M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16",
    github:
        "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4M9 18c-4.51 2-5-2-7-2",
    bot: "M12 8V4H8M4 8h16v12H4zM2 14h2M20 14h2M15 13v2M9 13v2",
    book: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",
} as const;

export type IconName = keyof typeof paths;

export function Icon(
    { name, class: className = "w-4 h-4", label }: { name: IconName; class?: string; label?: string },
) {
    return (
        <svg
            class={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden={label ? undefined : "true"}
            role={label ? "img" : undefined}
            aria-label={label}
        >
            <path d={paths[name]} />
        </svg>
    );
}

/** The WebPulse mark: a pulse line in a rounded tile. */
export function BrandMark({ class: className = "w-7 h-7" }: { class?: string }) {
    return (
        <svg class={className} viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="rgb(var(--accent))" />
            <path
                d="M5 17h5l3-7 5 13 3-6h6"
                fill="none"
                stroke="white"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    );
}

export function Brand({ href = "/" }: { href?: string }) {
    return (
        <a href={href} class="inline-flex items-center gap-2.5 group" aria-label="WebPulse Analytics home">
            <BrandMark />
            <span class="text-[15px] font-semibold tracking-tight text-fg">
                WebPulse <span class="text-fg-3 font-normal">Analytics</span>
            </span>
        </a>
    );
}
