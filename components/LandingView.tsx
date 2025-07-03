import { AddProject } from "../islands/AddProject.tsx";
import Sparkline from "../islands/Sparkline.tsx";
import { h } from "preact";

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
        <div
            class="metric-card"
            style={{
                background: "rgba(255,255,255,0.03)",
                borderRadius: "1rem",
                boxShadow: "0 2px 12px 0 rgba(0,0,0,0.10)",
                padding: "1.2rem 1.2rem 0.7rem 1.2rem",
                minWidth: 140,
                maxWidth: 180,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
            }}
        >
            <div style={{ fontSize: "2.2rem", marginBottom: "0.2rem" }}>{icon}</div>
            <div style={{ fontSize: "2.1rem", fontWeight: 700, color, marginBottom: "0.2rem" }}>{value}</div>
            <div style={{ fontSize: "1rem", color: "#aaa", marginBottom: "0.2rem" }}>{label}</div>
        </div>
    );
}

function ProjectCard({ project }: { project: any }) {
    return (
        <a
            href="/dashboard/projects"
            class="card"
            style={{
                padding: "1em 1.2em",
                borderRadius: "0.8em",
                background: "rgba(255,255,255,0.02)",
                boxShadow: "0 1px 6px 0 rgba(0,0,0,0.08)",
                marginBottom: "0.5em",
                display: "block",
                textDecoration: "none",
                color: "inherit",
            }}
        >
            <div style={{ fontWeight: 600, fontSize: "1.1em" }}>{project.name}</div>
            {project.description && <div style={{ color: "#aaa", fontSize: "0.95em" }}>{project.description}</div>}
        </a>
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
        <section style={{ maxWidth: "1000px", margin: "0 auto" }}>
            {/* Hero Section */}
            <div style={{ margin: "2.5em 0 1.5em 0", textAlign: "left" }}>
                <h1 style={{ fontSize: "2.2em", fontWeight: 700, marginBottom: "0.2em" }}>
                    Welcome to your Dashboard!
                </h1>
                <div style={{ color: "#888", fontSize: "1.1em" }}>Here's your analytics at a glance.</div>
            </div>

            {/* Key Metrics */}
            <div
                class="grid"
                style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "1.2em",
                    marginBottom: "2.2em",
                }}
            >
                {stats.map((stat) => (
                    <MetricCard icon={stat.icon} label={stat.label} value={stat.value} color={stat.color} />
                ))}
            </div>

            {/* Recent Activity & Add Project */}
            <div
                class="grid"
                style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: "2em", alignItems: "start", marginBottom: "2em" }}
            >
                <div class="card" style={{ padding: "1.2em", display: "flex", flexDirection: "column" }}>
                    <AddProject />
                </div>
            </div>

            {/* Quick Navigation */}
            <div
                class="grid"
                style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "1.2em",
                    marginBottom: "2em",
                }}
            >
                <a
                    href="/dashboard/realtime/all/30min"
                    class="card"
                    style={{ padding: "1.2em", textAlign: "center", fontWeight: 600, fontSize: "1.1em" }}
                >
                    Real-Time Analysis
                </a>
                <a
                    href="/dashboard/trends/all/month?span=this-year"
                    class="card"
                    style={{ padding: "1.2em", textAlign: "center", fontWeight: 600, fontSize: "1.1em" }}
                >
                    Trends & History
                </a>
                <a
                    href="/dashboard/settings"
                    class="card"
                    style={{ padding: "1.2em", textAlign: "center", fontWeight: 600, fontSize: "1.1em" }}
                >
                    Settings
                </a>
            </div>

            {/* Compliance Reminder */}
            <div
                class="card"
                style={{
                    background: "#232323",
                    color: "#bbb",
                    padding: "1em",
                    fontSize: "0.97em",
                    marginTop: "2em",
                    borderRadius: "0.7em",
                }}
            >
                <strong>Reminder:</strong>{" "}
                Ensure you comply with all relevant data protection and privacy regulations (e.g., GDPR, CCPA). You are
                responsible for informing your users and updating your privacy policy as needed.
            </div>
        </section>
    );
}
