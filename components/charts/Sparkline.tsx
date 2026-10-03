/** A static trend line with a soft fill; the last point is marked. */
export function Sparkline(
    { data, width = 120, height = 32, label }: { data: number[]; width?: number; height?: number; label?: string },
) {
    if (data.length < 2) return <div style={{ width, height }} />;
    const max = Math.max(...data, 1);
    const step = width / (data.length - 1);
    const pts = data.map((v, i) => [i * step, height - 3 - (v / max) * (height - 6)] as const);
    const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("");
    const area = `${line}L${width},${height}L0,${height}Z`;
    const [lx, ly] = pts[pts.length - 1];
    return (
        <svg
            viewBox={`-3 0 ${width + 6} ${height}`}
            width={width + 6}
            height={height}
            class="block overflow-visible"
            role={label ? "img" : undefined}
            aria-label={label}
            aria-hidden={label ? undefined : "true"}
        >
            <path d={area} fill="rgb(var(--accent))" fill-opacity="0.1" />
            <path
                d={line}
                fill="none"
                stroke="rgb(var(--accent))"
                stroke-width="1.5"
                stroke-linejoin="round"
                stroke-linecap="round"
            />
            <circle cx={lx} cy={ly} r="2.5" fill="rgb(var(--accent))" />
        </svg>
    );
}
