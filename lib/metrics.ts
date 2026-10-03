/**
 * Headline metric definitions. Kept free of server imports so islands can use them.
 */
import type { MetricFormat } from "lib/format.ts";

/** Raw sums a metric is derived from (a total, or one time bucket). */
export interface MetricSums {
    visitors: number;
    sessions: number;
    pageLoads: number;
    bounces: number;
    duration: number;
}

export type MetricKey = "visitors" | "sessions" | "pageLoads" | "viewsPerSession" | "bounceRate" | "avgDuration";

export interface MetricDef {
    key: MetricKey;
    label: string;
    format: MetricFormat;
    /** For bounce rate a decrease is the good direction */
    lowerIsBetter?: boolean;
    description: string;
}

export const METRICS: MetricDef[] = [
    { key: "visitors", label: "Visitors", format: "number", description: "Distinct devices" },
    { key: "sessions", label: "Sessions", format: "number", description: "Visits, a device can have several" },
    { key: "pageLoads", label: "Page views", format: "number", description: "Pages loaded" },
    { key: "viewsPerSession", label: "Views / session", format: "decimal", description: "Page views per session" },
    {
        key: "bounceRate",
        label: "Bounce rate",
        format: "percent",
        lowerIsBetter: true,
        description: "Sessions that viewed a single page",
    },
    { key: "avgDuration", label: "Visit duration", format: "duration", description: "Average session length" },
];

export function isMetricKey(v: unknown): v is MetricKey {
    return METRICS.some((m) => m.key === v);
}

export type MetricValues = Record<MetricKey, number | null>;

/**
 * Derives every headline metric from raw sums, for totals and per bucket alike.
 * Ratios are null when there were no sessions: "no data", not 0%.
 */
export function metricValues(s: MetricSums): MetricValues {
    return {
        visitors: s.visitors,
        sessions: s.sessions,
        pageLoads: s.pageLoads,
        viewsPerSession: s.sessions ? s.pageLoads / s.sessions : null,
        bounceRate: s.sessions ? s.bounces / s.sessions : null,
        avgDuration: s.sessions ? s.duration / s.sessions : null,
    };
}
