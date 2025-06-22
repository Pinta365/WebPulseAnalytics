import type { Handlers, PageProps } from "$fresh/server.ts";
import { NavTop } from "components/layout/NavTop.tsx";
import { NavSide } from "islands/NavSide.tsx";
import { Footer } from "components/layout/Footer.tsx";
import { getProjects, getTrendsData } from "lib/db.ts";
import { ObjectId } from "mongodb";
import TrendsChart from "islands/TrendsChart.tsx";

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
        const color = url.searchParams.get("color") || "#6366f1";
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

        return ctx.render({
            state: ctx.state,
            project,
            trendsData,
            span,
            agg,
            metric: metricInfo,
            color,
        });
    },
};

function getPeriodEnd(startDate: string | number | Date, granularity: "day" | "week" | "month" | "quarter") {
    const start = new Date(startDate);
    let end = new Date(start);
    switch (granularity) {
        case "day":
            end.setDate(start.getDate() + 1);
            break;
        case "week":
            end.setDate(start.getDate() + 7);
            break;
        case "month":
            end.setMonth(start.getMonth() + 1);
            break;
        case "quarter":
            end.setMonth(start.getMonth() + 3);
            break;
    }
    return new Date(end.getTime() - 1).toLocaleDateString();
}

export default function TrendsMetricPage({ data }: PageProps) {
    const { state, project, trendsData, span, agg, metric, color } = data;
    const backUrl = `/dashboard/trends/${project ? project._id : "all"}/${agg}?span=${span}`;

    return (
        <body>
            <NavTop {...state} />
            <main class="container">
                <div class="grid">
                    <NavSide />
                    <section>
                        <a
                            href={backUrl}
                            style={{
                                textDecoration: "none",
                                color: "inherit",
                                marginBottom: "1.5rem",
                                display: "inline-block",
                            }}
                        >
                            &larr; Back to Trends Overview
                        </a>
                        <h2>{metric.label} Trend for {project ? project.name : "All Projects"}</h2>
                        <div style={{ marginBottom: "2rem" }}>
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
                        <h3>Data Details</h3>
                        {trendsData && trendsData.length > 0
                            ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Date Range</th>
                                            <th>{metric.label}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {trendsData.map((row: any, idx: number) => (
                                            <tr key={idx}>
                                                <td>
                                                    {new Date(row.date).toLocaleDateString()} -{" "}
                                                    {getPeriodEnd(row.date, agg)}
                                                </td>
                                                <td>{row[metric.key]}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )
                            : <p>No data available.</p>}
                    </section>
                </div>
            </main>
            <Footer />
        </body>
    );
}
