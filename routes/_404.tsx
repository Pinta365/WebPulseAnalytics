import { Head } from "$fresh/runtime.ts";
import { config } from "lib/config.ts";

export default function Error404() {
    return (
        <>
            <Head>
                <title>404 - Page not found</title>
            </Head>
            <div class="container loginGrid">
                <a href={config.common.websiteBaseURL} class="contrast">
                    <img src="/img/svg/logo-top-slogan.svg" class="logo" alt="the webpulse logo" />
                </a>

                <div class="container">
                    <h1>404 - Page not found</h1>
                </div>
            </div>
        </>
    );
}
