import { Project } from "lib/db.ts";
import { RealTimePeriod } from "lib/commonTypes.ts";

interface TrendsProps {
    projects: Project[];
    project?: Project;
    period: RealTimePeriod;
    trendsData?: any[];
    span: string;
    agg: string;
}

function printProjectMenuEntry(
    period: string | null,
    currentProject?: Project,
    project?: Project,
    agg?: string,
    span?: string,
) {
    const projectClass = (currentProject === project) || (!currentProject && !project)
        ? "primary"
        : "secondary outline";
    return (
        <li>
            <a
                href={`/dashboard/trends/${project ? project._id : "all"}/${agg ?? "week"}?span=${span ?? "this-year"}`}
                class={projectClass}
            >
                {project ? project.name : "Total"}
            </a>
        </li>
    );
}

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
        default:
            end.setDate(start.getDate() + 1);
    }
    end = new Date(end.getTime() - 1); // Remove 1 ms to get the "right" period

    return end.toLocaleDateString();
}

export function TrendsView({ projects, project, period, trendsData, span, agg }: TrendsProps) {
    // Helper to build URL
    function buildUrl(newSpan: string, newAgg: string, newProjectId?: string) {
        const projectId = newProjectId ?? (project ? project._id : "all");
        return `/dashboard/trends/${projectId}/${newAgg}?span=${newSpan}`;
    }
    const aggOptions = [
        { value: "day", label: "Per Day" },
        { value: "week", label: "Per Week" },
        { value: "month", label: "Per Month" },
        { value: "quarter", label: "Per Quarter" },
    ];
    const spanOptions = [
        { value: "this-year", label: "This Year (YTD)" },
        { value: "last-year", label: "Last Year" },
        { value: "3-months", label: "Last 3 Months" },
    ];
    return (
        <section>
            <div class="grid">
                <div>
                    <details class="dropdown" role="list">
                        <summary>{project ? project.name : "All Projects"}</summary>
                        <ul>
                            {printProjectMenuEntry(period.name, project, undefined, agg, span)}
                            {projects?.length > 0
                                ? projects.map((projectEntry) =>
                                    printProjectMenuEntry(period.name, project, projectEntry, agg, span)
                                )
                                : <li>No projects</li>}
                        </ul>
                    </details>
                </div>
                <div>
                    <details class="dropdown" role="list">
                        <summary>Time Span: {spanOptions.find((o) => o.value === span)?.label || span}</summary>
                        <ul>
                            {spanOptions.map((option) => (
                                <li key={option.value}>
                                    <a
                                        href={buildUrl(option.value, agg)}
                                        class={span === option.value ? "primary" : "secondary outline"}
                                    >
                                        {option.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </details>
                </div>
                <div>
                    <details class="dropdown" role="list">
                        <summary>Aggregation: {aggOptions.find((o) => o.value === agg)?.label || agg}</summary>
                        <ul>
                            {aggOptions.map((option) => (
                                <li key={option.value}>
                                    <a
                                        href={buildUrl(span, option.value)}
                                        class={agg === option.value ? "primary" : "secondary outline"}
                                    >
                                        {option.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </details>
                </div>
            </div>
            <div class="grid">
                <article>
                    <h3>Trends & History for {project ? project.name : "All Projects"}</h3>
                    <div style={{ color: "#888", fontSize: "0.95em", marginBottom: "0.5em" }}>
                        Aggregated per {aggOptions.find((o) => o.value === agg)?.label?.replace("Per ", "") ||
                            agg.charAt(0).toUpperCase() + agg.slice(1)}
                    </div>
                    {trendsData && trendsData.length > 0
                        ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date Range</th>
                                        <th>Visitors</th>
                                        <th>Sessions</th>
                                        <th>Page Loads</th>
                                        <th>Clicks</th>
                                        <th>Scrolls</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trendsData.map((row: any, idx: number) => (
                                        <tr key={idx}>
                                            <td>
                                                {new Date(row.date).toLocaleDateString()} -{" "}
                                                {getPeriodEnd(row.date, agg as "day" | "week" | "month" | "quarter")}
                                            </td>
                                            <td>{row.visitors}</td>
                                            <td>{row.sessions}</td>
                                            <td>{row.pageLoads}</td>
                                            <td>{row.clicks}</td>
                                            <td>{row.scrolls}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                        : <p>No data for selected period.</p>}
                </article>
            </div>
        </section>
    );
}
