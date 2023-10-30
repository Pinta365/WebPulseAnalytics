import type { Handlers, PageProps } from "$fresh/server.ts";

import { NavTop } from "components/layout/NavTop.tsx";
import { NavSide } from "islands/NavSide.tsx";
import { RealTimeView } from "components/RealTimeView.tsx";
import { Footer } from "components/layout/Footer.tsx";
import { getAnalytics, getProjects } from "lib/db.ts";
import { RealTimePeriod, RealTimePeriods, RealTimeStats } from "lib/commonTypes.ts";

export const handler: Handlers = {
    async GET(req, ctx) {
        
        // List projects
        const projects = await getProjects(ctx.state._id as string);

        // Find selected project, or "all"
        let project = null;
        if (ctx.params.project !== "all") {
            project = projects.find((p) => p._id.toString() === ctx.params.project);
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
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).getTime();        
        if (period.name === "30min") {
            period.from = Date.now()-1800*1000;
            period.to = Date.now();
        }
        if (period.name === "today") {
            const now = new Date();
            period.from = startOfToday;
            period.to = Date.now();
        }
        if (period.name === "yesterday") {
            period.from = startOfYesterday;
            period.to = startOfToday;
        }

        // Grand Total Stats
        const projectIds = projects.map(p=>p._id!);
        let analyticsData;
        let analyticsDataPerProject;
        if (project === null) {
            analyticsData = await getAnalytics(projectIds,period.from!,period.to!, true);
            analyticsDataPerProject = await getAnalytics(projectIds,period.from!,period.to!, false);
            
        } else {
            analyticsData = await getAnalytics([project._id!],Date.now()-3600*1000*24,Date.now(), false);
        }

        // Per project stats (if applicable)
        
        // Go!
        return ctx.render({
            state: ctx.state,
            project,
            projects,
            period,
            analyticsData,
            analyticsDataPerProject
        });
    },
};

export default function Projects({ data }: PageProps) {
    const { state, projects, project, period, analyticsData, analyticsDataPerProject } = data;

    return (
        <body>
            <NavTop {...state} />
            <main class="container">
                <div class="grid">
                    <NavSide />
                    <RealTimeView
                        project={project}
                        projects={projects}
                        analyticsData={analyticsData}
                        analyticsDataPerProject={analyticsDataPerProject}
                        period={period}
                    />
                </div>
            </main>
            <Footer />
            <script src="/js/pico.js"></script>
        </body>
    );
}
