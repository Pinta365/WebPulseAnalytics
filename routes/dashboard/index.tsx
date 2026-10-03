import type { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import type { SessionUser } from "lib/commonTypes.ts";
import { loadOverview, loadProjectScope, metricValues, type OverviewModel, type ProjectRow } from "lib/dashboard.ts";
import { resolveRange } from "lib/ranges.ts";
import { change, formatNumber, formatPercent } from "lib/format.ts";
import { PageHeader } from "components/layout/AppShell.tsx";
import { BotToggle, LiveBadge, RangePicker } from "components/dashboard/Toolbar.tsx";
import { Sparkline } from "components/charts/Sparkline.tsx";
import { Icon } from "components/ui/Icon.tsx";
import MetricExplorer from "islands/MetricExplorer.tsx";
import BarList from "islands/BarList.tsx";

interface Data {
    model: OverviewModel | null;
    name: string;
}

export const handler: Handlers<Data, SessionUser> = {
    async GET(req, ctx) {
        const { projects } = await loadProjectScope(ctx.state._id, "all");
        const name = ctx.state.displayName?.split(" ")[0] ?? "";
        if (projects.length === 0) return ctx.render({ model: null, name });
        const url = new URL(req.url);
        const range = resolveRange(url.searchParams.get("range"));
        const includeBots = url.searchParams.get("bots") === "1";
        return ctx.render({ model: await loadOverview(projects, range, includeBots), name });
    },
};

function greeting(): string {
    const h = new Date().getHours();
    return h < 5 ? "Good evening" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function ProjectCard({ p, query, rangeLabel }: { p: ProjectRow; query: string; rangeLabel: string }) {
    const d = change(p.current.visitors, p.previous.visitors);
    const quiet = p.current.sessions === 0;
    return (
        <a
            href={`/dashboard/analytics/${p.id}${query}`}
            class={`card group p-5 flex flex-col gap-4 hover:border-fg-3/40 transition-colors ${
                quiet ? "opacity-70 hover:opacity-100" : ""
            }`}
        >
            <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                    <h3 class="font-semibold text-fg truncate">{p.name}</h3>
                    <p class="text-xs text-fg-3 truncate mt-0.5">{p.description || " "}</p>
                </div>
                {p.active > 0
                    ? (
                        <span class="chip shrink-0" title="Active in the last 5 minutes">
                            <span class="live-dot" />
                            {p.active} now
                        </span>
                    )
                    : (
                        <span class="shrink-0 text-fg-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Icon name="arrowRight" />
                        </span>
                    )}
            </div>
            <div class="flex items-end justify-between gap-4">
                <div>
                    <div class="text-2xl font-semibold tracking-tight">{formatNumber(p.current.visitors)}</div>
                    <div class="text-xs text-fg-2 mt-0.5 flex items-center gap-1.5">
                        visitors
                        {d !== null && Math.abs(d) < 0.005 && <span class="tabular text-fg-3">±0%</span>}
                        {d !== null && Math.abs(d) >= 0.005 && (
                            <span class={`tabular font-medium ${d >= 0 ? "text-good" : "text-bad"}`}>
                                {d >= 0 ? "▲" : "▼"} {formatPercent(Math.abs(d))}
                            </span>
                        )}
                    </div>
                </div>
                <Sparkline data={p.spark} width={112} height={36} label={`${p.name} visitors, ${rangeLabel}`} />
            </div>
            <dl class="grid grid-cols-3 gap-2 pt-3 border-t border-line text-xs">
                <div>
                    <dt class="text-fg-3">Sessions</dt>
                    <dd class="text-fg font-medium tabular mt-0.5">{formatNumber(p.current.sessions)}</dd>
                </div>
                <div>
                    <dt class="text-fg-3">Page views</dt>
                    <dd class="text-fg font-medium tabular mt-0.5">{formatNumber(p.current.pageLoads)}</dd>
                </div>
                <div>
                    <dt class="text-fg-3">Bounce</dt>
                    <dd class="text-fg font-medium tabular mt-0.5">
                        {p.current.sessions ? formatPercent(p.current.bounces / p.current.sessions) : "–"}
                    </dd>
                </div>
            </dl>
        </a>
    );
}

function Onboarding({ name }: { name: string }) {
    const steps = [
        { title: "Create a project", text: "One project per website or app you want to measure." },
        { title: "Add the snippet", text: "Paste one script tag into your site's <head>. It sets no cookies." },
        { title: "Watch visits arrive", text: "Traffic shows up here within seconds of the first page view." },
    ];
    return (
        <>
            <PageHeader title={`Welcome${name ? `, ${name}` : ""}`} subtitle="Let's get your first site tracked." />
            <section class="card p-6 sm:p-8 max-w-3xl">
                <ol class="grid sm:grid-cols-3 gap-6">
                    {steps.map((s, i) => (
                        <li>
                            <span class="w-7 h-7 rounded-full bg-accent/10 text-accent text-xs font-semibold grid place-items-center">
                                {i + 1}
                            </span>
                            <h3 class="mt-3 font-semibold">{s.title}</h3>
                            <p class="mt-1 text-[13px] text-fg-2">{s.text}</p>
                        </li>
                    ))}
                </ol>
                <a href="/dashboard/projects#new" class="btn-primary mt-8">
                    <Icon name="plus" /> Create your first project
                </a>
            </section>
        </>
    );
}

export default function Overview({ data, url }: PageProps<Data>) {
    const { model, name } = data;
    if (!model) return <Onboarding name={name} />;
    const { range } = model;
    // Links keep the bot setting so drilling down shows the same numbers.
    const bots = model.bots.included ? "&bots=1" : "";
    const query = `?range=${range.key}${bots}`;
    const active = model.projects.filter((p) => p.current.sessions > 0 || p.active > 0);
    const quiet = model.projects.length - active.length;

    return (
        <>
            <Head>
                <title>Overview · WebPulse Analytics</title>
            </Head>
            <PageHeader
                title={`${greeting()}${name ? `, ${name}` : ""}`}
                subtitle={`Here's how your ${model.projects.length} sites are doing.`}
            >
                <LiveBadge count={model.active} href={`/dashboard/analytics/all?range=30m${bots}`} />
                <RangePicker range={range} hrefFor={(k) => `${url.pathname}?range=${k}${bots}`} />
                <BotToggle
                    bots={model.bots}
                    href={`${url.pathname}?range=${range.key}${model.bots.included ? "" : "&bots=1"}`}
                />
            </PageHeader>

            <div class="space-y-8">
                <MetricExplorer
                    current={metricValues(model.summary)}
                    previous={metricValues(model.previous)}
                    chart={model.chart}
                    initialMetric="visitors"
                    rangeLabel={range.label}
                />

                <section>
                    <div class="flex items-baseline justify-between mb-3">
                        <h2 class="text-base font-semibold">Sites</h2>
                        <a href="/dashboard/projects" class="text-xs text-fg-2 hover:text-fg">Manage projects</a>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {model.projects.map((p) => (
                            <ProjectCard key={p.id} p={p} query={query} rangeLabel={range.label} />
                        ))}
                    </div>
                    {quiet > 0 && active.length > 0 && (
                        <p class="mt-3 text-xs text-fg-3">
                            {quiet} {quiet === 1 ? "site has" : "sites have"} no visits in this period.
                        </p>
                    )}
                </section>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BarList
                        tabs={[{
                            key: "p",
                            label: "Top pages",
                            valueLabel: "Views",
                            rows: model.topPages,
                            kind: "page",
                        }]}
                    />
                    <BarList
                        tabs={[{
                            key: "s",
                            label: "Top sources",
                            valueLabel: "Visits",
                            rows: model.topSources,
                            kind: "source",
                        }]}
                    />
                </div>
                <p class="text-xs text-fg-3">
                    Need more detail? <a href={`/dashboard/analytics/all${query}`} class="link">Open full analytics</a>
                </p>
            </div>
        </>
    );
}
