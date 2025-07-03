import type { Handlers, PageProps } from "$fresh/server.ts";
import { NavTop } from "components/layout/NavTop.tsx";
import { NavSide } from "islands/NavSide.tsx";
import { LandingView } from "components/LandingView.tsx";
import { Footer } from "components/layout/Footer.tsx";
import { getAnalytics, getProjects } from "../../lib/db.ts";
import { ObjectId } from "mongodb";

export const handler: Handlers = {
    async GET(_req, ctx) {
        const userId = ctx.state._id as string;
        const projects = await getProjects(userId);
        // For analytics, aggregate for all projects in the last 7 days
        const projectIds = projects.map((p) => p._id).filter(Boolean).map((id) => new ObjectId(id));
        const now = Date.now();
        const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
        let analytics = null;
        let mostActiveProject = null;
        if (projectIds.length > 0) {
            // getAnalytics returns an array of per-project stats
            const analyticsArr = await getAnalytics(projectIds, weekAgo, now, false);
            analytics = analyticsArr.reduce((acc, cur) => {
                acc.pageLoads = (acc.pageLoads || 0) + (cur.pageLoads || 0);
                acc.sessions = (acc.sessions || 0) + (cur.sessions || 0);
                return acc;
            }, {});
            // Find the most active project by pageLoads
            if (analyticsArr.length > 0) {
                const top = analyticsArr.reduce((a, b) => (a.pageLoads > b.pageLoads ? a : b));
                mostActiveProject = {
                    name: top.projectName,
                    pageLoads: top.pageLoads,
                    sessions: top.sessions,
                };
            }
        }
        return ctx.render({ ...ctx.state, projects, analytics, mostActiveProject });
    },
};

export default function DashboardLanding({ data }: PageProps<any>) {
    return (
        <body>
            <NavTop {...data} />

            <main class="container">
                <div class="grid">
                    <NavSide />
                    <LandingView
                        projects={data.projects}
                        analytics={data.analytics}
                        mostActiveProject={data.mostActiveProject}
                    />
                </div>
            </main>

            <Footer />
        </body>
    );
}
