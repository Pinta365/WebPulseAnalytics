import { useState } from "preact/hooks";
import type { BreakdownRow } from "lib/dashboard.ts";
import { flagEmoji, formatExact, formatNumber, formatPercent } from "lib/format.ts";

export interface BarListTab {
    key: string;
    label: string;
    /** Column heading for the values, e.g. "Sessions" */
    valueLabel: string;
    rows: BreakdownRow[];
    kind?: "plain" | "page" | "country" | "source";
}

interface Props {
    tabs: BarListTab[];
    /** Rows shown before "Show all" */
    limit?: number;
}

function Favicon({ label }: { label: string }) {
    // A neutral monogram: we do not load third-party favicon services, which would leak the viewer's IP.
    const ch = label === "(direct)" ? "→" : label.replace(/^www\./, "").charAt(0).toUpperCase();
    return (
        <span class="w-4 h-4 shrink-0 rounded grid place-items-center bg-sunken text-[9px] font-semibold text-fg-2">
            {ch}
        </span>
    );
}

function RowLabel({ row, kind }: { row: BreakdownRow; kind: BarListTab["kind"] }) {
    const lead = kind === "country"
        ? <span class="w-4 shrink-0 text-center leading-none">{flagEmoji(row.code)}</span>
        : kind === "source"
        ? <Favicon label={row.label} />
        : null;
    const text = <span class="truncate">{row.label}</span>;
    return (
        <span class="relative flex items-center gap-2 min-w-0" title={row.detail ?? row.label}>
            {lead}
            {row.href
                ? (
                    <a
                        href={row.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="min-w-0 flex items-center gap-1 hover:underline underline-offset-2"
                    >
                        {text}
                    </a>
                )
                : text}
        </span>
    );
}

export default function BarList({ tabs, limit = 8 }: Props) {
    const [active, setActive] = useState(tabs[0]?.key);
    const [expanded, setExpanded] = useState(false);
    const tab = tabs.find((t) => t.key === active) ?? tabs[0];
    if (!tab) return null;

    const total = tab.rows.reduce((a, r) => a + r.value, 0);
    const max = Math.max(1, ...tab.rows.map((r) => r.value));
    const visible = expanded ? tab.rows : tab.rows.slice(0, limit);

    return (
        <section class="card flex flex-col min-w-0">
            <div class="flex items-center justify-between gap-3 px-5 pt-4 pb-3">
                {tabs.length > 1
                    ? (
                        <div class="flex items-center gap-4 overflow-x-auto scrollbar-thin" role="tablist">
                            {tabs.map((t) => (
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={t.key === tab.key}
                                    onClick={() => {
                                        setActive(t.key);
                                        setExpanded(false);
                                    }}
                                    class={`text-[13px] whitespace-nowrap pb-0.5 border-b-2 transition-colors ${
                                        t.key === tab.key
                                            ? "font-semibold text-fg border-accent"
                                            : "text-fg-3 hover:text-fg-2 border-transparent"
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    )
                    : <h2 class="card-title">{tab.label}</h2>}
                <span class="eyebrow shrink-0">{tab.valueLabel}</span>
            </div>

            {tab.rows.length === 0 ? <p class="px-5 pb-6 pt-2 text-[13px] text-fg-3">No data for this period</p> : (
                <ul
                    class={`px-3 pb-2 space-y-0.5 ${expanded ? "max-h-[28rem] overflow-y-auto scrollbar-thin" : ""}`}
                >
                    {visible.map((row) => (
                        <li class="group relative flex items-center justify-between gap-4 h-8 px-2 rounded-md text-[13px] text-fg">
                            <span
                                class="absolute inset-y-0.5 left-0 rounded bg-accent/10 group-hover:bg-accent/15 transition-colors"
                                style={{ width: `${Math.max(1, (row.value / max) * 100)}%` }}
                                aria-hidden="true"
                            />
                            <RowLabel row={row} kind={tab.kind} />
                            <span class="relative flex items-baseline gap-2 shrink-0 tabular">
                                <span class="text-[11px] text-fg-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {formatPercent(total ? row.value / total : 0, 1)}
                                </span>
                                <span class="font-medium" title={formatExact(row.value)}>
                                    {formatNumber(row.value)}
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            {tab.rows.length > limit && (
                <div class="mt-auto px-5 py-2.5 border-t border-line">
                    <button
                        type="button"
                        class="text-xs text-fg-2 hover:text-fg"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? "Show less" : `Show all ${tab.rows.length}`}
                    </button>
                </div>
            )}
        </section>
    );
}
