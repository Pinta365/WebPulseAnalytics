const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const whole = new Intl.NumberFormat("en-US");

/** 1,284 / 12.9K / 4.2M */
export function formatNumber(n: number): string {
    if (!Number.isFinite(n)) return "–";
    return Math.abs(n) < 10_000 ? whole.format(Math.round(n)) : compact.format(n);
}

/** Full number with thousands separators, for tooltips and tables. */
export function formatExact(n: number): string {
    return Number.isFinite(n) ? whole.format(Math.round(n * 100) / 100) : "–";
}

export function formatPercent(ratio: number, digits = 0): string {
    if (!Number.isFinite(ratio)) return "–";
    return `${(ratio * 100).toFixed(digits)}%`;
}

/** 42s / 3m 05s / 1h 12m */
export function formatDuration(ms: number): string {
    if (!Number.isFinite(ms) || ms <= 0) return "0s";
    const s = Math.round(ms / 1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ${String(s % 60).padStart(2, "0")}s`;
    return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
}

/** Relative change, or null when there is no baseline to compare against. */
export function change(current: number, previous: number): number | null {
    if (!Number.isFinite(current) || !Number.isFinite(previous) || previous === 0) return null;
    return (current - previous) / previous;
}

export function safeDiv(a: number, b: number): number {
    return b > 0 ? a / b : 0;
}

/** Regional indicator emoji for an ISO 3166 alpha-2 code. */
export function flagEmoji(code: string | null | undefined): string {
    if (!code || !/^[A-Za-z]{2}$/.test(code)) return "🌐";
    return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

/** Splits a URL into host and path for compact display. Falls back to the raw string. */
export function splitUrl(url: string): { host: string; path: string } {
    try {
        const u = new URL(url);
        return { host: u.host, path: `${u.pathname}${u.search}` || "/" };
    } catch {
        return { host: "", path: url };
    }
}

export type MetricFormat = "number" | "decimal" | "percent" | "duration";

/** Formats a metric value for display; null means "no data". */
export function formatMetric(value: number | null | undefined, format: MetricFormat, exact = false): string {
    if (value === null || value === undefined || !Number.isFinite(value)) return "–";
    switch (format) {
        case "number":
            return exact ? formatExact(value) : formatNumber(value);
        case "decimal":
            return value.toFixed(2);
        case "percent":
            return formatPercent(value, exact ? 1 : 0);
        case "duration":
            return formatDuration(value);
    }
}
