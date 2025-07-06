import { PageProps } from "$fresh/server.ts";
import { NavTop } from "components/layout/NavTop.tsx";
import { NavSide } from "islands/NavSide.tsx";
import { Footer } from "components/layout/Footer.tsx";

export default function App({ Component, ...props }: PageProps) {
    const { state } = props.data || {};
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="/css/styles.css" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
                <script async src="https://track.webpulseanalytics.com/client/653eb35b048754e8b13f0771" type="module">
                </script>
                <title>WebPulse Analytics</title>
                <script src="/js/theme.js"></script>
            </head>
            <body class="min-h-screen flex flex-col bg-body">
                <div class="layout-container">
                    {state?._id
                        ? (
                            <div>
                                <NavTop {...state} />
                                <div class="layout-content">
                                    <aside class="layout-sidebar">
                                        <NavSide />
                                    </aside>
                                    <main class="layout-main">
                                        <Component {...props.data} />
                                    </main>
                                </div>
                            </div>
                        )
                        : (
                            <div>
                                <main class="layout-main">
                                    <Component {...props.data} />
                                </main>
                            </div>
                        )}
                    <Footer />
                </div>
            </body>
        </html>
    );
}
