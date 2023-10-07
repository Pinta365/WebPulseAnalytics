import { SessionUser } from "lib/commonTypes.ts";
import { config } from "lib/config.ts";

export function NavTop(data: SessionUser) {
    return (
        <nav class="container-fluid">
            <ul>
                <li>
                    <a href={config.common.websiteBaseURL} class="contrast">
                        <img src="/img/svg/logo-top.svg" class="top-logo" alt="the webpulse logo" />
                    </a>
                </li>
            </ul>
            <ul>
                {data.userId && /* If we are logged in, present menu */
                    <li>
                        <details role="list" dir="rtl">
                            <summary aria-haspopup="listbox" role="link" class="secondary">
                                {data.avatar
                                    ? (
                                        <img
                                            src={data.avatar}
                                            class="user-avatar"
                                            alt="the GitHub user avatar"
                                        />
                                    )
                                    : (
                                        <img
                                            src="/img/svg/user-circle.svg"
                                            class="icon"
                                            alt="the GitHub user avatar"
                                        />
                                    )}
                            </summary>
                            <ul role="listbox">
                                <li>
                                    <a href="#">User Settings</a>
                                    <a href="/logout">Logout {data.displayName}</a>
                                </li>
                            </ul>
                        </details>
                    </li>}
                <li>
                    <details role="list" dir="rtl">
                        <summary aria-haspopup="listbox" role="link" class="secondary">
                            <img
                                src="/img/svg/yin-yang-filled.svg"
                                class="icon"
                                alt="dark/light mode selector"
                            />
                        </summary>
                        <ul role="listbox">
                            <li>
                                <a href="#" data-theme-switcher="auto">Auto</a>
                            </li>
                            <li>
                                <a href="#" data-theme-switcher="light">Light mode</a>
                            </li>
                            <li>
                                <a href="#" data-theme-switcher="dark">Dark mode</a>
                            </li>
                        </ul>
                    </details>
                </li>
            </ul>
        </nav>
    );
}
