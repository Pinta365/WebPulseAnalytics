import { Head } from "$fresh/runtime.ts";
import { PublicShell } from "components/layout/Footer.tsx";

export default function Error403() {
    return (
        <>
            <Head>
                <title>403 - Closed Beta</title>
            </Head>
            <PublicShell>
                <div class="max-w-6xl mx-auto px-4 sm:px-6 py-24 flex flex-col items-center text-center">
                    <p class="text-6xl font-semibold tracking-tight text-fg-3">403</p>
                    <h1 class="mt-4 text-2xl font-semibold tracking-tight text-fg">Closed beta</h1>
                    <p class="mt-2 text-[13px] text-fg-2">WebPulse Analytics is currently in closed beta.</p>
                    <a href="/" class="btn-primary mt-8">Back to home</a>
                </div>
            </PublicShell>
        </>
    );
}
