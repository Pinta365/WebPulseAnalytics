export interface SessionUser {
    _id: string;
    displayName: string;
    avatar: string;
}

// Get stats for selected project/view
export interface RealTimeStats {
    projectName?: string;
    pageLoads: number;
    sessions: number;
    visitors: number;
    clicks: number;
    scrolls: number;
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
