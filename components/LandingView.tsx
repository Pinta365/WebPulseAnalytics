// deno-lint-ignore-file no-explicit-any
import { AddProject } from "../islands/AddProject.tsx";
import Sparkline from "islands/Sparkline.tsx";

interface LandingViewProps {
    projects?: any[];
    analytics?: any;
    mostActiveProject?: { id: string; name: string; pageLoads: number; sessions: number } | null;
}

// Color palette from Trends/History page
const metricColors = [
    "#2563eb", // blue
    "#10b981", // green
    "#6366f1", // purple
    "#f59e42", // orange
    "#14b8a6", // teal
];

function MetricCard(
    { label, value, color, href, sparklineData }: {
        label: string;
        value: any;
        color: string;
        href?: string;
        sparklineData?: number[];
    },
) {
    const content = (
        <div class="card-metric cursor-pointer hover:shadow-lg transition-shadow">
            <div class="text-4xl font-bold mb-1" style={{ color }}>{value}</div>
            <div class="text-xs mb-2 text-secondary font-medium">
                {label}
            </div>
            {sparklineData && sparklineData.length > 0 && (
                <Sparkline data={sparklineData} color={color} height={32} width={120} />
            )}
            {href && (
                <div class="text-xs mt-2 text-secondary hover:text-primary">
                    View Details &rarr;
                </div>
            )}
        </div>
    );
    return href
        ? <a href={href} class="block no-underline transition-transform duration-200 hover:scale-105">{content}</a>
        : content;
}

export function LandingView({ projects = [], analytics, mostActiveProject }: LandingViewProps) {
    // Generate some sample sparkline data for demo purposes
    const generateSparklineData = (base: number) => {
        return Array.from({ length: 7 }, () => base + Math.floor(Math.random() * 20) - 10);
    };

    // Stats from analytics or fallback - now with sparklines
    const stats = [
        {
            label: "Total Projects",
            value: projects.length,
            color: metricColors[0],
            href: "/dashboard/projects",
            sparklineData: generateSparklineData(projects.length),
        },
        {
            label: "Page Loads",
            value: analytics?.pageLoads ?? 0,
            color: metricColors[1],
            href: "/dashboard/trends/all/month?span=this-year",
            sparklineData: generateSparklineData(analytics?.pageLoads ?? 0),
        },
        {
            label: "Sessions",
            value: analytics?.sessions ?? 0,
            color: metricColors[2],
            href: "/dashboard/trends/all/month?span=this-year",
            sparklineData: generateSparklineData(analytics?.sessions ?? 0),
        },
        mostActiveProject
            ? {
                label: `Most Active: ${mostActiveProject.name || "N/A"}`,
                value: mostActiveProject.pageLoads,
                color: metricColors[3],
                href: mostActiveProject.id
                    ? `/dashboard/trends/${encodeURIComponent(mostActiveProject.id)}/month?span=this-year`
                    : undefined,
                sparklineData: generateSparklineData(mostActiveProject.pageLoads),
            }
            : {
                label: "Most Active Project",
                value: 0,
                color: metricColors[3],
                sparklineData: generateSparklineData(0),
            },
        {
            label: "Active Users",
            value: Math.floor((analytics?.sessions ?? 0) * 0.7),
            color: metricColors[4],
            href: "/dashboard/trends/all/month?span=this-year",
            sparklineData: generateSparklineData(Math.floor((analytics?.sessions ?? 0) * 0.7)),
        },
    ];

    return (
        <section class="max-w-6xl mx-auto pb-10">
            {/* Hero Section */}
            <div class="my-10 text-left">
                <h1 class="text-4xl font-bold mb-2 text-primary">
                    Welcome to your Dashboard!
                </h1>
                <div class="text-muted text-lg">Here's your analytics at a glance.</div>
            </div>

            {/* Section Title */}
            <div class="mb-6">
                <h2 class="text-xl font-semibold text-primary mb-2">
                    Dashboard Overview
                </h2>
                <div class="text-secondary text-sm mb-2">
                    Key metrics and performance indicators • Last 7 days
                </div>
            </div>

            {/* Key Metrics */}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-9">
                {stats.map((stat) => (
                    <MetricCard
                        label={stat.label}
                        value={stat.value}
                        color={stat.color}
                        href={stat.href}
                        sparklineData={stat.sparklineData}
                    />
                ))}
            </div>

            {/* Add Project Section */}
            <div class="mb-8">
                <h3 class="text-lg font-semibold text-primary mb-4">Project Management</h3>
                <div class="bg-card-light border-card-light rounded-xl p-6 flex flex-col text-primary">
                    <div class="flex items-center mb-4">
                        <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                            <svg
                                class="w-5 h-5 text-blue-600 dark:text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                >
                                </path>
                            </svg>
                        </div>
                        <div>
                            <h4 class="font-semibold text-lg">Add New Project</h4>
                            <p class="text-sm text-muted">Start tracking analytics for a new website or application</p>
                        </div>
                    </div>
                    <AddProject onProjectAdded={() => {}} onError={() => {}} />
                </div>
            </div>

            {/* Quick Navigation */}
            <div class="mb-8">
                <h3 class="text-lg font-semibold text-primary mb-4">Quick Actions</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <a
                        href="/dashboard/realtime/all/30min"
                        class="card-nav group"
                    >
                        <div class="flex items-center justify-center mb-2">
                            <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                <svg
                                    class="w-4 h-4 text-blue-600 dark:text-blue-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    >
                                    </path>
                                </svg>
                            </div>
                        </div>
                        <div class="font-semibold">Real-Time Analysis</div>
                        <div class="text-sm text-muted mt-1">Live monitoring & insights</div>
                    </a>
                    <a
                        href="/dashboard/trends/all/month?span=this-year"
                        class="card-nav group"
                    >
                        <div class="flex items-center justify-center mb-2">
                            <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                <svg
                                    class="w-4 h-4 text-green-600 dark:text-green-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    >
                                    </path>
                                </svg>
                            </div>
                        </div>
                        <div class="font-semibold">Trends & History</div>
                        <div class="text-sm text-muted mt-1">Historical data & patterns</div>
                    </a>
                    <a
                        href="/dashboard/settings"
                        class="card-nav group"
                    >
                        <div class="flex items-center justify-center mb-2">
                            <div class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                                <svg
                                    class="w-4 h-4 text-purple-600 dark:text-purple-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    >
                                    </path>
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    >
                                    </path>
                                </svg>
                            </div>
                        </div>
                        <div class="font-semibold">Settings</div>
                        <div class="text-sm text-muted mt-1">Configure your preferences</div>
                    </a>
                </div>
            </div>

            {/* Compliance Reminder */}
            <div class="bg-card-light text-primary p-4 text-sm mt-8 rounded-xl">
                <strong>Reminder:</strong>{" "}
                Ensure you comply with all relevant data protection and privacy regulations (e.g., GDPR, CCPA). You are
                responsible for informing your users and updating your privacy policy as needed.
            </div>
        </section>
    );
}
