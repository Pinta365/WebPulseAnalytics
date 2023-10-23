interface AnalysisData {
    measure: string;
    value: string;
    submeasure: string;
    subvalue: string;
}

export function AnalysisBox(data: AnalysisData) {
    return (
        <div class="analysis-box container">
            <div class="analysis-total">
                { data.value }
            </div>
            <div class="small">
                { data.measure }
            </div>
            { data.submeasure && (
                <>
                    <div class="analysis-details">
                        { data.subvalue }
                    </div>
                    <div class="small">
                        { data.submeasure }
                    </div>
                </>    
            )}
        </div>
    );
}
