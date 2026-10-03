import type { ComponentChildren } from "preact";
import type { NavProject, SessionUser } from "lib/commonTypes.ts";
import { Brand, Icon, type IconName } from "components/ui/Icon.tsx";

interface NavItem {
    href: string;
    label: string;
    icon: IconName;
    /** Path prefix that marks the item active */
    match: (path: string) => boolean;
}

const NAV: NavItem[] = [
    {
        href: "/dashboard",
        label: "Overview",
        icon: "overview",
        match: (p) => p === "/dashboard" || p === "/dashboard/",
    },
    {
        href: "/dashboard/analytics/all",
        label: "Analytics",
        icon: "analytics",
        match: (p) => p === "/dashboard/analytics/all" || p.startsWith("/dashboard/analytics/all?"),
    },
    {
        href: "/dashboard/projects",
        label: "Projects",
        icon: "folder",
        match: (p) => p.startsWith("/dashboard/projects"),
    },
    {
        href: "/dashboard/settings",
        label: "Settings",
        icon: "settings",
        match: (p) => p.startsWith("/dashboard/settings"),
    },
];

function current(active: boolean) {
    return active ? "page" : undefined;
}

function SidebarContent({ user, path }: { user: SessionUser; path: string }) {
    const projects: NavProject[] = user.navProjects ?? [];
    return (
        <div class="flex flex-col h-full">
            <div class="px-4 h-14 flex items-center shrink-0">
                <Brand href="/dashboard" />
            </div>

            <nav class="px-3 pt-2 space-y-0.5" aria-label="Main">
                {NAV.map((item) => (
                    <a href={item.href} class="nav-link" aria-current={current(item.match(path))}>
                        <Icon name={item.icon} />
                        {item.label}
                    </a>
                ))}
            </nav>

            <div class="px-3 mt-6 flex-1 min-h-0 flex flex-col">
                <div class="px-2.5 mb-1.5 flex items-center justify-between">
                    <span class="eyebrow">Sites</span>
                    <a href="/dashboard/projects#new" class="icon-btn w-6 h-6" title="Add a project">
                        <Icon name="plus" class="w-3.5 h-3.5" />
                    </a>
                </div>
                <nav class="space-y-0.5 overflow-y-auto scrollbar-thin -mx-1 px-1 pb-2" aria-label="Sites">
                    {projects.length === 0 && <p class="px-2.5 py-1 text-xs text-fg-3">No projects yet</p>}
                    {projects.map((p) => {
                        const href = `/dashboard/analytics/${p.id}`;
                        return (
                            <a
                                href={href}
                                class="nav-link"
                                aria-current={current(path.startsWith(href))}
                                title={p.name}
                            >
                                <span class="w-4 flex justify-center">
                                    <span class="w-1.5 h-1.5 rounded-full bg-fg-3/60" />
                                </span>
                                <span class="truncate">{p.name}</span>
                            </a>
                        );
                    })}
                </nav>
            </div>

            <div class="p-3 border-t border-line">
                <details class="relative">
                    <summary class="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-sunken cursor-pointer transition-colors">
                        {user.avatar
                            ? <img src={user.avatar} alt="" class="w-7 h-7 rounded-full border border-line" />
                            : <span class="w-7 h-7 rounded-full bg-sunken" />}
                        <span class="flex-1 min-w-0 text-[13px] font-medium truncate">{user.displayName}</span>
                        <Icon name="chevronUpDown" class="w-3.5 h-3.5 text-fg-3" />
                    </summary>
                    <div class="menu bottom-full mb-1.5 left-0 right-0 min-w-0">
                        <a href="/dashboard/settings" class="menu-item">
                            <Icon name="settings" /> Settings
                        </a>
                        <a
                            href="https://developer.webpulseanalytics.com"
                            class="menu-item"
                            target="_blank"
                            rel="noopener"
                        >
                            <Icon name="book" /> Developer docs
                        </a>
                        <div class="menu-sep" />
                        <a href="/logout" class="menu-item">
                            <Icon name="logout" /> Sign out
                        </a>
                    </div>
                </details>
            </div>
        </div>
    );
}

export function AppShell({ user, path, children }: { user: SessionUser; path: string; children: ComponentChildren }) {
    return (
        <div class="min-h-screen lg:pl-60">
            {/* Desktop sidebar */}
            <aside class="hidden lg:block fixed inset-y-0 left-0 w-60 bg-surface border-r border-line z-30">
                <SidebarContent user={user} path={path} />
            </aside>

            {/* Mobile top bar + drawer */}
            <details class="lg:hidden sticky top-0 z-40 group">
                <summary class="h-14 px-4 flex items-center justify-between bg-surface/90 backdrop-blur border-b border-line cursor-pointer">
                    <span class="pointer-events-none">
                        <Brand href="/dashboard" />
                    </span>
                    <span class="icon-btn" aria-label="Toggle navigation">
                        <span class="group-open:hidden">
                            <Icon name="menu" class="w-5 h-5" />
                        </span>
                        <span class="hidden group-open:inline">
                            <Icon name="close" class="w-5 h-5" />
                        </span>
                    </span>
                </summary>
                <div class="fixed inset-x-0 top-14 bottom-0 bg-surface border-t border-line overflow-y-auto">
                    <SidebarContent user={user} path={path} />
                </div>
            </details>

            <main class="px-4 sm:px-6 lg:px-10 py-6 lg:py-8 max-w-[1280px] mx-auto">
                {children}
            </main>
        </div>
    );
}

/** Page heading row used at the top of every dashboard page. */
export function PageHeader(
    { title, subtitle, children }: {
        title: ComponentChildren;
        subtitle?: ComponentChildren;
        children?: ComponentChildren;
    },
) {
    return (
        <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div class="min-w-0">
                <h1 class="text-2xl font-semibold tracking-tight text-fg">{title}</h1>
                {subtitle && <p class="mt-1 text-[13px] text-fg-2">{subtitle}</p>}
            </div>
            {children && <div class="flex flex-wrap items-center gap-2">{children}</div>}
        </header>
    );
}
