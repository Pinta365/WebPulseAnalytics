import { Brand, Icon, type IconName } from "components/ui/Icon.tsx";
import { flagEmoji } from "lib/format.ts";

const BENEFITS: { icon: IconName; title: string; body: string }[] = [
    { icon: "shield", title: "No cookies", body: "The script sets none, and IP addresses are never stored." },
    { icon: "analytics", title: "Live and historical", body: "Who is on your sites now, and how it trends." },
    { icon: "code", title: "One script tag", body: "Paste a single line and data starts flowing." },
];

// Decorative sample data for the hero illustration (not real traffic).
const CHART = [38, 44, 41, 52, 49, 61, 57, 66, 63, 74, 70, 82, 79, 91];
const PREVIOUS = [30, 34, 36, 33, 40, 38, 44, 42, 47, 45, 50, 49, 53, 52];
const PAGES = [
    { path: "/", n: 9 },
    { path: "/blog/hello-world", n: 6 },
    { path: "/pricing", n: 4 },
];
const COUNTRIES = [
    { code: "SE", name: "Sweden", share: 0.92 },
    { code: "US", name: "United States", share: 0.68 },
    { code: "DE", name: "Germany", share: 0.41 },
    { code: "NO", name: "Norway", share: 0.27 },
];

/** Builds a smooth-ish polyline path for the illustration chart. */
function path(values: number[], w: number, h: number, pad = 6): string {
    const max = 100;
    return values
        .map((v, i) => {
            const x = (i / (values.length - 1)) * w;
            const y = h - pad - (v / max) * (h - pad * 2);
            return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join("");
}

export function Login() {
    return (
        <div class="relative min-h-screen overflow-hidden bg-canvas">
            <Backdrop />

            <header class="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
                <Brand />
                <nav class="flex items-center gap-1">
                    <a href="https://developer.webpulseanalytics.com" class="btn-ghost btn-sm hidden sm:inline-flex">
                        Docs
                    </a>
                    <a
                        href="https://github.com/Pinta365/WebPulseAnalytics"
                        target="_blank"
                        rel="noopener"
                        class="btn-ghost btn-sm"
                    >
                        <Icon name="github" class="w-4 h-4" />
                        <span class="hidden sm:inline">GitHub</span>
                    </a>
                </nav>
            </header>

            <main class="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 pt-6 pb-20 lg:pt-14 grid lg:grid-cols-[1.05fr_1fr] gap-16 lg:gap-10 items-center">
                <section class="max-w-xl">
                    <a
                        href="https://github.com/Pinta365/WebPulseAnalytics"
                        target="_blank"
                        rel="noopener"
                        class="login-rise inline-flex items-center gap-2 h-7 pl-2 pr-3 rounded-full border border-line bg-surface/70 backdrop-blur text-xs text-fg-2 hover:text-fg transition-colors"
                    >
                        <span class="live-dot" />
                        Open source · MIT licensed
                        <Icon name="arrowRight" class="w-3 h-3" />
                    </a>

                    <h1
                        class="login-rise mt-6 text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold tracking-tight leading-[1.05] text-fg"
                        style={{ animationDelay: "80ms" }}
                    >
                        Know your traffic.
                        <br />
                        <span class="login-gradient-text">Not your visitors.</span>
                    </h1>

                    <p
                        class="login-rise mt-6 text-base sm:text-lg text-fg-2 leading-relaxed max-w-md"
                        style={{ animationDelay: "160ms" }}
                    >
                        WebPulse is lightweight, privacy-friendly web analytics. See what is happening on your sites in
                        real time, without cookie trackers following your visitors around.
                    </p>

                    <div class="login-rise mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: "240ms" }}>
                        <a
                            href="/api/auth/github/login"
                            class="btn-primary h-11 px-5 text-sm shadow-lg shadow-accent/25 hover:shadow-accent/40"
                        >
                            <Icon name="github" class="w-[18px] h-[18px]" />
                            Continue with GitHub
                        </a>
                        <a href="https://developer.webpulseanalytics.com" class="btn-secondary h-11 px-5 text-sm">
                            Read the docs
                            <Icon name="arrowRight" class="w-4 h-4" />
                        </a>
                    </div>
                    <p class="login-rise mt-4 text-xs text-fg-3" style={{ animationDelay: "280ms" }}>
                        By continuing you agree to our <a href="/info/privacy" class="link">privacy policy</a>.
                    </p>

                    <ul
                        class="login-rise mt-12 grid sm:grid-cols-3 gap-5 pt-8 border-t border-line"
                        style={{ animationDelay: "340ms" }}
                    >
                        {BENEFITS.map((b) => (
                            <li key={b.title}>
                                <span class="w-8 h-8 rounded-lg bg-accent/10 text-accent grid place-items-center">
                                    <Icon name={b.icon} class="w-4 h-4" />
                                </span>
                                <div class="mt-3 text-[13px] font-semibold text-fg">{b.title}</div>
                                <div class="mt-1 text-xs text-fg-3 leading-relaxed">{b.body}</div>
                            </li>
                        ))}
                    </ul>
                </section>

                <HeroScene />
            </main>
        </div>
    );
}

function Backdrop() {
    return (
        <div class="pointer-events-none absolute inset-0" aria-hidden="true">
            <div class="login-grid absolute inset-0" />
            <div class="absolute -top-40 -left-32 w-[36rem] h-[36rem] rounded-full bg-accent/20 blur-[120px]" />
            <div class="absolute top-1/3 -right-40 w-[30rem] h-[30rem] rounded-full bg-[#8b5cf6]/15 blur-[120px]" />
            {/* The brand motif: a heartbeat line running across the page */}
            <svg
                class="absolute left-0 right-0 bottom-[8%] w-full h-40"
                viewBox="0 0 1440 160"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="pulse-fade" x1="0" x2="1">
                        <stop offset="0" stop-color="rgb(var(--accent))" stop-opacity="0" />
                        <stop offset="0.5" stop-color="rgb(var(--accent))" stop-opacity="0.5" />
                        <stop offset="1" stop-color="rgb(var(--accent))" stop-opacity="0" />
                    </linearGradient>
                </defs>
                <path
                    d="M0 90 H900 l18 -10 l14 10 h40 l16 -64 l22 118 l18 -76 l12 22 h60 l14 -12 l12 12 H1440"
                    fill="none"
                    stroke="rgb(var(--accent))"
                    stroke-opacity="0.12"
                    stroke-width="1.5"
                />
                <path
                    d="M0 90 H900 l18 -10 l14 10 h40 l16 -64 l22 118 l18 -76 l12 22 h60 l14 -12 l12 12 H1440"
                    fill="none"
                    stroke="url(#pulse-fade)"
                    stroke-width="2"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    pathLength={1}
                    class="login-heartbeat"
                />
            </svg>
        </div>
    );
}

function HeroScene() {
    const W = 420;
    const H = 150;
    const line = path(CHART, W, H);
    const prev = path(PREVIOUS, W, H);
    const area = `${line}L${W},${H}L0,${H}Z`;
    const last = CHART[CHART.length - 1];
    const lastY = H - 6 - (last / 100) * (H - 12);

    return (
        <div class="relative w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto" aria-hidden="true">
            {/* Main chart card */}
            <div class="login-rise relative rounded-2xl p-px login-border" style={{ animationDelay: "200ms" }}>
                <div class="rounded-2xl bg-surface/90 backdrop-blur-xl p-5 sm:p-6 shadow-pop">
                    <div class="flex items-center gap-3">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-accent" />
                            <span class="text-xs font-medium text-fg-2">example.com</span>
                        </div>
                        <span class="segmented">
                            <span>24h</span>
                            <span aria-current="true">7d</span>
                            <span>30d</span>
                        </span>
                    </div>

                    <div class="mt-5 grid grid-cols-3 gap-4">
                        {[
                            { label: "Visitors", value: "12,480", delta: "+18%" },
                            { label: "Page views", value: "31.2K", delta: "+11%" },
                        ].map((s, i) => (
                            <div key={s.label} class={i ? "pl-4 border-l border-line" : ""}>
                                <div class="text-[11px] text-fg-3">{s.label}</div>
                                <div class="mt-0.5 text-lg sm:text-xl font-semibold tracking-tight text-fg tabular">
                                    {s.value}
                                </div>
                                <div class="text-[11px] font-medium text-good">▲ {s.delta.slice(1)}</div>
                            </div>
                        ))}
                    </div>

                    <svg viewBox={`0 0 ${W} ${H}`} class="mt-5 w-full h-auto overflow-visible">
                        <defs>
                            <linearGradient id="hero-fill" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0" stop-color="rgb(var(--accent))" stop-opacity="0.28" />
                                <stop offset="1" stop-color="rgb(var(--accent))" stop-opacity="0" />
                            </linearGradient>
                        </defs>
                        {[0.25, 0.5, 0.75].map((f) => (
                            <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="var(--chart-grid)" />
                        ))}
                        <path
                            d={prev}
                            fill="none"
                            stroke="var(--chart-compare)"
                            stroke-width="1.5"
                            stroke-linejoin="round"
                        />
                        <path d={area} fill="url(#hero-fill)" class="login-fade" style={{ animationDelay: "1.1s" }} />
                        <path
                            d={line}
                            fill="none"
                            stroke="rgb(var(--accent))"
                            stroke-width="2.5"
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            pathLength={1}
                            class="login-draw"
                            style={{ animationDelay: "400ms" }}
                        />
                        <g class="login-fade" style={{ animationDelay: "1.6s" }}>
                            <circle
                                cx={W}
                                cy={lastY}
                                r="10"
                                fill="rgb(var(--accent))"
                                opacity="0.2"
                                class="login-ping"
                            />
                            <circle
                                cx={W}
                                cy={lastY}
                                r="4.5"
                                fill="rgb(var(--accent))"
                                stroke="rgb(var(--surface))"
                                stroke-width="2"
                            />
                        </g>
                    </svg>
                </div>
            </div>

            {/* Floating: live visitors */}
            <div
                class="login-float absolute -top-10 -right-3 sm:-right-12 w-52 hidden sm:block"
                style={{ animationDelay: "0s, 600ms" }}
            >
                <div class="rounded-xl border border-line bg-surface/95 backdrop-blur shadow-pop p-3.5">
                    <div class="flex items-center gap-2 text-[11px] text-fg-2">
                        <span class="live-dot" />
                        Right now
                    </div>
                    <div class="mt-1 text-2xl font-semibold tracking-tight text-fg tabular">
                        19 <span class="text-xs font-normal text-fg-3">visitors</span>
                    </div>
                    <ul class="mt-2.5 space-y-1.5">
                        {PAGES.map((p) => (
                            <li key={p.path} class="flex items-center justify-between text-[11px]">
                                <span class="truncate text-fg-2 font-mono">{p.path}</span>
                                <span class="tabular text-fg font-medium">{p.n}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Floating: countries */}
            <div
                class="login-float absolute -bottom-14 -left-4 sm:-left-12 w-56 hidden sm:block"
                style={{ animationDelay: "1.5s, 800ms" }}
            >
                <div class="rounded-xl border border-line bg-surface/95 backdrop-blur shadow-pop p-3.5">
                    <div class="text-[11px] font-medium text-fg-2">Top countries</div>
                    <ul class="mt-2 space-y-1.5">
                        {COUNTRIES.map((c, i) => (
                            <li key={c.code} class="relative h-6 flex items-center px-1.5 text-[11px] text-fg">
                                <span
                                    class="login-grow absolute inset-y-0 left-0 rounded bg-accent/15"
                                    style={{ width: `${c.share * 100}%`, animationDelay: `${900 + i * 120}ms` }}
                                />
                                <span class="relative">{flagEmoji(c.code)}</span>
                                <span class="relative ml-1.5">{c.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Toast: a visit arriving */}
            <div
                class="login-toast absolute -bottom-6 right-2 sm:right-6 hidden sm:flex items-center gap-2.5 rounded-full border border-line bg-surface/95 backdrop-blur shadow-pop pl-2 pr-3.5 h-9 text-xs"
                style={{ animationDelay: "2.2s" }}
            >
                <span class="w-5 h-5 rounded-full bg-good/15 text-good grid place-items-center">
                    <Icon name="plus" class="w-3 h-3" />
                </span>
                <span class="text-fg-2">
                    New visit · {flagEmoji("SE")} <span class="font-mono text-fg">/blog/hello-world</span>
                </span>
            </div>
        </div>
    );
}
