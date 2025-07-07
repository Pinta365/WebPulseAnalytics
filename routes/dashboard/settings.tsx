import type { Handlers, PageProps } from "$fresh/server.ts";
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
        } as any);
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
        <section class="py-8 px-6 flex justify-left items-start w-full">
            <div class="w-full max-w-lg">
                <h1 class="text-4xl font-bold mb-2 text-primary">Settings</h1>
                <div class="text-secondary mb-8">
                    <div class="card-light border-card-light rounded-xl p-6 text-primary">
                        <img
                            src={state.avatar}
                            alt={state.displayName}
                            class="w-24 h-24 rounded-full mb-4 border-4 border-card-light shadow"
                        />
                        <h2 class="text-xl font-semibold mb-3 text-primary">
                            {state.displayName}
                        </h2>
                        <div class="mt-6">
                            <label class="font-semibold text-lg mb-2 block text-primary">
                                Theme
                            </label>
                            <ThemeSwitcher />
                            <div class="text-muted text-sm mt-2">
                                "Auto" follows your system preference.
                            </div>
                        </div>
                        <LocaleSelector initialLocale={state.settings?.locale || "en-US"} />
                    </div>
                    Manage your account and preferences. More settings coming soon!
                </div>
            </div>
        </section>
    );
}
