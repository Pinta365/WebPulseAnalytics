export function NavSide() {
    let currentPage: HTMLElement | null = null;

    function handleClick(event: Event) {
        if (currentPage) {
            currentPage.removeAttribute("aria-current");
            (currentPage.closest("details") as HTMLElement).removeAttribute("open");
        }
        const targetElement = event.currentTarget as HTMLElement;
        targetElement.setAttribute("aria-current", "page");
        (targetElement.closest("details") as HTMLElement).setAttribute("open", "true");
        currentPage = targetElement;
    }

    return (
        <aside>
            <nav id="side-menu" class="closed-on-mobile">
                <a href="./" class="secondary" id="toggle-docs-navigation">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="expand"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        height="16px"
                    >
                        <title>Expand</title>
                        <path
                            fill-rule="evenodd"
                            d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zM7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10z"
                        >
                        </path>
                    </svg>{" "}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="collapse"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        height="16px"
                    >
                        <title>Collapse</title>
                        <path
                            fill-rule="evenodd"
                            d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zm7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0zm-.5 11.707l-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0v-3.793z"
                        >
                        </path>
                    </svg>{" "}
                    Page menu
                </a>
                <details>
                    <summary>Real-Time Analysis</summary>
                    <ul>
                        <li>
                            <a
                                href="/dashboard/realtime/all/30min"
                                id="start-link"
                                onClick={handleClick}
                                class="secondary"
                            >
                                Real-Time Dashboard
                            </a>
                        </li>
                    </ul>
                </details>
                <details>
                    <summary>Insights</summary>
                    <ul>
                        <li>
                            <a href="#" onClick={handleClick} class="secondary">subMenu 2.1</a>
                        </li>
                        <li>
                            <a href="/dashboard/test" onClick={handleClick} class="secondary">subMenu 2.2</a>
                        </li>
                        <li>
                            <a href="#" onClick={handleClick} class="secondary">subMenu 2.3</a>
                        </li>
                    </ul>
                </details>
                <details>
                    <summary>Manage Settings</summary>
                    <ul>
                        <li>
                            <a href="/dashboard/projects" onClick={handleClick} class="secondary">Manage Projects</a>
                        </li>
                    </ul>
                </details>
            </nav>
        </aside>
    );
}
