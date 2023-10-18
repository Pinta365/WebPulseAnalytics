import { AppProps } from "$fresh/server.ts";

export default function App({ Component }: AppProps) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css" />
                <link rel="stylesheet" href="/css/styles.css" />
                <link rel="stylesheet" href="/css/nav.css" />
                <link rel="stylesheet" href="/css/footer.css" />
                <link rel="stylesheet" href="/css/login.css" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png">
                </link>

                <title>WebPulse Analytics</title>
            </head>
            <body>
                <Component />
            </body>
        </html>
    );
}
