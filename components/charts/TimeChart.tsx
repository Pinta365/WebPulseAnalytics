import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { ChartPoint } from "lib/dashboard.ts";
import type { MetricDef } from "lib/metrics.ts";
import { change, formatMetric, formatPercent } from "lib/format.ts";

interface Props {
    points: ChartPoint[];
    metric: MetricDef;
    compareLabel: string;
    height?: number;
}

const PAD = { top: 12, right: 16, bottom: 28, left: 48 };

/** Smallest 1/2/5 × 10^n step that is at least `raw`. */
function niceStep(raw: number): number {
    const exp = Math.pow(10, Math.floor(Math.log10(raw)));
    for (const m of [1, 2, 5, 10]) {
        if (raw <= m * exp) return m * exp;
    }
    return 10 * exp;
}

/** Four gridline steps on clean values; whole numbers for counts. */
function ticks(max: number, format: MetricDef["format"]): number[] {
    let step = niceStep(Math.max(max, 1e-9) / 4);
    if (format === "number") step = Math.max(1, Math.round(step));
    if (format === "percent") step = Math.min(0.25, Math.max(step, 0.05));
    return [0, step, 2 * step, 3 * step, 4 * step];
}

function linePath(xs: number[], ys: (number | null)[]): string {
    let d = "";
    let pen = false;
    ys.forEach((y, i) => {
        if (y === null) {
            pen = false;
            return;
        }
        d += `${pen ? "L" : "M"}${xs[i].toFixed(1)},${y.toFixed(1)}`;
        pen = true;
    });
    return d;
}

function areaPaths(xs: number[], ys: (number | null)[], base: number): string {
    // One closed shape per contiguous run of values.
    let d = "";
    let run: number[] = [];
    const flush = () => {
        if (run.length > 1) {
            d += `M${xs[run[0]].toFixed(1)},${base}`;
            run.forEach((i) => d += `L${xs[i].toFixed(1)},${ys[i]!.toFixed(1)}`);
            d += `L${xs[run[run.length - 1]].toFixed(1)},${base}Z`;
        }
        run = [];
    };
    ys.forEach((y, i) => y === null ? flush() : run.push(i));
    flush();
    return d;
}

