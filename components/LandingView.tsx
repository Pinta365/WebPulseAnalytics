// deno-lint-ignore-file no-explicit-any
import { AddProject } from "../islands/AddProject.tsx";

interface LandingViewProps {
    projects?: any[];
    analytics?: any;
    mostActiveProject?: { name: string; pageLoads: number; sessions: number } | null;
}

// Color palette from Trends/History page
const metricColors = [
    "#2563eb", // blue
    "#10b981", // green
    "#6366f1", // purple
    "#f59e42", // orange
    "#14b8a6", // teal
];

function MetricCard({ icon, label, value, color }: { icon: string; label: string; value: any; color: string }) {
    return (
        <div class="card-metric">
            <div class="text-4xl mb-1">{icon}</div>
            <div class="text-4xl font-bold mb-1" style={{ color }}>{value}</div>
            <div class="text-base text-muted mb-1">{label}</div>
        </div>
    );
}

export function LandingView({ projects = [], analytics, mostActiveProject }: LandingViewProps) {
    // Stats from analytics or fallback
    const stats = [
        { icon: "📁", label: "Total Projects", value: projects.length, color: metricColors[0] },
        { icon: "👁️", label: "Recent Traffic", value: analytics?.pageLoads ?? 0, color: metricColors[2] },
        mostActiveProject
            ? {
                icon: "🔥",
                label: `Most Active: ${mostActiveProject.name || "N/A"}`,
                value: mostActiveProject.pageLoads + " loads",
                color: metricColors[3],
            }
            : { icon: "🔥", label: "Most Active Project", value: "N/A", color: metricColors[3] },
    ];

    return (
        <section class="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div class="my-10 text-left">
                <h1 class="text-4xl font-bold mb-2 text-primary">
                    Welcome to your Dashboard!
                </h1>
                <div class="text-muted text-lg">Here's your analytics at a glance.</div>
            </div>

            {/* Key Metrics */}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-9">
                {stats.map((stat) => (
                    <MetricCard icon={stat.icon} label={stat.label} value={stat.value} color={stat.color} />
                ))}
            </div>

            {/* Recent Activity & Add Project */}
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
                <div class="bg-card-light border-card-light rounded-xl p-5 flex flex-col text-primary">
                    <AddProject onProjectAdded={() => {}} onError={() => {}} />
                </div>
            </div>

            {/* Quick Navigation */}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                <a
                    href="/dashboard/realtime/all/30min"
                    class="card-nav"
                >
                    Real-Time Analysis
                </a>
                <a
                    href="/dashboard/trends/all/month?span=this-year"
                    class="card-nav"
                >
                    Trends & History
                </a>
                <a
                    href="/dashboard/settings"
                    class="card-nav"
                >
                    Settings
                </a>
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
