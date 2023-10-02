import { AppProps } from "$fresh/server.ts";

export default function App({ Component }: AppProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css"
        >
        </link>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png"></link>
        <link rel="stylesheet" href="/css/styles.css" />
        <title>WebTrace Stats</title>        
      </head>
      <body>
        <Component />        
      </body>
      
    </html>
  );
}
