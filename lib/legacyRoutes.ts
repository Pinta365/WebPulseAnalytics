/**
 * The dashboard used to have separate Real-Time and Trends pages. Their URLs
 * now redirect to the unified analytics page so old bookmarks keep working.
 */
import type { RangeKey } from "lib/ranges.ts";

const PERIODS: Record<string, RangeKey> = { "30min": "30m", today: "today", yesterday: "yesterday" };
const SPANS: Record<string, RangeKey> = { "this-year": "ytd", "last-year": "last-year", "3-months": "90d" };
const METRICS: Record<string, string> = { "page-loads": "pageLoads", sessions: "sessions", visitors: "visitors" };

function redirect(req: Request, project: string, range: RangeKey, metric?: string) {
    const url = new URL(`/dashboard/analytics/${encodeURIComponent(project)}`, req.url);
    url.searchParams.set("range", range);
    if (metric) url.searchParams.set("metric", metric);
    return new Response(null, { status: 301, headers: { location: `${url.pathname}${url.search}` } });
}

export function redirectRealtime(req: Request, params: Record<string, string>) {
    return redirect(req, params.project, PERIODS[params.period] ?? "30m");
}

export function redirectTrends(req: Request, params: Record<string, string>) {
    const span = new URL(req.url).searchParams.get("span") ?? "this-year";
    return redirect(req, params.project, SPANS[span] ?? "ytd", params.metric ? METRICS[params.metric] : undefined);
}
