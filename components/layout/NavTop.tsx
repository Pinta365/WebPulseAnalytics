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
                {data._id && /* If we are logged in, present menu */
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
                                    <a href="/dashboard/settings">User Settings</a>
                                    <a href="/logout">Logout {data.displayName}</a>
                                </li>
                            </ul>
                        </details>
                    </li>}
            </ul>
        </nav>
    );
}
