import { AnalysisBox } from "islands/analysis/AnalysisBox.tsx";
import { Project } from "lib/commonTypes.ts";

interface Projects {
    projects: Project[];
    project: Project;
}

function printProject(project?: Project) {

    // Define example data for AnalysisBoxes
    const analysisData = [
        {
            measure: 'Sessions',
            value: 132,
            submeasure: 'Sessions/Visitor',
            subvalue: 3.2,
        },
        {
            measure: 'Page Views',
            value: 4500,
            submeasure: 'Page Views/Session',
            subvalue: 6.8,
        },
        {
            measure: 'Clicks',
            value: 780,
            submeasure: 'Clicks/Page View',
            subvalue: 0.17,
        },
        {
            measure: 'Scrolls',
            value: 420,
            submeasure: 'Scrolls/Page View',
            subvalue: 0.09,
        },
        // Add more data for additional measures
    ];

    return (
        <section class="analysis-section">
            <div class="grid">
                {analysisData.map((data, index) => (
                    <AnalysisBox
                        key={index}
                        measure={data.measure}
                        value={data.value}
                        submeasure={data.submeasure}
                        subvalue={data.subvalue}
                    />
                ))}
            </div>
            <h1>Project: <span class="primary">{project ? project.name : "Total"}</span></h1>
            <div class="history-graph"></div>
        </section>
    );
}


function printProjectMenuEntry(project?: Project) {
    const projectName = project ? project.name : "Total";
    const projectUrl = `/dashboard/realtime/${project ? project.id : "all"}`;
    return (<div><a href={projectUrl}>{projectName}</a></div>);
}

export function RealTimeView(data: Projects) {
    const { project, projects } = data;
    return (
        <section>
            <div class="grid">
                {printProjectMenuEntry()}
                {projects?.length > 0 ? projects.map((projectEntry) => printProjectMenuEntry(projectEntry)) : <p>No projects</p>}
            </div>
            {printProject(project)}
        </section>
    );
}
