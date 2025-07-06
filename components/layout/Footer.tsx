export function Footer() {
    return (
        <footer class="bg-nav/80 py-4 mt-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-2">
                    <h6 class="text-lg font-semibold text-primary">Contact</h6>
                    <div class="space-y-1">
                        <a
                            href="mailto:hello&#64;webpulseanalytics&#46;com"
                            class="flex items-center space-x-2 text-sm text-secondary hover:text-primary"
                        >
                            <img
                                src="/img/svg/mail-filled.svg"
                                alt="email icon"
                                class="h-4 w-4 filter dark:invert"
                            />
                            <span>Send Email</span>
                        </a>
                        <a
                            href="https://github.com/Pinta365/WebPulseAnalytics"
                            target="_blank"
                            class="flex items-center space-x-2 text-sm text-secondary hover:text-primary"
                        >
                            <img
                                src="/img/svg/github.svg"
                                alt="github brand icon"
                                class="h-4 w-4 filter dark:invert"
                            />
                            <span>GitHub Repository</span>
                        </a>
                        <a
                            href="https://discord.gg/J7QtVxAt6F"
                            target="_blank"
                            class="flex items-center space-x-2 text-sm text-secondary hover:text-primary"
                        >
                            <img
                                src="/img/svg/discord.svg"
                                alt="discord brand icon"
                                class="h-4 w-4 filter dark:invert"
                            />
                            <span>Discord Server</span>
                        </a>
                    </div>
                </div>
                <div class="space-y-2">
                    <h6 class="text-lg font-semibold text-primary">About</h6>
                    <div class="space-y-1">
                        <a
                            href="/docs"
                            class="block text-sm text-secondary hover:text-primary"
                        >
                            Documentation
                        </a>
                        <a
                            href="https://developer.webpulseanalytics.com"
                            class="block text-sm text-secondary hover:text-primary"
                        >
                            Developer Docs
                        </a>
                        <a
                            href="/info/privacy"
                            class="block text-sm text-secondary hover:text-primary"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="https://github.com/Pinta365/WebPulseAnalytics/blob/main/LICENSE"
                            target="_blank"
                            class="block text-sm text-secondary hover:text-primary"
                        >
                            MIT License
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
