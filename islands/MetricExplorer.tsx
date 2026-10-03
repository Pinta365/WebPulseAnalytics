import { useState } from "preact/hooks";
import { TimeChart } from "components/charts/TimeChart.tsx";
import type { ChartData } from "lib/dashboard.ts";
import { type MetricKey, METRICS, type MetricValues } from "lib/metrics.ts";
import { change, formatMetric, formatPercent } from "lib/format.ts";

interface Props {
    current: MetricValues;
    previous: MetricValues;
    chart: ChartData;
    initialMetric: MetricKey;
    rangeLabel: string;
}

function Delta({ cur, prev, lowerIsBetter }: { cur: number | null; prev: number | null; lowerIsBetter?: boolean }) {
    const d = cur !== null && prev !== null ? change(cur, prev) : null;
    if (d === null) return <span class="text-xs text-fg-3">No prior data</span>;
    if (Math.abs(d) < 0.005) return <span class="text-xs text-fg-3 tabular">±0%</span>;
    const good = (d > 0) !== !!lowerIsBetter;
    return (
        <span
            class={`inline-flex items-center gap-0.5 text-xs font-medium tabular ${good ? "text-good" : "text-bad"}`}
            title={`${good ? "Better" : "Worse"} than the previous period`}
        >
            <svg class="w-3 h-3" viewBox="0 0 12 12" aria-hidden="true">
                <path d={d > 0 ? "M6 2.5 10 8H2z" : "M6 9.5 2 4h8z"} fill="currentColor" />
            </svg>
            {formatPercent(Math.abs(d), Math.abs(d) < 0.1 ? 1 : 0)}
        </span>
    );
}

export default function MetricExplorer({ current, previous, chart, initialMetric, rangeLabel }: Props) {
    const [metricKey, setMetricKey] = useState<MetricKey>(initialMetric);
    const metric = METRICS.find((m) => m.key === metricKey)!;

    function select(key: MetricKey) {
        setMetricKey(key);
        try {
            const url = new URL(globalThis.location.href);
            url.searchParams.set("metric", key);
            globalThis.history.replaceState(null, "", url);
        } catch { /* non-critical */ }
    }

    return (
        <section class="card overflow-hidden">
            <div
                class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-px bg-line border-b border-line"
                role="tablist"
                aria-label="Metric to chart"
            >
                {METRICS.map((m) => {
                    const selected = m.key === metricKey;
                    return (
                        <button
                            type="button"
                            role="tab"
                            aria-selected={selected}
                            onClick={() => select(m.key)}
                            title={m.description}
                            class={`relative text-left px-5 py-4 transition-colors ${
                                selected ? "bg-sunken/50" : "bg-surface hover:bg-sunken/40"
                            }`}
                        >
                            {selected && <span class="absolute inset-x-0 top-0 h-0.5 bg-accent" />}
                            <div class={`text-xs ${selected ? "text-fg font-medium" : "text-fg-2"}`}>{m.label}</div>
                            <div class="mt-1 text-2xl font-semibold tracking-tight text-fg">
                                {formatMetric(current[m.key], m.format)}
                            </div>
                            <div class="mt-1">
                                <Delta cur={current[m.key]} prev={previous[m.key]} lowerIsBetter={m.lowerIsBetter} />
                            </div>
                        </button>
                    );
                })}
            </div>

            <div class="px-5 pt-4 flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-4 text-xs text-fg-2">
                    <span class="inline-flex items-center gap-1.5">
                        <span class="w-3 h-0.5 rounded bg-accent" />
                        {metric.label} · {rangeLabel}
                    </span>
                    <span class="inline-flex items-center gap-1.5">
                        <span class="w-3 h-0.5 rounded" style={{ background: "var(--chart-compare)" }} />
                        {chart.compareLabel}
                    </span>
                </div>
            </div>
            <div class="px-2 sm:px-3 pt-2 pb-3">
                <TimeChart points={chart.points} metric={metric} compareLabel={chart.compareLabel} />
            </div>

            <details class="border-t border-line group">
                <summary class="px-5 py-2.5 text-xs text-fg-2 hover:text-fg cursor-pointer flex items-center gap-1.5">
                    <svg
                        class="w-3 h-3 transition-transform group-open:rotate-90"
                        viewBox="0 0 12 12"
                        aria-hidden="true"
                    >
                        <path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" />
                    </svg>
                    View as table
                </summary>
                <div class="max-h-80 overflow-auto border-t border-line">
                    <table class="table">
                        <thead class="sticky top-0 bg-surface">
                            <tr>
                                <th>Period</th>
                                {METRICS.map((m) => <th key={m.key} class="num">{m.label}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {chart.points.filter((p) => p.cur).slice().reverse().map((p) => (
                                <tr>
                                    <td class="whitespace-nowrap">{p.label}</td>
                                    {METRICS.map((m) => (
                                        <td class="num">{formatMetric(p.cur![m.key], m.format, true)}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </details>
        </section>
    );
}
