// Get stats for selected project/view
export interface RealTimeStats {
    pageLoads: number;
    sessions: number;
    visitors: number;
    clicks: number;
    scrolls: number;
    history: unknown[]; /* ToDo: Should contain history */
}

// Period can either be named, or to/from
export interface RealTimePeriod {
    name: string | null;
    from: number | null; // Timestamp
    to: number | null; // Timestamp
}

export const RealTimePeriods = [
    "30min",
    "today",
    "yesterday",
];
