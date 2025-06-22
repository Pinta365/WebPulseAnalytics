import { h } from "preact";

interface SparklineProps {
    data: number[];
    color?: string;
    height?: number;
    width?: number;
}

export default function Sparkline({ data, color = "#2563eb", height = 32, width = 100 }: SparklineProps) {
    if (!data || data.length === 0) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const points = data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 4) - 2; // 2px padding top/bottom
        return `${x},${y}`;
    }).join(" ");
    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
            <polyline
                fill="none"
                stroke={color}
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                points={points}
            />
        </svg>
    );
}
