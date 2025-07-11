export function Login() {
    return (
        <div class="container mx-auto flex flex-col justify-center min-h-[calc(90vh-9rem)] bg-body">
            <img
                src="/img/svg/logo-top-slogan.svg"
                class="w-96 pb-8 filter dark:invert mx-auto"
                alt="the webpulse logo"
            />
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div class="space-y-6 p-6">
                    <div class="space-y-2">
                        <h3 class="text-2xl font-bold text-primary">
                            Sign in to WebPulse using GitHub
                        </h3>
                        <p class="text-secondary">
                            WebPulse Analytics is a streamlined web analytics solution. Using a simple client-side
                            script, effortlessly monitor page events and user behaviour. Tailored for intuitive
                            understanding, it offers deeper insight into user behavior.
                        </p>
                    </div>
                    <a
                        class="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium rounded-md transition-colors duration-200 bg-card-light text-primary hover:bg-hover-card"
                        role="button"
                        href="/api/auth/github/login"
                    >
                        <svg
                            class="h-6 w-6 mr-3"
                            viewBox="0 0 24 24"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill="currentColor"
                                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                            >
                            </path>
                        </svg>{" "}
                        Sign in with GitHub
                    </a>
                </div>
                <div
                    class="hidden lg:block bg-cover bg-center bg-no-repeat rounded-lg"
                    style="background-image: url('/img/login.webp')"
                >
                </div>
            </div>
        </div>
    );
}
