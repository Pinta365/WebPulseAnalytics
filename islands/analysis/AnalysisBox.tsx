interface AnalysisBoxData {
    measure: string;
    value: number;
    submeasure?: string;
    subvalue?: string;
    lastBox: boolean;
}

export function AnalysisBox(data: AnalysisBoxData) {
    return (
        <div class={`analysis-box container${!data.lastBox ? " analysis-box-br" : ""}`}>
            <div class={`analysis-${data.submeasure ? "total" : "full"}`}>
                {data.value}
            </div>
            <div class="small">
                {data.measure}
            </div>
            {data.submeasure && (
                <>
                    <div class="analysis-details">
                        {data.subvalue}
                    </div>
                    <div class="small">
                        {data.submeasure}
                    </div>
                </>
            )}
        </div>
    );
}
