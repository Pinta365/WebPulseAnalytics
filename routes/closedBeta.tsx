import { Head } from "$fresh/runtime.ts";
import { config } from "lib/config.ts";

export default function Error403() {
    return (
        <>
            <Head>
                <title>403 - Closed Beta</title>
            </Head>
            <div class="flex flex-col justify-center min-h-[80vh]">
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

                <div class="mx-auto text-center">
                    <h1 class="text-4xl font-bold text-primary mb-4">403 - Closed Beta</h1>
                    <p class="text-secondary text-lg">
                        WebPulse Analytics is currently in closed beta.
                    </p>
                </div>
            </div>
        </>
    );
}
