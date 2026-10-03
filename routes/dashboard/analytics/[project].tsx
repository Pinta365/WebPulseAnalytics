import type { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import type { SessionUser } from "lib/commonTypes.ts";
import {
    type AnalyticsModel,
    isMetricKey,
    loadAnalytics,
    loadProjectScope,
    type MetricKey,
    metricValues,
} from "lib/dashboard.ts";
import { resolveRange } from "lib/ranges.ts";
import { change, formatDuration, formatNumber, formatPercent, safeDiv } from "lib/format.ts";
import { PageHeader } from "components/layout/AppShell.tsx";
import { BotToggle, LiveBadge, ProjectSwitcher, RangePicker } from "components/dashboard/Toolbar.tsx";
import MetricExplorer from "islands/MetricExplorer.tsx";
import BarList from "islands/BarList.tsx";

interface Data {
    model: AnalyticsModel;
    metric: MetricKey;
}

export const handler: Handlers<Data, SessionUser> = {
    async GET(req, ctx) {
        const url = new URL(req.url);
        const { projects, project } = await loadProjectScope(ctx.state._id, ctx.params.project);
        if (project === undefined) return ctx.renderNotFound();
        const range = resolveRange(url.searchParams.get("range"));
        const metricParam = url.searchParams.get("metric");
        const metric: MetricKey = isMetricKey(metricParam) ? metricParam : "visitors";
        const model = await loadAnalytics(projects, project, range, url.searchParams.get("bots") === "1");
        return ctx.render({ model, metric });
    },
};

function DeltaText({ cur, prev, lowerIsBetter }: { cur: number; prev: number; lowerIsBetter?: boolean }) {
    const d = change(cur, prev);
    if (d === null) return <span class="text-fg-3">–</span>;
    if (Math.abs(d) < 0.005) return <span class="text-fg-3">±0%</span>;
    const good = (d >= 0) !== !!lowerIsBetter;
    return <span class={good ? "text-good" : "text-bad"}>{d >= 0 ? "+" : "−"}{formatPercent(Math.abs(d))}</span>;
}

export default function AnalyticsPage({ data, url }: PageProps<Data>) {
    const { model, metric } = data;
    const { range, project, breakdowns: b } = model;
    const projectId = project?.id ?? "all";

    /** Current query string with some params set (or removed when null). */
    const qs = (params: Record<string, string | null>) => {
        const sp = new URLSearchParams(url.search);
        Object.entries(params).forEach(([k, v]) => v === null ? sp.delete(k) : sp.set(k, v));
        const str = sp.toString();
        return str ? `?${str}` : "";
    };
    const hrefForProject = (id: string) => `/dashboard/analytics/${id}${qs({ range: range.key })}`;
    const hrefForRange = (key: string) => `/dashboard/analytics/${projectId}${qs({ range: key })}`;

    const title = project ? project.name : "All projects";
    const empty = model.summary.sessions === 0 && model.previous.sessions === 0;

    return (
        <>
            <Head>
                <title>{title} · WebPulse Analytics</title>
            </Head>

            <PageHeader
                title={title}
                subtitle={project?.description ||
                    (project ? undefined : `Combined traffic across ${model.projects.length} projects`)}
            >
                <LiveBadge count={model.active} href={range.key === "30m" ? undefined : hrefForRange("30m")} />
                <ProjectSwitcher projects={model.projects} currentId={project?.id ?? null} hrefFor={hrefForProject} />
                <RangePicker range={range} hrefFor={hrefForRange} />
                <BotToggle
                    bots={model.bots}
                    href={`/dashboard/analytics/${projectId}${qs({ bots: model.bots.included ? null : "1" })}`}
                />
            </PageHeader>

            <div class="space-y-6">
                <MetricExplorer
                    current={metricValues(model.summary)}
                    previous={metricValues(model.previous)}
                    chart={model.chart}
                    initialMetric={metric}
                    rangeLabel={range.label}
                />

                {empty && (
                    <div class="card px-5 py-4 text-[13px] text-fg-2">
                        No visits recorded in this period. Check that the tracking snippet is installed on{" "}
                        <a href="/dashboard/projects" class="link">the project's site</a>, or pick a longer range.
                    </div>
                )}

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BarList
                        tabs={[
                            { key: "pages", label: "Top pages", valueLabel: "Views", rows: b.pages, kind: "page" },
                            {
                                key: "landing",
                                label: "Entry pages",
                                valueLabel: "Sessions",
                                rows: b.landing,
                                kind: "page",
                            },
                        ]}
                    />
                    <BarList
                        tabs={[{
                            key: "sources",
                            label: "Sources",
                            valueLabel: "Visits",
                            rows: b.sources,
                            kind: "source",
                        }]}
                    />
                    <BarList
                        tabs={[{
                            key: "countries",
                            label: "Countries",
                            valueLabel: "Sessions",
                            rows: b.countries,
                            kind: "country",
                        }]}
                    />
                    <BarList
                        tabs={[
                            { key: "browsers", label: "Browsers", valueLabel: "Sessions", rows: b.browsers },
                            {
                                key: "os",
                                label: "Operating systems",
                                shortLabel: "OS",
                                valueLabel: "Sessions",
                                rows: b.os,
                            },
                            { key: "devices", label: "Devices", valueLabel: "Sessions", rows: b.devices },
                            { key: "bots", label: "Bots", valueLabel: "Sessions", rows: b.bots },
                        ]}
                    />
                </div>

                {model.perProject.length > 0 && (
                    <section class="card overflow-hidden">
                        <div class="card-header">
                            <h2 class="card-title">By project</h2>
                            <span class="text-xs text-fg-3">
                                {range.label} · change vs {model.chart.compareLabel.toLowerCase()}
                            </span>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Project</th>
                                        <th class="num">Now</th>
                                        <th class="num">Visitors</th>
                                        <th class="num">Change</th>
                                        <th class="num">Sessions</th>
                                        <th class="num">Page views</th>
                                        <th class="num">Bounce rate</th>
                                        <th class="num">Visit duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {model.perProject
                                        .slice()
                                        .sort((a, b) =>
                                            b.current.visitors - a.current.visitors || a.name.localeCompare(b.name)
                                        )
                                        .map((p) => (
                                            <tr>
                                                <td>
                                                    <a
                                                        href={hrefForProject(p.id)}
                                                        class="font-medium text-fg hover:underline underline-offset-2"
                                                    >
                                                        {p.name}
                                                    </a>
                                                </td>
                                                <td class="num">
                                                    {p.active > 0
                                                        ? (
                                                            <span class="inline-flex items-center gap-1.5">
                                                                <span class="live-dot" />
                                                                {p.active}
                                                            </span>
                                                        )
                                                        : <span class="text-fg-3">0</span>}
                                                </td>
                                                <td class="num text-fg font-medium">
                                                    {formatNumber(p.current.visitors)}
                                                </td>
                                                <td class="num">
                                                    <DeltaText cur={p.current.visitors} prev={p.previous.visitors} />
                                                </td>
                                                <td class="num">{formatNumber(p.current.sessions)}</td>
                                                <td class="num">{formatNumber(p.current.pageLoads)}</td>
                                                <td class="num">
                                                    {p.current.sessions
                                                        ? formatPercent(safeDiv(p.current.bounces, p.current.sessions))
                                                        : "–"}
                                                </td>
                                                <td class="num">
                                                    {p.current.sessions
                                                        ? formatDuration(
                                                            safeDiv(p.current.duration, p.current.sessions),
                                                        )
                                                        : "–"}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}
