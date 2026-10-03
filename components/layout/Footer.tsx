import type { ComponentChildren } from "preact";
import { Brand } from "components/ui/Icon.tsx";

const LINKS = [
    { href: "https://developer.webpulseanalytics.com", label: "Developer docs", external: true },
    { href: "https://github.com/Pinta365/WebPulseAnalytics", label: "GitHub", external: true },
    { href: "https://discord.gg/J7QtVxAt6F", label: "Discord", external: true },
    { href: "mailto:hello@webpulseanalytics.com", label: "Contact", external: false },
    { href: "/info/privacy", label: "Privacy", external: false },
    { href: "https://github.com/Pinta365/WebPulseAnalytics/blob/main/LICENSE", label: "MIT License", external: true },
];

export function Footer() {
    return (
        <footer class="border-t border-line">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="flex flex-col gap-2">
                    <Brand />
                    <p class="text-xs text-fg-3">© {new Date().getFullYear()} WebPulse Analytics</p>
                </div>
                <nav class="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
                    {LINKS.map((l) => (
                        <a
                            href={l.href}
                            class="text-[13px] text-fg-2 hover:text-fg transition-colors"
                            {...(l.external ? { target: "_blank", rel: "noopener" } : {})}
                        >
                            {l.label}
                        </a>
                    ))}
                </nav>
            </div>
        </footer>
    );
}

/** Layout for pages outside the dashboard: login, privacy policy, error pages. */
export function PublicShell({ children, signedIn = false }: { children: ComponentChildren; signedIn?: boolean }) {
    return (
        <div class="min-h-screen flex flex-col">
            <header class="h-16 border-b border-line bg-surface/80 backdrop-blur sticky top-0 z-30">
                <div class="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
                    <Brand />
                    <a href={signedIn ? "/dashboard" : "/"} class="btn-secondary btn-sm">
                        {signedIn ? "Open dashboard" : "Sign in"}
                    </a>
                </div>
            </header>
            <div class="flex-1">{children}</div>
            <Footer />
        </div>
    );
}
