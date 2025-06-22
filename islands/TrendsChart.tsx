import { useEffect, useRef } from "preact/hooks";

interface Dataset {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
}

interface TrendsChartProps {
    labels: string[];
    datasets: Dataset[];
    chartTitle?: string;
}

export default function TrendsChart({ labels, datasets, chartTitle }: TrendsChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!(window as any).Chart) {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/chart.js";
            script.onload = () => renderChart();
            document.body.appendChild(script);
        } else {
            renderChart();
        }

        function renderChart() {
            if (!canvasRef.current || !(window as any).Chart) return;
            const Chart = (window as any).Chart;
            if ((canvasRef.current as any)._chartInstance) {
                (canvasRef.current as any)._chartInstance.destroy();
            }
            const chartInstance = new Chart(canvasRef.current, {
                type: "line",
                data: {
                    labels,
                    datasets: datasets.map((ds, i) => ({
                        label: ds.label,
                        data: ds.data,
                        borderColor: ds.borderColor || `hsl(${i * 60}, 70%, 50%)`,
                        backgroundColor: ds.backgroundColor || `hsla(${i * 60}, 70%, 50%, 0.2)`,
                        fill: false,
                        tension: 0.2,
                        pointRadius: 0,
                        borderWidth: 2,
                    })),
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: datasets.length > 2 },
                        title: {
                            display: !!chartTitle,
                            text: chartTitle,
                        },
                    },
                    scales: {
                        x: {
                            display: true,
                            title: { display: false },
                            grid: { display: false },
                        },
                        y: {
                            display: true,
                            title: { display: false },
                            grid: { display: false },
                        },
                    },
                },
            });
            (canvasRef.current as any)._chartInstance = chartInstance;
        }
        // Cleanup
        return () => {
            if (canvasRef.current && (canvasRef.current as any)._chartInstance) {
                (canvasRef.current as any)._chartInstance.destroy();
            }
        };
    }, [labels, datasets, chartTitle]);

    return (
        <div style={{ width: "100%", maxWidth: 700, margin: "0 auto 1.5rem auto" }}>
            <canvas ref={canvasRef} height={150}></canvas>
        </div>
    );
}
