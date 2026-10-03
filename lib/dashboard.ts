/**
 * Server-side view models for the dashboard pages. Everything here only reads.
 */
import { ObjectId } from "mongodb";
import {
    type BotCategory,
    type BotMode,
    getActiveVisitors,
    getBotCounts,
    getBrowsers,
    getCountries,
    getOperatingSystems,
    getProjects,
    getProjectSummaries,
    getReferrers,
    getSeries,
    getSessionCounts,
    getSessionsPerLandingPage,
    getSummary,
    getTopPages,
    type Project,
    type SeriesPoint,
    type SeriesRow,
    type Summary,
} from "lib/db.ts";
import { isMetricKey, type MetricDef, type MetricKey, METRICS, type MetricValues, metricValues } from "lib/metrics.ts";
import { bucketKey, bucketStarts, type BucketUnit, type DateRange, formatBucket, TIME_ZONE } from "lib/ranges.ts";

/** "Active now" = any event within this window. */
export const ACTIVE_WINDOW_MS = 5 * 60 * 1000;

export interface ChartPoint {
    t: number;
    /** Tooltip label, formatted on the server so it uses the server's time zone */
    label: string;
    /** Short x-axis label */
    tick: string;
    /** null for buckets in the future */
    cur: MetricValues | null;
    prev: MetricValues | null;
}

export interface ChartData {
    unit: BucketUnit;
    points: ChartPoint[];
    /** Short description of the comparison line, e.g. "Previous 7 days" */
    compareLabel: string;
}

const ZERO: SeriesPoint = { visitors: 0, sessions: 0, pageLoads: 0, bounces: 0, duration: 0 };

function seriesMap(rows: SeriesRow[]): Map<string, SeriesPoint> {
    return new Map(rows.map((r) => [r.bucket, r]));
}

/** Lines current and previous period up bucket-by-bucket and fills gaps with zeros. */
export function buildChart(range: DateRange, cur: SeriesRow[], prev: SeriesRow[], now = Date.now()): ChartData {
    const curMap = seriesMap(cur);
    const prevMap = seriesMap(prev);
    const curBuckets = bucketStarts(range.from, range.to, range.unit, range.binSize);
    const prevBuckets = bucketStarts(range.prevFrom, range.prevTo, range.unit, range.binSize);
    const points = curBuckets.map((t, i): ChartPoint => {
        const p = prevBuckets[i];
        return {
            t,
            label: formatBucket(t, range.unit, "full"),
            tick: formatBucket(t, range.unit, "axis"),
            cur: t <= now ? metricValues(curMap.get(bucketKey(t)) ?? ZERO) : null,
            prev: p !== undefined ? metricValues(prevMap.get(bucketKey(p)) ?? ZERO) : null,
        };
    });
    return { unit: range.unit, points, compareLabel: compareLabel(range) };
}

function compareLabel(range: DateRange): string {
    switch (range.key) {
        case "30m":
            return "Previous 30 minutes";
        case "today":
            return "Yesterday";
        case "yesterday":
            return "Day before";
        case "7d":
            return "Previous 7 days";
        case "30d":
            return "Previous 30 days";
        case "90d":
            return "Previous 90 days";
        case "ytd":
            return "Same period last year";
        case "12m":
            return "Previous 12 months";
        case "last-year":
            return "Year before";
    }
}

export interface BreakdownRow {
    label: string;
    value: number;
    /** Optional secondary text (page title, full URL) */
    detail?: string;
    href?: string;
    /** Country code for a flag, etc. */
    code?: string;
    /** Short label shown beside the row, e.g. a bot category */
    tag?: string;
}

const BOT_CATEGORY_LABELS: Record<BotCategory, string> = {
    search: "Search engine",
    ai: "AI crawler",
    social: "Social preview",
    seo: "SEO tool",
    monitoring: "Monitoring",
    automation: "Automation",
    unknown: "Unknown",
};

export interface ProjectRow {
    id: string;
    name: string;
    description?: string;
    active: number;
    current: Summary;
    previous: Summary;
    spark: number[];
}

export interface BotInfo {
    /** Whether bot sessions are included in the numbers on the page */
    included: boolean;
    /** Bot sessions in the selected range */
    sessions: number;
}

export interface AnalyticsModel {
    project: { id: string; name: string; description?: string } | null;
    projects: { id: string; name: string }[];
    range: DateRange;
    active: number;
    summary: Summary;
    previous: Summary;
    chart: ChartData;
    breakdowns: {
        sources: BreakdownRow[];
        pages: BreakdownRow[];
        landing: BreakdownRow[];
        countries: BreakdownRow[];
        browsers: BreakdownRow[];
        os: BreakdownRow[];
        devices: BreakdownRow[];
        bots: BreakdownRow[];
    };
    bots: BotInfo;
    /** Only for the "all projects" view */
    perProject: ProjectRow[];
}

