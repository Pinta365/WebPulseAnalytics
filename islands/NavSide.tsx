import { useEffect, useState } from "preact/hooks";

export function NavSide() {
    const [currentPath, setCurrentPath] = useState("");

    useEffect(() => {
        setCurrentPath(globalThis.location.pathname);
    }, []);

    function handleClick(event: Event) {
        const targetElement = event.currentTarget as HTMLElement;
        setCurrentPath(targetElement.getAttribute("href") || "");
    }

    function isActive(href: string): boolean {
        return currentPath.startsWith(href);
    }

    return (
        <aside class="lg:fixed lg:w-48 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto">
            <nav class="w-full pb-4 lg:pb-0">
                <ul class="space-y-1">
                    <li>
                        <a
                            href="/dashboard"
                            onClick={handleClick}
                            class={`block py-2 px-3 text-sm rounded transition-colors ${
                                isActive("/dashboard") && !isActive("/dashboard/realtime") &&
                                    !isActive("/dashboard/trends") && !isActive("/dashboard/settings") &&
                                    !isActive("/dashboard/projects")
                                    ? "nav-active"
                                    : "text-secondary hover:text-primary hover-nav"
                            }`}
                        >
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a
                            href="/dashboard/realtime/all/30min"
                            onClick={handleClick}
                            class={`block py-2 px-3 text-sm rounded transition-colors ${
                                isActive("/dashboard/realtime")
                                    ? "nav-active"
                                    : "text-secondary hover:text-primary hover-nav"
                            }`}
                        >
                            Real-Time Analysis
                        </a>
                    </li>
                    <li>
                        <a
                            href="/dashboard/trends/all/month?span=this-year"
                            onClick={handleClick}
                            class={`block py-2 px-3 text-sm rounded transition-colors ${
                                isActive("/dashboard/trends")
                                    ? "nav-active"
                                    : "text-secondary hover:text-primary hover-nav"
                            }`}
                        >
                            Trends & History
                        </a>
                    </li>
                    <li>
                        <a
                            href="/dashboard/projects"
                            onClick={handleClick}
                            class={`block py-2 px-3 text-sm rounded transition-colors ${
                                isActive("/dashboard/projects")
                                    ? "nav-active"
                                    : "text-secondary hover:text-primary hover-nav"
                            }`}
                        >
                            Manage Projects
                        </a>
                    </li>
                    <li>
                        <a
                            href="/dashboard/settings"
                            onClick={handleClick}
                            class={`block py-2 px-3 text-sm rounded transition-colors ${
                                isActive("/dashboard/settings")
                                    ? "nav-active"
                                    : "text-secondary hover:text-primary hover-nav"
                            }`}
                        >
                            Settings
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
