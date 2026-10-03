import type { Handlers, PageProps } from "$fresh/server.ts";
import { PageHeader } from "components/layout/AppShell.tsx";
import { Icon } from "components/ui/Icon.tsx";
import ThemeSwitcher from "islands/ThemeSwitcher.tsx";
import { getUserById, updateUser } from "lib/db.ts";
import LocaleSelector from "islands/LocaleSelector.tsx";

export const handler: Handlers = {
    async GET(_req, ctx) {
        // Fetch complete user data including settings from database
        const user = ctx.state;
        if (!user || !user._id) {
            return new Response("Unauthorized", { status: 401 });
        }

        // Get the complete user data from database
        const completeUser = await getUserById(user._id as string);

        return ctx.render({
            state: completeUser || user,
        });
    },
    async POST(req, ctx) {
        const { locale } = await req.json();
        const user = ctx.state;
        if (!user || !user._id) {
            return new Response("Unauthorized", { status: 401 });
        }
        const updated = await updateUser(user._id.toString(), {
            settings: Object.assign({}, user.settings, { locale }),
        });
        if (updated) {
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ success: false }), { status: 500 });
        }
    },
};

export default function SettingsPage({ data }: PageProps) {
    const { state } = data;
    return (
        <div class="max-w-2xl">
            <PageHeader title="Settings" subtitle="Your account and display preferences." />

            <div class="space-y-6">
                <section class="card">
                    <div class="card-header">
                        <h2 class="card-title">Profile</h2>
                    </div>
                    <div class="divide-y divide-line">
                        <div class="px-5 py-4 flex items-center gap-4">
                            {state.avatar
                                ? <img src={state.avatar} alt="" class="w-12 h-12 rounded-full border border-line" />
                                : <span class="w-12 h-12 rounded-full bg-sunken" />}
                            <div class="min-w-0">
                                <div class="text-[13px] font-medium text-fg truncate">{state.displayName}</div>
                                <div class="text-xs text-fg-3">Signed in with GitHub</div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="card">
                    <div class="card-header">
                        <h2 class="card-title">Appearance</h2>
                    </div>
                    <div class="divide-y divide-line">
                        <div class="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div class="min-w-0">
                                <div class="text-[13px] font-medium text-fg">Theme</div>
                                <p class="hint mt-0.5">"System" follows your operating system setting.</p>
                            </div>
                            <ThemeSwitcher />
                        </div>
                    </div>
                </section>

                <section class="card">
                    <div class="card-header">
                        <h2 class="card-title">Regional format</h2>
                    </div>
                    <div class="divide-y divide-line">
                        <div class="px-5 py-4">
                            <LocaleSelector initialLocale={state.settings?.locale || "en-US"} />
                        </div>
                    </div>
                </section>

                <section class="card">
                    <div class="card-header">
                        <h2 class="card-title">Privacy &amp; compliance</h2>
                    </div>
                    <div class="divide-y divide-line">
                        <div class="px-5 py-4 flex items-start gap-3">
                            <Icon name="shield" class="w-5 h-5 mt-0.5 shrink-0 text-fg-3" />
                            <p class="text-[13px] text-fg-2 leading-relaxed">
                                Ensure you comply with all relevant data protection and privacy regulations (e.g., GDPR,
                                CCPA). You are responsible for informing your users and updating your privacy policy as
                                needed. Read our <a href="/info/privacy" class="link">privacy policy</a>.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
