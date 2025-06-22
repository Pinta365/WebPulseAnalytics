import type { Handlers, PageProps } from "$fresh/server.ts";
import { NavTop } from "components/layout/NavTop.tsx";
import { NavSide } from "islands/NavSide.tsx";
import { TrendsView } from "components/TrendsView.tsx";
import { Footer } from "components/layout/Footer.tsx";
import { getProjects, getTrendsData } from "lib/db.ts";
import { RealTimePeriod } from "lib/commonTypes.ts";
import { ObjectId } from "npm:mongodb";

export const handler: Handlers = {
    async GET(req, ctx) {
        const url = new URL(req.url);
        const span = url.searchParams.get("span") || "this-year";
        const agg = ctx.params.agg || "month";
        const projects = (await getProjects(ctx.state._id as string)).filter((p) => !!p._id);
        let project = null;
        if (ctx.params.project !== "all") {
            project = projects.find((p) => p._id && p._id.toString() === ctx.params.project);
            if (!project) {
                return ctx.renderNotFound();
            }
        }

        const now = new Date();
        let startDate: number, endDate: number, granularity: "day" | "week" | "month" | "quarter";
        endDate = now.getTime();
        switch (span) {
            case "this-year":
                granularity = agg as any;
                startDate = new Date(now.getFullYear(), 0, 1).getTime();
                break;
            case "last-year":
                granularity = agg as any;
                startDate = new Date(now.getFullYear() - 1, 0, 1).getTime();
                endDate = new Date(now.getFullYear(), 0, 1).getTime();
                break;
            case "3-months":
                granularity = agg as any;
                startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1).getTime();
                break;
            default:
                granularity = agg as any;
                startDate = new Date(now.getFullYear(), 0, 1).getTime();
        }
        const projectIds: ObjectId[] = project
            ? [project._id!]
            : (projects.map((p) => p._id).filter((id): id is ObjectId => !!id));
        const trendsData = await getTrendsData(projectIds, startDate, endDate, granularity as any);
        return ctx.render({
            state: ctx.state,
            project,
            projects,
            period: { name: agg, from: startDate, to: endDate },
            trendsData,
            span,
            agg,
        });
    },
};

export default function TrendsAggPage({ data }: PageProps) {
    const { state, projects, project, period, trendsData, span, agg } = data;
    return (
        <body>
            <NavTop {...state} />
            <main class="container">
                <div class="grid">
                    <NavSide />
                    <TrendsView
                        projects={projects}
                        project={project}
                        period={period}
                        trendsData={trendsData}
                        span={span}
                        agg={agg}
                    />
                </div>
            </main>
            <Footer />
            <script src="/js/pico.js"></script>
        </body>
    );
}
