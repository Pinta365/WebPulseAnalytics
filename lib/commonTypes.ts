export interface SessionUser {
    userId: string;
    displayName: string;
    avatar: string;
}

export interface ProviderProfile {
    name: string; //"Pinta"
    id: number; //19735646
    avatar_url?: string; //"https://avatars.githubusercontent.com/u/19735646?v=4"
}

export type SupportedProviders = "github"; //Add more providers.. google and apple?

export interface DBUser {
    userId: string | undefined;
    displayName: string;
    avatar?: string;
    primaryProvider?: SupportedProviders;
    providers: {
        [key in SupportedProviders]?: ProviderProfile;
    };
}

export interface ProjectOptions {
    pageLoads: {
        enabled: boolean;
        storeUserAgent: boolean;
    };
    pageClicks: {
        enabled: boolean;
        capureAllClicks: boolean;
    };
    pageScrolls: {
        enabled: boolean;
    };
}

export interface Project {
    id: string;
    ownerId: string;
    name: string;
    description?: string;
    allowedOrigins?: string[];
    options: ProjectOptions;
}

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
