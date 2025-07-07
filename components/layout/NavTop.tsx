import { SessionUser } from "lib/commonTypes.ts";
import { getConfig } from "lib/config.ts";

export function NavTop(data: SessionUser) {
    return (
        <nav class="w-full bg-nav border-b border-card shadow-sm">
            <div class="px-4 py-2 flex justify-between items-center">
                {/* Left: Logo */}
                <div>
                    <a href={getConfig().common.websiteBaseURL} class="flex items-center gap-2">
                        <img
                            src="/img/svg/logo-top.svg"
                            class="h-8 w-auto filter dark:invert"
                            alt="the webpulse logo"
                        />
                    </a>
                </div>
                {/* Right: User menu/avatar */}
                <div>
                    {data._id && (
                        <details class="relative" role="list">
                            <summary
                                class="cursor-pointer flex items-center space-x-2 px-3 py-2 rounded hover-nav"
                                aria-haspopup="listbox"
                                role="link"
                            >
                                {data.avatar
                                    ? (
                                        <img
                                            src={data.avatar}
                                            class="h-8 w-8 rounded-full border border-input"
                                            alt="the GitHub user avatar"
                                        />
                                    )
                                    : (
                                        <img
                                            src="/img/svg/user-circle.svg"
                                            class="h-8 w-8 filter dark:invert"
                                            alt="the GitHub user avatar"
                                        />
                                    )}
                            </summary>
                            <ul
                                class="dropdown-menu dropdown-menu-right"
                                role="listbox"
                            >
                                <li>
                                    <a
                                        href="/dashboard/settings"
                                        class="dropdown-item"
                                    >
                                        User Settings
                                    </a>
                                    <a
                                        href="/logout"
                                        class="dropdown-item"
                                    >
                                        Logout {data.displayName}
                                    </a>
                                </li>
                            </ul>
                        </details>
                    )}
                </div>
            </div>
        </nav>
    );
}
