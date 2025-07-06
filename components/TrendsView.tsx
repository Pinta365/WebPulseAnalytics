// deno-lint-ignore-file no-explicit-any
import { Project } from "lib/db.ts";
import Sparkline from "islands/Sparkline.tsx";
import DataTable from "islands/DataTable.tsx";
import { classNames, getPeriodEnd } from "lib/helper.ts";

interface TrendsProps {
    projects: Project[];
    project: Project | null;
    period: any;
    trendsData: any[];
    span: string;
    agg: string;
    referrerData?: any[];
    countryData?: any[];
    browserData?: any[];
    osData?: any[];
}

function printProjectMenuEntry(
    currentProject?: Project,
    project?: Project,
    agg?: string,
    span?: string,
) {
    const isActive = (currentProject === project) || (!currentProject && !project);
    const projectClass = classNames(
        "dropdown-item",
        isActive && "dropdown-item-active",
    );
    return (
        <li>
            <a
                href={`/dashboard/trends/${project ? project._id : "all"}/${agg ?? "week"}?span=${span ?? "this-year"}`}
                class={projectClass}
            >
                {project ? project.name : "Total"}
            </a>
        </li>
    );
}

export function TrendsView(
    { projects, project, trendsData, span, agg, referrerData, countryData, browserData, osData }: TrendsProps,
) {
    // Helper to build URL
    function buildUrl(newSpan: string, newAgg: string, newProjectId?: string) {
        const projectId = newProjectId ?? (project ? project._id : "all");
        return `/dashboard/trends/${projectId}/${newAgg}?span=${newSpan}`;
    }
    const aggOptions = [
        { value: "day", label: "Per Day" },
        { value: "week", label: "Per Week" },
        { value: "month", label: "Per Month" },
        { value: "quarter", label: "Per Quarter" },
    ];
    const spanOptions = [
        { value: "this-year", label: "This Year (YTD)" },
        { value: "last-year", label: "Last Year" },
        { value: "3-months", label: "Last 3 Months" },
    ];
    return (
        <section class="space-y-8">
            <div class="flex flex-col sm:flex-row gap-4">
                <div>
                    <details class="relative">
                        <summary class="summary-base">
                            {project ? project.name : "All Projects"}
                        </summary>
                        <ul class="dropdown-menu">
                            {printProjectMenuEntry(project || undefined, undefined, agg, span)}
                            {projects?.length > 0
                                ? projects.map((projectEntry) =>
                                    printProjectMenuEntry(project || undefined, projectEntry, agg, span)
                                )
                                : <li class="px-4 py-2 text-muted">No projects</li>}
                        </ul>
                    </details>
                </div>
                <div>
                    <details class="relative">
                        <summary class="summary-base">
                            Time Span: {spanOptions.find((o) => o.value === span)?.label || span}
                        </summary>
                        <ul class="dropdown-menu">
                            {spanOptions.map((option) => (
                                <li key={option.value}>
                                    <a
                                        href={buildUrl(option.value, agg)}
                                        class={classNames(
                                            "dropdown-item",
                                            span === option.value && "dropdown-item-active",
                                        )}
                                    >
                                        {option.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </details>
                </div>
                <div>
                    <details class="relative">
                        <summary class="summary-base">
                            Aggregation: {aggOptions.find((o) => o.value === agg)?.label || agg}
                        </summary>
                        <ul class="dropdown-menu">
                            {aggOptions.map((option) => (
                                <li key={option.value}>
                                    <a
                                        href={buildUrl(span, option.value)}
                                        class={classNames(
                                            "dropdown-item",
                                            agg === option.value && "dropdown-item-active",
                                        )}
                                    >
                                        {option.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </details>
                </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-8">
                {trendsData && trendsData.length > 0 && (
                    <>
                        {[
                            {
                                label: "Page Loads",
                                color: "#2563eb",
                                data: trendsData.map((row: any) => row.pageLoads),
                            },
                            { label: "Sessions", color: "#10b981", data: trendsData.map((row: any) => row.sessions) },
                            { label: "Visitors", color: "#6366f1", data: trendsData.map((row: any) => row.visitors) },
                            { label: "Clicks", color: "#f59e42", data: trendsData.map((row: any) => row.clicks) },
                            { label: "Scrolls", color: "#14b8a6", data: trendsData.map((row: any) => row.scrolls) },
                        ].map((metric) => {
                            const avg = metric.data.length > 0
                                ? Math.round(metric.data.reduce((a, b) => a + b, 0) / metric.data.length)
                                : 0;
                            const metricSlug = metric.label.toLowerCase().replace(" ", "-");
                            const drilldownUrl = `/dashboard/trends/${
                                project ? project._id : "all"
                            }/${agg}/${metricSlug}?span=${span}&color=${encodeURIComponent(metric.color)}`;
                            return (
                                <a
                                    href={drilldownUrl}
                                    class="no-underline transition-transform duration-200 hover:scale-105"
                                >
                                    <div class="card-metric">
                                        <div class="text-4xl font-bold mb-1" style={{ color: metric.color }}>
                                            {metric.data[metric.data.length - 1] ?? 0}
                                        </div>
                                        <div class="text-base text-muted mb-1">
                                            Avg: {avg}
                                        </div>
                                        <div class="text-xs mb-2 text-secondary font-medium">
                                            {metric.label}
                                        </div>
                                        <Sparkline data={metric.data} color={metric.color} height={32} width={120} />
                                        <div class="text-xs mt-2 text-secondary hover:text-primary">
                                            View Details &rarr;
                                        </div>
                                    </div>
                                </a>
                            );
                        })}
                    </>
                )}
            </div>
            <div class="grid grid-cols-1">
                <article class="card">
                    <h3 class="text-xl font-semibold text-primary mb-2">
                        Trends & History for {project ? project.name : "All Projects"}
                    </h3>
                    <div class="text-secondary text-sm mb-4">
                        Aggregated per {aggOptions.find((o) => o.value === agg)?.label?.replace("Per ", "") ||
                            agg.charAt(0).toUpperCase() + agg.slice(1)}
                    </div>
                    {trendsData && trendsData.length > 0
                        ? (
                            <DataTable
                                topN={365}
                                columns={[
                                    { key: "dateRange", label: "Date Range" },
                                    { key: "pageLoads", label: "Page Loads" },
                                    { key: "sessions", label: "Sessions" },
                                    { key: "visitors", label: "Visitors" },
                                    { key: "clicks", label: "Clicks" },
                                    { key: "scrolls", label: "Scrolls" },
                                ]}
                                data={trendsData.map((row: any) => ({
                                    dateRange: `${new Date(row.date).toLocaleDateString()} - ${
                                        getPeriodEnd(row.date, agg as "day" | "week" | "month" | "quarter")
                                    }`,
                                    pageLoads: row.pageLoads,
                                    sessions: row.sessions,
                                    visitors: row.visitors,
                                    clicks: row.clicks,
                                    scrolls: row.scrolls,
                                }))}
                            />
                        )
                        : <p class="text-secondary">No data for selected period.</p>}
                </article>
            </div>
            <section class="mt-10">
                <h3 class="text-xl font-semibold text-primary mb-6">User & Technology Breakdown</h3>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <article class="card">
                        {referrerData && (
                            <DataTable
                                columns={[
                                    { key: "_id", label: "Referrer" },
                                    { key: "count", label: "Count" },
                                ]}
                                data={referrerData}
                                defaultSortCol="count"
                                defaultSortDir="desc"
                            />
                        )}
                    </article>
                    <article class="card">
                        {countryData && (
                            <DataTable
                                columns={[
                                    { key: "_id", label: "Country" },
                                    { key: "count", label: "Count" },
                                ]}
                                data={countryData}
                                defaultSortCol="count"
                                defaultSortDir="desc"
                            />
                        )}
                    </article>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    <article class="card">
                        {browserData && (
                            <DataTable
                                columns={[
                                    { key: "_id", label: "Browser" },
                                    { key: "count", label: "Count" },
                                ]}
                                data={browserData}
                                defaultSortCol="count"
                                defaultSortDir="desc"
                            />
                        )}
                    </article>
                    <article class="card">
                        {osData && (
                            <DataTable
                                columns={[
                                    { key: "_id", label: "Operating System" },
                                    { key: "count", label: "Count" },
                                ]}
                                data={osData}
                                defaultSortCol="count"
                                defaultSortDir="desc"
                            />
                        )}
                    </article>
                </div>
            </section>
        </section>
    );
}
