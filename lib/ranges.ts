/**
 * Date ranges, previous-period comparison and time-series bucketing.
 *
 * All calendar math runs in the server's local time zone, and the same zone is
 * handed to MongoDB's $dateTrunc so bucket keys produced here and there agree.
 */

export type BucketUnit = "minute" | "hour" | "day" | "week" | "month";

export type RangeKey = "30m" | "today" | "yesterday" | "7d" | "30d" | "90d" | "ytd" | "12m" | "last-year";

export interface DateRange {
    key: RangeKey;
    label: string;
    /** Inclusive start, ms */
    from: number;
    /** Exclusive end, ms */
    to: number;
    /** The preceding period, drawn as the comparison line */
    prevFrom: number;
    prevTo: number;
    /**
     * End of the comparison window for totals and deltas. For a range still in
     * progress it covers only the same elapsed time, so "today until 14:00" is
     * compared with "yesterday until 14:00", not with all of yesterday.
     */
    prevToElapsed: number;
    unit: BucketUnit;
    /** Bucket size in `unit`s (e.g. 2-minute buckets) */
    binSize: number;
    /** True when the range ends "now" and the last bucket is still filling */
    isLive: boolean;
}

export const RANGE_OPTIONS: { key: RangeKey; label: string; short: string }[] = [
    { key: "30m", label: "Last 30 minutes", short: "30m" },
    { key: "today", label: "Today", short: "Today" },
    { key: "yesterday", label: "Yesterday", short: "Yesterday" },
    { key: "7d", label: "Last 7 days", short: "7d" },
    { key: "30d", label: "Last 30 days", short: "30d" },
    { key: "90d", label: "Last 90 days", short: "90d" },
    { key: "ytd", label: "Year to date", short: "YTD" },
    { key: "12m", label: "Last 12 months", short: "12m" },
    { key: "last-year", label: "Last year", short: "Last year" },
];

export const DEFAULT_RANGE: RangeKey = "7d";

export const TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

const MINUTE = 60_000;

function startOfDay(d: Date, offsetDays = 0): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + offsetDays);
}

export function isRangeKey(value: unknown): value is RangeKey {
    return RANGE_OPTIONS.some((o) => o.key === value);
}

export function resolveRange(key: string | null | undefined, now = new Date()): DateRange {
    const range = resolveFullRange(key, now);
    const elapsed = Math.min(now.getTime(), range.to) - range.from;
    return { ...range, prevToElapsed: Math.min(range.prevTo, range.prevFrom + elapsed) };
}

function resolveFullRange(key: string | null | undefined, now: Date): Omit<DateRange, "prevToElapsed"> {
    const rangeKey: RangeKey = isRangeKey(key) ? key : DEFAULT_RANGE;
    const label = RANGE_OPTIONS.find((o) => o.key === rangeKey)!.label;
    const nowMs = now.getTime();
    const base = { key: rangeKey, label };

    switch (rangeKey) {
        case "30m": {
            // Align to whole minutes so the buckets are stable between reloads.
            const to = Math.floor(nowMs / MINUTE) * MINUTE + MINUTE;
            const from = to - 30 * MINUTE;
            return {
                ...base,
                from,
                to,
                prevFrom: from - 30 * MINUTE,
                prevTo: from,
                unit: "minute",
                binSize: 1,
                isLive: true,
            };
        }
        case "today": {
            const from = startOfDay(now).getTime();
            const to = startOfDay(now, 1).getTime();
            return {
                ...base,
                from,
                to,
                prevFrom: startOfDay(now, -1).getTime(),
                prevTo: from,
                unit: "hour",
                binSize: 1,
                isLive: true,
            };
        }
        case "yesterday": {
            const from = startOfDay(now, -1).getTime();
            const to = startOfDay(now).getTime();
            return {
                ...base,
                from,
                to,
                prevFrom: startOfDay(now, -2).getTime(),
                prevTo: from,
                unit: "hour",
                binSize: 1,
                isLive: false,
            };
        }
        case "7d":
        case "30d":
        case "90d": {
            const days = rangeKey === "7d" ? 7 : rangeKey === "30d" ? 30 : 90;
            const from = startOfDay(now, -(days - 1)).getTime();
            const to = startOfDay(now, 1).getTime();
            const prevFrom = startOfDay(now, -(2 * days - 1)).getTime();
            return { ...base, from, to, prevFrom, prevTo: from, unit: "day", binSize: 1, isLive: true };
        }
        case "ytd": {
            const from = new Date(now.getFullYear(), 0, 1).getTime();
            const to = startOfDay(now, 1).getTime();
            // Same calendar span one year earlier.
            const prevFrom = new Date(now.getFullYear() - 1, 0, 1).getTime();
            const prevTo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate() + 1).getTime();
            return { ...base, from, to, prevFrom, prevTo, unit: "week", binSize: 1, isLive: true };
        }
        case "12m": {
            const from = new Date(now.getFullYear(), now.getMonth() - 11, 1).getTime();
            const to = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();
            const prevFrom = new Date(now.getFullYear(), now.getMonth() - 23, 1).getTime();
            return { ...base, from, to, prevFrom, prevTo: from, unit: "month", binSize: 1, isLive: true };
        }
        case "last-year": {
            const from = new Date(now.getFullYear() - 1, 0, 1).getTime();
            const to = new Date(now.getFullYear(), 0, 1).getTime();
            const prevFrom = new Date(now.getFullYear() - 2, 0, 1).getTime();
            return { ...base, from, to, prevFrom, prevTo: from, unit: "month", binSize: 1, isLive: false };
        }
    }
}

