interface AnalysisBoxData {
    measure: string;
    value: number;
    submeasure?: string;
    subvalue?: string;
    lastBox: boolean;
}

export function AnalysisBox(data: AnalysisBoxData) {
    return (
        <div
            class={`text-center p-4 flex flex-col justify-center h-full ${!data.lastBox ? "border-r border-card" : ""}`}
        >
            <div class={`font-bold ${data.submeasure ? "text-3xl" : "text-4xl"} text-primary mt-4`}>
                {data.value}
            </div>
            <div class="text-sm italic text-secondary">
                {data.measure}
            </div>
            {data.submeasure && (
                <>
                    <div class="text-2xl text-primary">
                        {data.subvalue}
                    </div>
                    <div class="text-xs italic text-secondary">
                        {data.submeasure}
                    </div>
                </>
            )}
        </div>
    );
}