const LIMIT = 100;

function rows(data: { _id?: unknown; key?: unknown; count: number }[], fallback = "(unknown)"): BreakdownRow[] {
    return data.slice(0, LIMIT).map((r) => {
        const raw = r.key ?? r._id;
        const label = typeof raw === "string" && raw.trim() !== "" ? raw : fallback;
        return { label, value: r.count };
    });
}

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export function toObjectIds(projects: Project[]): ObjectId[] {
    return projects.map((p) => p._id).filter((id): id is ObjectId => !!id);
}

/** Loads one user's projects and resolves the URL's project param ("all" or an id). */
export async function loadProjectScope(userId: string, projectParam: string) {
    const projects = (await getProjects(userId)).filter((p) => p._id).sort((a, b) => a.name.localeCompare(b.name));
    const project = projectParam === "all"
        ? null
        : projects.find((p) => p._id!.toString() === projectParam) ?? undefined;
    return { projects, project };
}

export async function loadAnalytics(
    projects: Project[],
    project: Project | null,
    range: DateRange,
    includeBots = false,
): Promise<AnalyticsModel> {
    const bots: BotMode = includeBots ? "include" : "exclude";
    const ids = project ? [project._id!] : toObjectIds(projects);
    const now = Date.now();
    const { from, to, prevFrom, prevTo, prevToElapsed, unit, binSize } = range;

    const [
        summary,
        previous,
        curSeries,
        prevSeries,
        active,
        sources,
        pages,
        landing,
        countries,
        browsers,
        os,
        devices,
        perProjectCur,
        perProjectPrev,
        botCounts,
    ] = await Promise.all([
        getSummary(ids, from, to, bots),
        getSummary(ids, prevFrom, prevToElapsed, bots),
        getSeries(ids, from, to, unit, binSize, TIME_ZONE, false, bots),
        getSeries(ids, prevFrom, prevTo, unit, binSize, TIME_ZONE, false, bots),
        getActiveVisitors(ids, now - ACTIVE_WINDOW_MS, bots),
        getReferrers(ids, from, to, bots),
        getTopPages(ids, from, to, LIMIT, bots),
        getSessionsPerLandingPage(ids, from, to, bots),
        getCountries(ids, from, to, bots),
        getBrowsers(ids, from, to, bots),
        getOperatingSystems(ids, from, to, bots),
        getSessionCounts(ids, from, to, "userAgent.device.type", "desktop", bots),
        project ? Promise.resolve([]) : getProjectSummaries(ids, from, to, bots),
        project ? Promise.resolve([]) : getProjectSummaries(ids, prevFrom, prevToElapsed, bots),
        getBotCounts(ids, from, to),
    ]);

    const pageRow = (url: string, title: string, value: number): BreakdownRow => {
        let label = url;
        try {
            const u = new URL(url);
            // Show the host only when several sites are mixed together.
            label = project ? `${u.pathname}${u.search}` : `${u.host}${u.pathname === "/" ? "" : u.pathname}`;
        } catch { /* keep raw */ }
        return { label: label || "/", detail: title || url, href: url, value };
    };

    const empty: Summary = { visitors: 0, sessions: 0, pageLoads: 0, clicks: 0, scrolls: 0, bounces: 0, duration: 0 };
    const prevById = new Map(perProjectPrev.map((p) => [p.projectId, p]));
    const curById = new Map(perProjectCur.map((p) => [p.projectId, p]));

    return {
        project: project ? { id: project._id!.toString(), name: project.name, description: project.description } : null,
        projects: projects.map((p) => ({ id: p._id!.toString(), name: p.name })),
        range,
        active: Object.values(active).reduce((a, b) => a + b, 0),
        summary,
        previous,
        chart: buildChart(range, curSeries, prevSeries, now),
        breakdowns: {
            sources: (sources as { _id: string; count: number }[]).slice(0, LIMIT).map((r) => ({
                label: r._id || "(direct)",
                value: r.count,
                href: r._id && r._id !== "(direct)" ? `https://${r._id}` : undefined,
            })),
            pages: pages.map((p) => pageRow(p.url, p.title, p.count)),
            landing: (landing as { _id: { url?: string; title?: string }; count: number }[])
                .filter((r) => r._id?.url)
                .slice(0, LIMIT)
                .map((r) => pageRow(r._id.url!, r._id.title ?? "", r.count)),
            countries: (countries as { _id: string; countryShort: string | null; count: number }[])
                .slice(0, LIMIT)
                .map((r) => ({ label: r._id, value: r.count, code: r.countryShort ?? undefined })),
            browsers: rows(browsers),
            os: rows(os),
            devices: rows(devices).map((r) => ({ ...r, label: capitalize(r.label) })),
            bots: botCounts.slice(0, LIMIT).map((r) => ({
                label: r.key,
                value: r.count,
                tag: r.category ? BOT_CATEGORY_LABELS[r.category] : undefined,
            })),
        },
        bots: { included: includeBots, sessions: botCounts.reduce((a, r) => a + r.count, 0) },
        perProject: project ? [] : projects.map((p) => {
            const id = p._id!.toString();
            return {
                id,
                name: p.name,
                description: p.description,
                active: active[id] ?? 0,
                current: curById.get(id) ?? empty,
                previous: prevById.get(id) ?? empty,
                spark: [],
            };
        }),
    };
}