/** Start of the bucket containing `d`, mirroring $dateTrunc (weeks start on Monday). */
export function truncate(d: Date, unit: BucketUnit, binSize = 1): Date {
    switch (unit) {
        case "minute": {
            const m = Math.floor(d.getMinutes() / binSize) * binSize;
            return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), m);
        }
        case "hour":
            return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours());
        case "day":
            return startOfDay(d);
        case "week": {
            const sinceMonday = (d.getDay() + 6) % 7;
            return startOfDay(d, -sinceMonday);
        }
        case "month":
            return new Date(d.getFullYear(), d.getMonth(), 1);
    }
}

function step(d: Date, unit: BucketUnit, binSize: number): Date {
    switch (unit) {
        case "minute":
            return new Date(d.getTime() + binSize * MINUTE);
        case "hour":
            return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() + binSize);
        case "day":
            return startOfDay(d, binSize);
        case "week":
            return startOfDay(d, 7 * binSize);
        case "month":
            return new Date(d.getFullYear(), d.getMonth() + binSize, 1);
    }
}

/** Bucket start times covering [from, to). */
export function bucketStarts(from: number, to: number, unit: BucketUnit, binSize = 1): number[] {
    const out: number[] = [];
    let cursor = truncate(new Date(from), unit, binSize);
    // Guard against pathological input; the longest range is ~90 daily or 60 minutely buckets.
    while (cursor.getTime() < to && out.length < 400) {
        out.push(cursor.getTime());
        cursor = step(cursor, unit, binSize);
    }
    return out;
}

/** Key format shared with the MongoDB $dateToString in getSeries(). */
export const BUCKET_KEY_FORMAT = "%Y-%m-%dT%H:%M";

export function bucketKey(ms: number): string {
    const d = new Date(ms);
    const p = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** Human label for a bucket on the x-axis / tooltip. */
export function formatBucket(ms: number, unit: BucketUnit, style: "axis" | "full" = "axis", locale = "en-US"): string {
    const d = new Date(ms);
    switch (unit) {
        case "minute":
        case "hour":
            return style === "axis"
                ? d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: false })
                : d.toLocaleString(locale, { weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false });
        case "day":
            return d.toLocaleDateString(
                locale,
                style === "axis"
                    ? { month: "short", day: "numeric" }
                    : { weekday: "short", month: "short", day: "numeric", year: "numeric" },
            );
        case "week":
            return style === "axis"
                ? d.toLocaleDateString(locale, { month: "short", day: "numeric" })
                : `Week of ${d.toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" })}`;
        case "month":
            return d.toLocaleDateString(
                locale,
                style === "axis" ? { month: "short" } : { month: "long", year: "numeric" },
            );
    }
}
