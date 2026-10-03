import { PublicShell } from "components/layout/Footer.tsx";

export default function Privacy() {
    return (
        <PublicShell>
            <div class="max-w-3xl mx-auto px-4 sm:px-6 py-12 prose-page">
                <h1 class="text-2xl font-semibold tracking-tight text-fg">Privacy Policy</h1>
                <p class="mt-3">
                    WebPulse Analytics is a streamlined web analytics solution designed for effortless monitoring of
                    page events and user behavior through a simple client-side script. Tailored for intuitive
                    understanding, our tool offers deeper insight into user interactions on your website, empowering you
                    to optimize your online presence.
                </p>

                <section>
                    <h2>Your Privacy is Our Priority</h2>
                    <p>
                        At WebPulse Analytics, we hold a strong commitment to safeguarding user privacy. Our
                        administrative dashboard operates solely on functional cookies for essential purposes such as
                        retaining language preferences and maintaining active sessions.
                    </p>
                    <p>
                        No cookies are being created by the client-side script that you implement on your tracked
                        projects. This ensures no bloat or unnecessary data being stored.
                    </p>
                </section>

                <section>
                    <h2>Customizable Data Collection</h2>
                    <p>
                        Understanding the importance of data privacy, we've designed WebPulse Analytics to only collect
                        the data you opt into during the setup of your website project within our system. This
                        customizable data collection approach ensures that you have full control over the data being
                        gathered, aligning with your privacy preferences and compliance requirements.
                    </p>
                </section>

                <section>
                    <h2>Anonymous Data Processing</h2>
                    <p>
                        The data collected via the client-side script is anonymized to uphold the highest standards of
                        privacy and data protection. Our objective is to provide meaningful analytics while ensuring
                        user privacy remains uncompromised.
                    </p>
                </section>

                <section>
                    <h2>IP Addresses and Country Detection</h2>
                    <p>
                        When a project enables location tracking, a visitor's IP address is used once, at the start of
                        their session, to determine a country. The lookup runs entirely on our own server against a
                        local database — the address is never sent to any external service.
                    </p>
                    <p>
                        The IP address itself is never written to our database. Only the resulting country is stored,
                        and only for as long as the session record exists. Projects that do not enable location tracking
                        have no country determined at all.
                    </p>
                    <p>
                        Country data is derived from{" "}
                        <a href="https://db-ip.com" target="_blank" rel="noopener noreferrer" class="link">
                            DB-IP
                        </a>, used under the{" "}
                        <a
                            href="https://creativecommons.org/licenses/by/4.0/"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="link"
                        >
                            Creative Commons Attribution 4.0
                        </a>{" "}
                        licence.
                    </p>
                </section>

                <div class="mt-12 pt-8 border-t border-line">
                    <p>If you have any questions about our privacy policy, please contact us.</p>
                </div>
            </div>
        </PublicShell>
    );
}