export interface OverviewModel {
    range: DateRange;
    active: number;
    summary: Summary;
    previous: Summary;
    chart: ChartData;
    projects: ProjectRow[];
    topPages: BreakdownRow[];
    topSources: BreakdownRow[];
    bots: BotInfo;
}

/** The landing dashboard: all projects, with a small daily trend per project. */
export async function loadOverview(
    projects: Project[],
    range: DateRange,
    includeBots = false,
): Promise<OverviewModel> {
    const bots: BotMode = includeBots ? "include" : "exclude";
    const ids = toObjectIds(projects);
    const now = Date.now();
    const { from, to, prevFrom, prevTo, prevToElapsed, unit, binSize } = range;
    const [summary, previous, curSeries, prevSeries, perProjectSeries, active, cur, prev, pages, sources, botSummary] =
        await Promise
            .all([
                getSummary(ids, from, to, bots),
                getSummary(ids, prevFrom, prevToElapsed, bots),
                getSeries(ids, from, to, unit, binSize, TIME_ZONE, false, bots),
                getSeries(ids, prevFrom, prevTo, unit, binSize, TIME_ZONE, false, bots),
                getSeries(ids, from, to, unit, binSize, TIME_ZONE, true, bots),
                getActiveVisitors(ids, now - ACTIVE_WINDOW_MS, bots),
                getProjectSummaries(ids, from, to, bots),
                getProjectSummaries(ids, prevFrom, prevToElapsed, bots),
                getTopPages(ids, from, to, 8, bots),
                getReferrers(ids, from, to, bots),
                getSummary(ids, from, to, "only"),
            ]);

    const buckets = bucketStarts(from, Math.min(to, now + 1), unit, binSize).map(bucketKey);
    const empty: Summary = { visitors: 0, sessions: 0, pageLoads: 0, clicks: 0, scrolls: 0, bounces: 0, duration: 0 };
    const curById = new Map(cur.map((p) => [p.projectId, p]));
    const prevById = new Map(prev.map((p) => [p.projectId, p]));

    const projectRows: ProjectRow[] = projects.map((p) => {
        const id = p._id!.toString();
        const byBucket = new Map(perProjectSeries.filter((r) => r.projectId === id).map((r) => [r.bucket, r.visitors]));
        return {
            id,
            name: p.name,
            description: p.description,
            active: active[id] ?? 0,
            current: curById.get(id) ?? empty,
            previous: prevById.get(id) ?? empty,
            spark: buckets.map((b) => byBucket.get(b) ?? 0),
        };
    }).sort((a, b) => b.current.visitors - a.current.visitors || a.name.localeCompare(b.name));

    return {
        range,
        active: Object.values(active).reduce((a, b) => a + b, 0),
        summary,
        previous,
        chart: buildChart(range, curSeries, prevSeries, now),
        projects: projectRows,
        topPages: pages.map((p) => {
            let label = p.url;
            try {
                const u = new URL(p.url);
                label = `${u.host}${u.pathname === "/" ? "" : u.pathname}`;
            } catch { /* keep raw */ }
            return { label, detail: p.title || p.url, href: p.url, value: p.count };
        }),
        topSources: (sources as { _id: string; count: number }[]).slice(0, 8).map((r) => ({
            label: r._id || "(direct)",
            value: r.count,
        })),
        bots: { included: includeBots, sessions: botSummary.sessions },
    };
}

export { isMetricKey, METRICS, metricValues };
export type { MetricDef, MetricKey, MetricValues };
