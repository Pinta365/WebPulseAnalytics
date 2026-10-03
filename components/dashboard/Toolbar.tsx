import { Icon } from "components/ui/Icon.tsx";
import { type DateRange, RANGE_OPTIONS, type RangeKey } from "lib/ranges.ts";
import { formatNumber } from "lib/format.ts";
import type { BotInfo } from "lib/dashboard.ts";

function Check({ on }: { on: boolean }) {
    return (
        <span class="w-4 shrink-0 text-accent">
            {on && <Icon name="check" class="w-4 h-4" />}
        </span>
    );
}

export function ProjectSwitcher(
    { projects, currentId, hrefFor }: {
        projects: { id: string; name: string }[];
        currentId: string | null;
        hrefFor: (id: string) => string;
    },
) {
    const current = projects.find((p) => p.id === currentId);
    return (
        <details class="relative">
            <summary class="btn-secondary cursor-pointer max-w-[16rem]">
                <Icon name="globe" class="w-4 h-4 text-fg-3" />
                <span class="truncate">{current ? current.name : "All projects"}</span>
                <Icon name="chevronDown" class="w-3.5 h-3.5 text-fg-3" />
            </summary>
            <div class="menu left-0">
                <a href={hrefFor("all")} class="menu-item" aria-current={currentId === null ? "true" : undefined}>
                    <Check on={currentId === null} />
                    All projects
                </a>
                <div class="menu-sep" />
                {projects.map((p) => (
                    <a href={hrefFor(p.id)} class="menu-item" aria-current={p.id === currentId ? "true" : undefined}>
                        <Check on={p.id === currentId} />
                        <span class="truncate">{p.name}</span>
                    </a>
                ))}
            </div>
        </details>
    );
}

export function RangePicker({ range, hrefFor }: { range: DateRange; hrefFor: (key: RangeKey) => string }) {
    // Visual groups: real-time, rolling days, calendar.
    const groups: RangeKey[][] = [["30m", "today", "yesterday"], ["7d", "30d", "90d"], ["ytd", "12m", "last-year"]];
    return (
        <details class="relative">
            <summary class="btn-secondary cursor-pointer">
                <Icon name="analytics" class="w-4 h-4 text-fg-3" />
                {range.label}
                <Icon name="chevronDown" class="w-3.5 h-3.5 text-fg-3" />
            </summary>
            <div class="menu right-0 sm:left-auto">
                {groups.map((keys, gi) => (
                    <>
                        {gi > 0 && <div class="menu-sep" />}
                        {keys.map((k) => {
                            const opt = RANGE_OPTIONS.find((o) => o.key === k)!;
                            return (
                                <a
                                    href={hrefFor(k)}
                                    class="menu-item"
                                    aria-current={k === range.key ? "true" : undefined}
                                >
                                    <Check on={k === range.key} />
                                    {opt.label}
                                </a>
                            );
                        })}
                    </>
                ))}
            </div>
        </details>
    );
}

/** Pill showing distinct visitors active in the last few minutes. */
export function LiveBadge({ count, href }: { count: number; href?: string }) {
    const body = (
        <>
            <span class={count > 0 ? "live-dot" : "w-2 h-2 rounded-full bg-fg-3/50"} />
            <span class="tabular font-semibold text-fg">{formatNumber(count)}</span>
            <span class="text-fg-2">{count === 1 ? "visitor" : "visitors"} right now</span>
        </>
    );
    const cls = "inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-line bg-surface text-[13px]";
    return href
        ? (
            <a href={href} class={`${cls} hover:bg-sunken transition-colors`} title="Active in the last 5 minutes">
                {body}
            </a>
        )
        : <span class={cls} title="Active in the last 5 minutes">{body}</span>;
}

/**
 * Shows how much automated traffic is filtered out, and switches it in or out.
 * Bots are excluded by default; `href` points at the opposite state.
 */
export function BotToggle({ bots, href }: { bots: BotInfo; href: string }) {
    const count = formatNumber(bots.sessions);
    if (bots.included) {
        return (
            <a
                href={href}
                class="btn-secondary border-accent/50 bg-accent/10 hover:bg-accent/15"
                title="Bot and crawler sessions are included in every number on this page. Click to hide them."
            >
                <Icon name="bot" class="w-4 h-4 text-accent" />
                Including {count} bot sessions
                <Icon name="close" class="w-3.5 h-3.5 text-fg-3" />
            </a>
        );
    }
    return (
        <a
            href={href}
            class="btn-secondary text-fg-2"
            title="Sessions from crawlers, spiders and headless browsers are excluded. Click to include them."
        >
            <Icon name="bot" class="w-4 h-4 text-fg-3" />
            {count} bots hidden
        </a>
    );
}
