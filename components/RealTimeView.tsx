// deno-lint-ignore-file no-explicit-any
import { AnalysisBox } from "islands/analysis/AnalysisBox.tsx";
import { Project } from "lib/db.ts";
import { RealTimePeriod, RealTimePeriods, RealTimeStats } from "lib/commonTypes.ts";
import DataTable from "islands/DataTable.tsx";
import { classNames } from "lib/helper.ts";

interface Projects {
    projects: Project[];
    project: Project;
    analyticsData: RealTimeStats[];
    analyticsDataPerProject: RealTimeStats[];
    period: RealTimePeriod;
    osData?: any;
    referrerData?: any;
    countryData?: any;
    browserData?: any;
    pagesVisitedData?: any[];
}

const periodTranslations: Record<string, string> = {
    "30min": "30 Minutes",
    "today": "Today",
    "yesterday": "Yesterday",
};

function printProject(stats: RealTimeStats) {
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
    ];

    return (
        <section class="mb-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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

function printProjectLink(period: string | null, project?: Project, projectClass?: string) {
    const periodName = period ? period : "30min";
    const projectName = project ? project.name : "Total";
    const projectUrl = `/dashboard/realtime/${project ? project._id : "all"}/${periodName}`;
    const projectTitle = project ? (project.description || project.name) : "Total for all projects.";
    return <a href={projectUrl} title={projectTitle} class={projectClass}>{projectName}</a>;
}

function printProjectMenuEntry(period: string | null, currentProject?: Project, project?: Project) {
    const isActive = (currentProject === project) || (!currentProject && !project);
    const projectClass = classNames(
        "dropdown-item",
        isActive && "dropdown-item-active",
    );
    return (
        <li>
            {printProjectLink(period, project, projectClass)}
        </li>
    );
}

function printPeriodMenuEntry(currentPeriod: string, period: RealTimePeriod, project?: Project) {
    const safePeriodName = currentPeriod ?? "";
    const periodName = periodTranslations[safePeriodName] ? periodTranslations[safePeriodName] : "Custom period";
    const periodUrl = currentPeriod ? `/dashboard/realtime/${project ? project._id : "all"}/${currentPeriod}` : "#";
    const periodTitle = periodTranslations[safePeriodName];
    const isActive = currentPeriod === period.name;
    const periodClass = classNames(
        "dropdown-item",
        isActive && "dropdown-item-active",
    );
    return (
        <li>
            <a href={periodUrl} title={periodTitle} class={periodClass}>{periodName}</a>
        </li>
    );
}

export function RealTimeView(data: Projects) {
    const {
        project,
        projects,
        analyticsData,
        analyticsDataPerProject,
        period,
        osData,
        referrerData,
        countryData,
        browserData,
        pagesVisitedData,
    } = data;
    return (
        <section class="space-y-8">
            <div class="flex flex-col sm:flex-row justify-between items-start">
                <div>
                    <details class="relative">
                        <summary class="summary-base">
                            {project ? project.name : "All Projects"}
                        </summary>
                        <ul class="dropdown-menu">
                            {printProjectMenuEntry(period.name ?? "", project)}
                            {projects?.length > 0
                                ? projects.map((projectEntry) =>
                                    printProjectMenuEntry(period.name ?? "", project, projectEntry)
                                )
                                : <li class="px-4 py-2 text-muted">No projects</li>}
                        </ul>
                    </details>
                </div>
                <div>
                    <details class="relative">
                        <summary class="summary-base">
                            Period: {periodTranslations[period.name ?? ""]}
                        </summary>
                        <ul class="dropdown-menu">
                            {RealTimePeriods?.length > 0
                                ? RealTimePeriods.map((periodEntry) =>
                                    printPeriodMenuEntry(periodEntry, period, project)
                                )
                                : <li class="px-4 py-2 text-muted">No periods</li>}
                        </ul>
                    </details>
                </div>
            </div>
            {analyticsData[0] && printProject(analyticsData[0])}
            {analyticsDataPerProject?.length > 0 && (
                <article class="card">
                    <DataTable
                        columns={[
                            { key: "projectName", label: "Project" },
                            { key: "visitors", label: "Visitors" },
                            { key: "sessions", label: "Sessions" },
                            { key: "pageLoads", label: "Page Loads" },
                            { key: "clicks", label: "Clicks" },
                            { key: "scrolls", label: "Scrolls" },
                        ]}
                        data={analyticsDataPerProject}
                        topN={100}
                    />
                </article>
            )}
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
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            {pagesVisitedData && pagesVisitedData.length > 0 && (
                <div class="grid grid-cols-1">
                    <article class="card">
                        <h3 class="text-xl font-semibold text-primary mb-4">Pages Visited</h3>
                        <DataTable
                            columns={[
                                { key: "title", label: "Title" },
                                {
                                    key: "url",
                                    label: "URL",
                                    render: (value: string) =>
                                        value
                                            ? (
                                                <a
                                                    href={value}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    class="link"
                                                >
                                                    {value}
                                                </a>
                                            )
                                            : <span class="text-muted">(no url)</span>,
                                },
                                { key: "count", label: "Count" },
                            ]}
                            data={pagesVisitedData.map((row: any) => ({
                                title: row._id?.title || "(no title)",
                                url: row._id?.url || "",
                                count: row.count,
                            }))}
                            defaultSortCol="count"
                            defaultSortDir="desc"
                        />
                    </article>
                </div>
            )}
        </section>
    );
}
