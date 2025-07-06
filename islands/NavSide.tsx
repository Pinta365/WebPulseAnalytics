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

    function shouldBeOpen(sectionLinks: string[]): boolean {
        return sectionLinks.some((link) => isActive(link));
    }

    return (
        <aside class="lg:fixed lg:w-48 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto">
            <nav class="w-full pb-4 lg:pb-0">
                <details class="pb-0 border-b-0" open={shouldBeOpen(["/dashboard/realtime"])}>
                    <summary class="pb-2 text-primary font-light text-sm uppercase cursor-pointer">
                        Real-Time Analysis
                    </summary>
                    <ul class="pl-1">
                        <li class="pt-0 pb-0 text-base">
                            <a
                                href="/dashboard/realtime/all/30min"
                                onClick={handleClick}
                                class={`block py-1 px-3 text-xs rounded ${
                                    isActive("/dashboard/realtime")
                                        ? "nav-active"
                                        : "text-secondary hover:text-primary hover-nav"
                                }`}
                            >
                                Real-Time Dashboard
                            </a>
                        </li>
                    </ul>
                </details>
                <details class="pb-0 border-b-0" open={shouldBeOpen(["/dashboard/trends"])}>
                    <summary class="pb-2 text-primary font-light text-sm uppercase cursor-pointer">
                        Trends & History
                    </summary>
                    <ul class="pl-1">
                        <li class="pt-0 pb-0 text-base">
                            <a
                                href="/dashboard/trends/all/month?span=this-year"
                                onClick={handleClick}
                                class={`block py-1 px-3 text-xs rounded ${
                                    isActive("/dashboard/trends")
                                        ? "nav-active"
                                        : "text-secondary hover:text-primary hover-nav"
                                }`}
                            >
                                Trends & History
                            </a>
                        </li>
                    </ul>
                </details>
                <details class="pb-0 border-b-0" open={shouldBeOpen(["/dashboard/settings", "/dashboard/projects"])}>
                    <summary class="pb-2 text-primary font-light text-sm uppercase cursor-pointer">
                        Settings
                    </summary>
                    <ul class="pl-1">
                        <li class="pt-0 pb-0 text-base">
                            <a
                                href="/dashboard/settings"
                                onClick={handleClick}
                                class={`block py-1 px-3 text-xs rounded ${
                                    isActive("/dashboard/settings")
                                        ? "nav-active"
                                        : "text-secondary hover:text-primary hover-nav"
                                }`}
                            >
                                User Settings
                            </a>
                        </li>
                        <li class="pt-0 pb-0 text-base">
                            <a
                                href="/dashboard/projects"
                                onClick={handleClick}
                                class={`block py-1 px-3 text-xs rounded ${
                                    isActive("/dashboard/projects")
                                        ? "nav-active"
                                        : "text-secondary hover:text-primary hover-nav"
                                }`}
                            >
                                Manage Projects
                            </a>
                        </li>
                    </ul>
                </details>
            </nav>
        </aside>
    );
}
