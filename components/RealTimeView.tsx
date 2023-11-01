import { AnalysisBox } from "islands/analysis/AnalysisBox.tsx";
import { Project, RealTimePeriod, RealTimePeriods, RealTimeStats } from "lib/commonTypes.ts";
import { getAnalytics } from "lib/db.ts";

interface Projects {
    projects: Project[];
    project: Project;
    analyticsData: RealTimeStats[];
    analyticsDataPerProject: RealTimeStats[];
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
            measure: "Page Loads",
            value: stats.pageLoads,
            submeasure: "Page Loads/Session",
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
        </section>
    );
}

function printProjects(stats: RealTimeStats[], period: RealTimePeriod, project?: Project) {
    return (
        <article>
            <table>
                <thead>
                    <tr>
                        <td>Project</td>
                        <td>Visitors</td>
                        <td>Sessions</td>
                        <td>Page Loads</td>
                        <td>Clicks</td>
                        <td>Scrolls</td>
                    </tr>
                </thead>
                <tbody>
                    {stats.map((data, index) => (
                        <tr>
                            <td>{data.projectName}</td>
                            <td>{data.visitors}</td>   
                            <td>{data.sessions}</td>  
                            <td>{data.pageLoads}</td>          
                            <td>{data.clicks}</td>     
                            <td>{data.scrolls}</td>    
                        </tr>
                    ))}
                </tbody>
            </table>
        </article>
    );
}

function printDataTable(data: { _id: string | null; count: number }[], topN: number, titles: string[]) {
    const rowsToShow = data.slice(0, topN);
    return (
        <table>
            <thead>
                <tr>
                    {titles.map((title, index) => (
                        <th key={index}>{title}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rowsToShow.map((row, index) => (
                    <tr key={index}>
                        <td>{row._id && row._id.trim() !== "" ? row._id : "Unknown"}</td>
                        <td>{row.count}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}


function printProjectLink(period: string | null, project?: Project, projectClass?: string) {
    const periodName = period ? period : "30min";
    const projectName = project ? project.name : "Total";
    const projectUrl = `/dashboard/realtime/${project ? project._id : "all"}/${periodName}`;
    const projectTitle = project ? (project.description || project.name) : "Total for all projects.";
    return (<a href={projectUrl} title={projectTitle} class={projectClass}>{projectName}</a>);
}

function printProjectMenuEntry(period: string | null, currentProject?: Project, project?: Project) {
    const projectClass = (currentProject === project) || (!currentProject && !project)
        ? "primary"
        : "secondary outline";
    return (
        <li>
            {printProjectLink(period,project,projectClass)}
        </li>
    );
}

function printPeriodMenuEntry(currentPeriod: string, period: RealTimePeriod, project?: Project) {
    const periodName = periodTranslations[currentPeriod] ? periodTranslations[currentPeriod] : "Custom period";
    const periodUrl = currentPeriod ? `/dashboard/realtime/${project ? project._id : "all"}/${currentPeriod}` : "#";
    const periodTitle = periodTranslations[currentPeriod];
    const periodClass = (currentPeriod === period.name) ? "primary" : "secondary outline";
    return (
        <li>
            <a href={periodUrl} title={periodTitle} class={periodClass}>{periodName}</a>
        </li>
    );
}

export function RealTimeView(data: Projects) {
    const { project, projects, analyticsData, analyticsDataPerProject, period, osData, referrerData, countryData, browserData } = data;
    return (
        <section>
            <div class="grid">
                <div>
                    <details class="dropdown" role="list">
                        <summary>{project ? project.name : "All Projects"}</summary>
                        <ul>
                        {printProjectMenuEntry(period.name, project)}
                        {projects?.length > 0
                                ? projects.map((projectEntry) => printProjectMenuEntry(period.name, project, projectEntry))
                                : <li>No projects</li>}
                        </ul>
                    </details>
                </div>
                <div class="right">
                    <details class="dropdown" role="list">
                        <summary>Period: {periodTranslations[period.name]}</summary>
                        <ul>
                            {RealTimePeriods?.length > 0
                                ? RealTimePeriods.map((periodEntry) => printPeriodMenuEntry(periodEntry, period, project))
                                : <li>No periods</li>}
                        </ul>
                    </details>
                </div>
            </div>
            { analyticsData[0] && printProject(analyticsData[0], period, project) }
            { analyticsDataPerProject?.length > 0 && printProjects(analyticsDataPerProject, period, project) }
            <div class="grid">
                <article>
                    { referrerData && printDataTable(referrerData, 10, ["Referrer", "Count"]) }
                </article>
                <article>
                    { countryData && printDataTable(countryData, 10, ["Country", "Count"]) }
                </article>
            </div>
            <div class="grid">
                <article>
                    { browserData && printDataTable(browserData, 10, ["Browser", "Count"]) }
                </article>
                <article>
                    { osData && printDataTable(osData, 10, ["Operating System", "Count"]) }
                </article>
            </div>
        </section>
    );
}
