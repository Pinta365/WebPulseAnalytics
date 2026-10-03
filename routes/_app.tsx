import { PageProps } from "$fresh/server.ts";
import type { SessionUser } from "lib/commonTypes.ts";
import { AppShell } from "components/layout/AppShell.tsx";

export default function App({ Component, state, url }: PageProps<unknown, SessionUser>) {
    const inDashboard = !!state?._id && url.pathname.startsWith("/dashboard");
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="color-scheme" content="light dark" />
                <title>WebPulse Analytics</title>
                {/* Applies the stored theme before first paint to avoid a flash. */}
                <script src="/js/theme.js"></script>
                <link rel="stylesheet" href="/css/styles.css" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
                <script
                    async
                    src="https://track.webpulseanalytics.com/client/653eb35b048754e8b13f0771"
                    type="module"
                >
                </script>
            </head>
            <body>
                {inDashboard
                    ? (
                        <AppShell user={state} path={url.pathname}>
                            <Component />
                        </AppShell>
                    )
                    : <Component />}
            </body>
        </html>
    );
}
