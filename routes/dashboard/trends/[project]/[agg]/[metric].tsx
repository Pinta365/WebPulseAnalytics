// deno-lint-ignore-file no-explicit-any
import type { Handlers, PageProps } from "$fresh/server.ts";
import { getPeriodEnd } from "lib/helper.ts";
import {
    getBrowsers,
    getCountries,
    getOperatingSystems,
    getPageMetricCounts,
    getProjects,
    getReferrers,
    getSessionsPerLandingPage,
    getTrendsData,
    getUniqueVisitorsPerLandingPage,
} from "lib/db.ts";
import { ObjectId } from "mongodb";
import TrendsChart from "islands/TrendsChart.tsx";
import DataTable from "islands/DataTable.tsx";

type TrendDataRow = {
    date: Date;
    visitors: number;
    sessions: number;
    pageLoads: number;
    clicks: number;
    scrolls: number;
};

const metricMapping: Record<string, { label: string; key: keyof TrendDataRow }> = {
    "page-loads": { label: "Page Loads", key: "pageLoads" },
    "sessions": { label: "Sessions", key: "sessions" },
    "visitors": { label: "Visitors", key: "visitors" },
    "clicks": { label: "Clicks", key: "clicks" },
    "scrolls": { label: "Scrolls", key: "scrolls" },
};

export const handler: Handlers = {
    async GET(req, ctx) {
        const url = new URL(req.url);
        const span = url.searchParams.get("span") || "this-year";
        const color = url.searchParams.get("color") || "#2563eb";
        const { project: projectId, agg, metric: metricSlug } = ctx.params;
        const metricInfo = metricMapping[metricSlug];

        if (!metricInfo) {
            return ctx.renderNotFound();
        }

        const projects = (await getProjects(ctx.state._id as string)).filter((p) => !!p._id);
        let project = null;
        if (projectId !== "all") {
            project = projects.find((p) => p._id && p._id.toString() === projectId);
            if (!project) {
                return ctx.renderNotFound();
            }
        }

        const now = new Date();
        let startDate: number, endDate: number;
        endDate = now.getTime();

        switch (span) {
            case "this-year":
                startDate = new Date(now.getFullYear(), 0, 1).getTime();
                break;
            case "last-year":
                startDate = new Date(now.getFullYear() - 1, 0, 1).getTime();
                endDate = new Date(now.getFullYear(), 0, 1).getTime();
                break;
            case "3-months":
                startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1).getTime();
                break;
            default:
                startDate = new Date(now.getFullYear(), 0, 1).getTime();
        }

        const projectIds: ObjectId[] = project
            ? [project._id!]
            : (projects.map((p) => p._id).filter((id): id is ObjectId => !!id));
        const trendsData = await getTrendsData(projectIds, startDate, endDate, agg as any);

        // Fetch breakdowns based on metric
        let referrerData = null, countryData = null, browserData = null, osData = null, pagesVisitedData = null;
        if (["page-loads", "sessions", "visitors", "clicks"].includes(metricSlug)) {
            referrerData = await getReferrers(projectIds, startDate, endDate);
        }
        if (["page-loads", "sessions", "visitors", "clicks", "scrolls"].includes(metricSlug)) {
            countryData = await getCountries(projectIds, startDate, endDate);
            browserData = await getBrowsers(projectIds, startDate, endDate);
            osData = await getOperatingSystems(projectIds, startDate, endDate);
        }
        if (["page-loads", "clicks", "scrolls", "sessions", "visitors"].includes(metricSlug)) {
            if (metricSlug === "sessions") {
                pagesVisitedData = await getSessionsPerLandingPage(projectIds, startDate, endDate);
            } else if (metricSlug === "visitors") {
                pagesVisitedData = await getUniqueVisitorsPerLandingPage(projectIds, startDate, endDate);
            } else {
                let metricArg: "clicks" | "scrolls" | "pageLoads" = "pageLoads";
                if (metricSlug === "clicks") metricArg = "clicks";
                else if (metricSlug === "scrolls") metricArg = "scrolls";
                else metricArg = "pageLoads";
                pagesVisitedData = await getPageMetricCounts(projectIds, startDate, endDate, metricArg);
            }
        }

        return ctx.render({
            state: ctx.state,
            project,
            trendsData,
            span,
            agg,
            metric: metricInfo,
            color,
            referrerData,
            countryData,
            browserData,
            osData,
            pagesVisitedData,
            metricSlug,
        });
    },
};

export default function TrendsMetricPage({ data }: PageProps) {
    const {
        project,
        trendsData,
        span,
        agg,
        metric,
        color,
        pagesVisitedData,
        metricSlug,
    } = data;
    const backUrl = `/dashboard/trends/${project ? project._id : "all"}/${agg}?span=${span}`;

    return (
        <section class="py-8 px-6">
            <a
                href={backUrl}
                class="no-underline text-inherit mb-6 inline-block link"
            >
                &larr; Back to Trends Overview
            </a>
            <h2 class="text-3xl font-bold text-primary mb-6">
                {metric.label} Trend for {project ? project.name : "All Projects"}
            </h2>
            <div class="mb-8">
                {trendsData && trendsData.length > 0 && (
                    <TrendsChart
                        labels={trendsData.map((row: any) => new Date(row.date).toLocaleDateString())}
                        datasets={[
                            {
                                label: metric.label,
                                data: trendsData.map((row: any) => row[metric.key]),
                                borderColor: color,
                            },
                        ]}
                    />
                )}
            </div>
            <h3 class="text-2xl font-semibold text-primary mb-4">Data Details</h3>
            {trendsData && trendsData.length > 0
                ? (
                    <DataTable
                        columns={[
                            { key: "dateRange", label: "Date Range" },
                            { key: "metricValue", label: metric.label },
                        ]}
                        data={trendsData.map((row: any) => ({
                            dateRange: `${new Date(row.date).toLocaleDateString()} - ${getPeriodEnd(row.date, agg)}`,
                            metricValue: row[metric.key],
                        }))}
                    />
                )
                : <p class="text-secondary">No data available.</p>}

            {/* Breakdown sections based on metric */}
            <div class="mt-8">
                {(["page-loads", "sessions", "visitors", "clicks", "scrolls"].includes(metric.key) &&
                    pagesVisitedData) && (
                    <div class="mb-6">
                        <h4 class="text-xl font-semibold text-primary mb-4">Top Pages</h4>
                        <DataTable
                            columns={[
                                { key: "title", label: "Title" },
                                {
                                    key: "url",
                                    label: "URL",
                                    render: (value: string) =>
                                        value
                                            ? (
                                                <a
                                                    href={value}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    class="link"
                                                >
                                                    {value}
                                                </a>
                                            )
                                            : <span class="text-muted">(no url)</span>,
                                },
                                {
                                    key: "count",
                                    label: metricSlug === "sessions"
                                        ? "Sessions Started"
                                        : metricSlug === "visitors"
                                        ? "Unique Visitors"
                                        : metric.label,
                                },
                            ]}
                            data={pagesVisitedData
                                ? pagesVisitedData.map((row: any) => ({
                                    title: row._id?.title || "(no title)",
                                    url: row._id?.url || "",
                                    count: row.count,
                                }))
                                : []}
                            defaultSortCol="count"
                            defaultSortDir="desc"
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