export function TimeChart({ points, metric, compareLabel, height = 280 }: Props) {
    const wrap = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(800);
    const [hover, setHover] = useState<number | null>(null);

    useEffect(() => {
        const el = wrap.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => setWidth(Math.max(280, Math.round(entry.contentRect.width))));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const geo = useMemo(() => {
        const cur = points.map((p) => p.cur?.[metric.key] ?? null);
        const prev = points.map((p) => p.prev?.[metric.key] ?? null);
        const max = Math.max(0, ...cur.map((v) => v ?? 0), ...prev.map((v) => v ?? 0));
        const yTicks = ticks(max, metric.format);
        const top = yTicks[yTicks.length - 1];
        const plotW = width - PAD.left - PAD.right;
        const plotH = height - PAD.top - PAD.bottom;
        const n = points.length;
        const xs = points.map((_, i) => PAD.left + (n > 1 ? (i * plotW) / (n - 1) : plotW / 2));
        const y = (v: number | null) => v === null ? null : PAD.top + plotH - (v / top) * plotH;
        const curY = cur.map(y);
        const prevY = prev.map(y);
        // Roughly one x label per 90px, always including the first and last bucket.
        const every = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(plotW / 90))));
        const xLabels = points.map((_, i) => i).filter((i) => i % every === 0);
        const lastCur = curY.reduce<number>((acc, v, i) => v === null ? acc : i, -1);
        return { cur, prev, yTicks, top, plotW, plotH, xs, y, curY, prevY, xLabels, lastCur, base: PAD.top + plotH };
    }, [points, metric, width, height]);

    if (points.length === 0) {
        return <div class="h-[280px] grid place-items-center text-fg-3 text-[13px]">No data for this period</div>;
    }

    function indexFromEvent(e: PointerEvent): number {
        const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * width;
        let best = 0;
        geo.xs.forEach((px, i) => {
            if (Math.abs(px - x) < Math.abs(geo.xs[best] - x)) best = i;
        });
        return best;
    }

    function onKey(e: KeyboardEvent) {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            const dir = e.key === "ArrowRight" ? 1 : -1;
            const start = hover ?? (dir > 0 ? -1 : points.length);
            setHover(Math.min(points.length - 1, Math.max(0, start + dir)));
        } else if (e.key === "Escape") {
            setHover(null);
        }
    }

    const fmtTick = (v: number) =>
        metric.format === "duration" ? formatMetric(v, "duration") : formatMetric(v, metric.format);
    const h = hover !== null ? points[hover] : null;
    const hv = hover !== null ? geo.cur[hover] : null;
    const hp = hover !== null ? geo.prev[hover] : null;
    const delta = hv !== null && hp !== null ? change(hv, hp) : null;
    const tipLeft = hover !== null ? geo.xs[hover] : 0;
    const tipOnLeft = hover !== null && tipLeft > width * 0.6;

    return (
        <div ref={wrap} class="relative select-none">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                class="block w-full h-auto outline-none"
                role="img"
                aria-label={`${metric.label} over time, compared with ${compareLabel.toLowerCase()}. Use arrow keys to inspect values.`}
                tabIndex={0}
                onPointerMove={(e) => setHover(indexFromEvent(e))}
                onPointerLeave={() => setHover(null)}
                onKeyDown={onKey}
                onBlur={() => setHover(null)}
            >
                <defs>
                    <linearGradient id="tc-fill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stop-color="rgb(var(--accent))" stop-opacity="0.16" />
                        <stop offset="100%" stop-color="rgb(var(--accent))" stop-opacity="0.02" />
                    </linearGradient>
                </defs>

                {/* Grid + y labels */}
                {geo.yTicks.map((t, i) => {
                    const y = geo.y(t)!;
                    return (
                        <g key={t}>
                            <line
                                x1={PAD.left}
                                x2={width - PAD.right}
                                y1={y}
                                y2={y}
                                stroke={i === 0 ? "var(--chart-axis)" : "var(--chart-grid)"}
                                stroke-width="1"
                                shape-rendering="crispEdges"
                            />
                            <text
                                x={PAD.left - 10}
                                y={y}
                                dy="0.32em"
                                text-anchor="end"
                                class="fill-fg-3 tabular"
                                font-size="11"
                            >
                                {fmtTick(t)}
                            </text>
                        </g>
                    );
                })}

                {/* X labels */}
                {geo.xLabels.map((i) => (
                    <text
                        key={i}
                        x={geo.xs[i]}
                        y={height - 8}
                        text-anchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"}
                        class="fill-fg-3"
                        font-size="11"
                    >
                        {points[i].tick}
                    </text>
                ))}

                {/* Previous period */}
                <path
                    d={linePath(geo.xs, geo.prevY)}
                    fill="none"
                    stroke="var(--chart-compare)"
                    stroke-width="1.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                />

                {/* Current period */}
                <path d={areaPaths(geo.xs, geo.curY, geo.base)} fill="url(#tc-fill)" />
                <path
                    d={linePath(geo.xs, geo.curY)}
                    fill="none"
                    stroke="rgb(var(--accent))"
                    stroke-width="2"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                />
                {geo.lastCur >= 0 && hover === null && (
                    <circle
                        cx={geo.xs[geo.lastCur]}
                        cy={geo.curY[geo.lastCur]!}
                        r="4"
                        fill="rgb(var(--accent))"
                        stroke="rgb(var(--surface))"
                        stroke-width="2"
                    />
                )}

                {/* Crosshair */}
                {hover !== null && (
                    <g pointer-events="none">
                        <line
                            x1={geo.xs[hover]}
                            x2={geo.xs[hover]}
                            y1={PAD.top}
                            y2={geo.base}
                            stroke="rgb(var(--fg-3))"
                            stroke-opacity="0.5"
                            stroke-width="1"
                            shape-rendering="crispEdges"
                        />
                        {geo.prevY[hover] !== null && (
                            <circle
                                cx={geo.xs[hover]}
                                cy={geo.prevY[hover]!}
                                r="3.5"
                                fill="var(--chart-compare)"
                                stroke="rgb(var(--surface))"
                                stroke-width="2"
                            />
                        )}
                        {geo.curY[hover] !== null && (
                            <circle
                                cx={geo.xs[hover]}
                                cy={geo.curY[hover]!}
                                r="4.5"
                                fill="rgb(var(--accent))"
                                stroke="rgb(var(--surface))"
                                stroke-width="2"
                            />
                        )}
                    </g>
                )}
            </svg>

            {h && (
                <div
                    class="absolute top-2 z-10 pointer-events-none min-w-[180px] rounded-lg bg-surface border border-line shadow-pop px-3 py-2.5 text-xs"
                    style={{
                        left: tipOnLeft ? undefined : `${tipLeft + 12}px`,
                        right: tipOnLeft ? `${width - tipLeft + 12}px` : undefined,
                    }}
                    role="status"
                >
                    <div class="text-fg-3 mb-1.5">{h.label}</div>
                    <div class="flex items-center gap-2">
                        <span class="w-3 h-0.5 rounded bg-accent" />
                        <span class="font-semibold text-fg text-[13px] tabular">
                            {h.cur ? formatMetric(hv, metric.format, true) : "–"}
                        </span>
                        <span class="text-fg-2">{metric.label}</span>
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="w-3 h-0.5 rounded" style={{ background: "var(--chart-compare)" }} />
                        <span class="font-medium text-fg-2 tabular">{formatMetric(hp, metric.format, true)}</span>
                        <span class="text-fg-3">{compareLabel}</span>
                    </div>
                    {delta !== null && (
                        <div
                            class={`mt-1.5 pt-1.5 border-t border-line tabular ${
                                (delta >= 0) !== !!metric.lowerIsBetter ? "text-good" : "text-bad"
                            }`}
                        >
                            {delta >= 0 ? "▲" : "▼"} {formatPercent(Math.abs(delta), 1)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
