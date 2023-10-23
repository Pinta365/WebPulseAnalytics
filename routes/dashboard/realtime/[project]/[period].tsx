import type { Handlers, PageProps } from "$fresh/server.ts";

import { NavTop } from "components/layout/NavTop.tsx";
import { NavSide } from "islands/NavSide.tsx";
import { RealTimeView } from "components/RealTimeView.tsx";
import { Footer } from "components/layout/Footer.tsx";
import { getProjects } from "db/db.ts";
import { RealTimePeriod, RealTimePeriods, RealTimeStats } from "lib/commonTypes.ts";

export const handler: Handlers = {
    async GET(req, ctx) {
        // List projects
        const projects = await getProjects(ctx.state.userId as string);

        // Find selected project, or "all"
        let project = null;
        if (ctx.params.project !== "all") {
            project = projects.find((p) => p.id === ctx.params.project);
            if (!project) {
                // 404!!
                return ctx.renderNotFound();
            }
        }

        // Period can either be named, or to/from
        // ToDo: Handle custom periods
        const period: RealTimePeriod = {
            name: "30min",
            from: null,
            to: null,
        };
        const foundPeriod = RealTimePeriods.find((p) => p === ctx.params.period);
        if (foundPeriod) {
            period.name = ctx.params.period;
        } else {
            // 404!!
            return ctx.renderNotFound();
        }

        // Get stats for selected project/view
        let fakeFactor = 1;
        if (period.name === "30min") fakeFactor = 0.1;
        if (period.name === "yesterday") fakeFactor = 1.1;
        const stats: RealTimeStats = {
            /* ToDo: Fill with actual data */
            pageLoads: 120 * fakeFactor,
            sessions: 130 * fakeFactor,
            visitors: 40 * fakeFactor,
            clicks: 140 * fakeFactor,
            scrolls: 150 * fakeFactor,
            history: [],
        };

        // Go!
        return ctx.render({
            state: ctx.state,
            project,
            projects,
            period,
            stats,
        });
    },
};

export default function Projects({ data }: PageProps) {
    const { state, projects, project, period, stats } = data;
    return (
        <body>
            <NavTop {...state} />
            <main class="container">
                <div class="grid">
                    <NavSide />
                    <RealTimeView
                        project={project}
                        projects={projects}
                        stats={stats}
                        period={period}
                    />
                </div>
            </main>
            <Footer />
            <script src="/js/pico.js"></script>
        </body>
    );
}
