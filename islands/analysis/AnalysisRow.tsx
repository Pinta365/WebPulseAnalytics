import { RealTimeStats } from "lib/commonTypes.ts";

interface AnalysisRowData {
    project: RealTimeStats;
}

export function AnalysisRow(data: AnalysisRowData) {
    return (
        <tr>
            <td>{data.project.projectName}</td>
            <td>{data.project.visitors}</td>   
            <td>{data.project.sessions}</td>  
            <td>{data.project.pageLoads}</td>          
            <td>{data.project.clicks}</td>     
            <td>{data.project.scrolls}</td>    
        </tr>
    );
}
