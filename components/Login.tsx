export function Login() {
    return (
        <div class="container loginGrid">
            <img src="/img/svg/logo-top-slogan.svg" class="logo" alt="the webpulse logo" />
            <article class="grid">
                <div class="login">
                    <hgroup>
                        <h3>Sign in to WebPulse using GitHub</h3>
                        <p>
                            WebPulse Analytics is a streamlined web analytics solution. Using a simple client-side
                            script, effortlessly monitor page events and user behaviour. Tailored for intuitive
                            understanding, it offers deeper insight into user behavior.
                        </p>
                    </hgroup>
                    <a class="contrast w-100" role="button" href="/api/auth/github/login">
                        <img src="/img/svg/github.svg" alt="the GitHub logo" /> Sign in with GitHub
                    </a>
                </div>
                <div class="hero">
                </div>
            </article>
        </div>
    );
}
