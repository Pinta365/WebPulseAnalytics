import { Head } from "$fresh/runtime.ts";
import { config } from "lib/config.ts";

export default function Error404() {
    return (
        <>
            <Head>
                <title>404 - Page not found</title>
            </Head>
            <div class="container mx-auto px-4 flex flex-col justify-center min-h-[calc(100vh-9rem)] py-4">
                <a
                    href={config.common.websiteBaseURL}
                    class="text-secondary hover:text-primary"
                >
                    <img
                        src="/img/svg/logo-top-slogan.svg"
                        class="w-96 pb-8 filter dark:invert mx-auto"
                        alt="the webpulse logo"
                    />
                </a>

                <div class="container mx-auto text-center">
                    <h1 class="text-4xl font-bold text-primary mb-4">404 - Page not found</h1>
                    <p class="text-secondary">The page you're looking for doesn't exist.</p>
                </div>
            </div>
        </>
    );
}
