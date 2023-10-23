import { AnalysisBox } from "islands/analysis/AnalysisBox.tsx";
import { Project, RealTimePeriod, RealTimePeriods, RealTimeStats } from "lib/commonTypes.ts";

interface Projects {
    projects: Project[];
    project: Project;
    stats: RealTimeStats;
    period: RealTimePeriod;
}

const periodTranslations: Record<string, string> = {
    "30min": "30 Minutes",
    "today": "Today",
    "yesterday": "Yesterday",
};

function printProject(stats: RealTimeStats, period: RealTimePeriod, project?: Project) {
    // Define example data for AnalysisBoxes
    const analysisData = [
        {
            measure: "Visitors",
            value: stats.visitors,
        },
        {
            measure: "Sessions",
            value: stats.sessions,
            submeasure: "Sessions/Visitor",
            subvalue: (stats.sessions / stats.visitors).toPrecision(2),
        },
        {
            measure: "Page Views",
            value: stats.pageLoads,
            submeasure: "Page Views/Session",
            subvalue: (stats.pageLoads / stats.sessions).toPrecision(2),
        },
        {
            measure: "Clicks",
            value: stats.clicks,
            submeasure: "Clicks/Page View",
            subvalue: (stats.clicks / stats.pageLoads).toPrecision(2),
        },
        {
            measure: "Scrolls",
            value: stats.scrolls,
            submeasure: "Scrolls/Page View",
            subvalue: (stats.scrolls / stats.pageLoads).toPrecision(2),
        },
        // Add more data for additional measures
    ];

    return (
        <section class="analysis-section">
            <div class="grid">
                {analysisData.map((data, index) => (
                    <AnalysisBox
                        key={index}
                        lastBox={Object.keys(data).length === index}
                        measure={data.measure}
                        value={data.value}
                        submeasure={data.submeasure}
                        subvalue={data.subvalue}
                    />
                ))}
            </div>
            <hr></hr>
            <div class="history-graph"></div>
        </section>
    );
}

function printProjectMenuEntry(period: string | null, currentProject?: Project, project?: Project) {
    const periodName = period ? period : "30min";
    const projectName = project ? project.name : "Total";
    const projectUrl = `/dashboard/realtime/${project ? project.id : "all"}/${periodName}`;
    const projectTitle = project ? (project.description || project.name) : "Total for all projects.";
    const projectClass = (currentProject === project) || (!currentProject && !project)
        ? "primary"
        : "secondary outline";
    return (
        <li>
            <a role="button" href={projectUrl} title={projectTitle} class={projectClass}>{projectName}</a>
        </li>
    );
}

function printPeriodMenuEntry(currentPeriod: string, period: RealTimePeriod, project?: Project) {
    const periodName = periodTranslations[currentPeriod] ? periodTranslations[currentPeriod] : "Custom period";
    const periodUrl = currentPeriod ? `/dashboard/realtime/${project ? project.id : "all"}/${currentPeriod}` : "#";
    const periodTitle = periodTranslations[currentPeriod];
    const periodClass = (currentPeriod === period.name) ? "primary" : "secondary outline";
    return (
        <li>
            <a role="button" href={periodUrl} title={periodTitle} class={periodClass}>{periodName}</a>
        </li>
    );
}

export function RealTimeView(data: Projects) {
    const { project, projects, stats, period } = data;
    return (
        <section>
            <nav>
                <ul class="selector-menu">
                    {printProjectMenuEntry(period.name, project)}
                    {projects?.length > 0
                        ? projects.map((projectEntry) => printProjectMenuEntry(period.name, project, projectEntry))
                        : <li>No projects</li>}
                </ul>
                <ul class="selector-menu">
                    <li class="strong">Period</li>
                    {RealTimePeriods?.length > 0
                        ? RealTimePeriods.map((periodEntry) => printPeriodMenuEntry(periodEntry, period, project))
                        : <li>No periods</li>}
                </ul>
            </nav>
            <hr></hr>
            {printProject(stats, period, project)}
        </section>
    );
}
