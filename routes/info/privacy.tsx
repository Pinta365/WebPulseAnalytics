import { config } from "lib/config.ts";

export default function Privacy() {
    return (
        <>
            <nav class="w-full bg-nav border-b border-card shadow-sm">
                <div class="px-4 py-2 flex justify-between items-center">
                    {/* Left: Logo */}
                    <div>
                        <a href={config.common.websiteBaseURL} class="flex items-center gap-2">
                            <img
                                src="/img/svg/logo-top.svg"
                                class="h-8 w-auto filter dark:invert"
                                alt="the webpulse logo"
                            />
                        </a>
                    </div>
                </div>
            </nav>
            <div class="container mx-auto px-4 flex flex-col justify-center min-h-[calc(90vh-9rem)] py-8 bg-body">
                <div class="max-w-4xl mx-auto space-y-8">
                    {/* Header Section */}
                    <div class="text-center space-y-4">
                        <h1 class="text-3xl font-bold text-primary">Privacy Policy</h1>
                        <p class="text-secondary leading-relaxed text-lg max-w-3xl mx-auto">
                            WebPulse Analytics is a streamlined web analytics solution designed for effortless
                            monitoring of page events and user behavior through a simple client-side script. Tailored
                            for intuitive understanding, our tool offers deeper insight into user interactions on your
                            website, empowering you to optimize your online presence.
                        </p>
                    </div>
                    <a
                        href={config.common.websiteBaseURL}
                        class="no-underline text-inherit mb-6 inline-block link"
                    >
                        &larr; Back to Webpulse Analytics
                    </a>
                    {/* Privacy Sections */}
                    <div class="space-y-8">
                        {/* Your Privacy is Our Priority */}
                        <div class="bg-card-light rounded-lg p-6 space-y-4">
                            <h2 class="text-2xl font-semibold text-primary flex items-center">
                                <svg class="w-6 h-6 mr-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fill-rule="evenodd"
                                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                        clip-rule="evenodd"
                                    >
                                    </path>
                                </svg>
                                Your Privacy is Our Priority
                            </h2>
                            <p class="text-secondary leading-relaxed">
                                At WebPulse Analytics, we hold a strong commitment to safeguarding user privacy. Our
                                administrative dashboard operates solely on functional cookies for essential purposes
                                such as retaining language preferences and maintaining active sessions.
                            </p>
                            <p class="text-secondary leading-relaxed">
                                No cookies are being created by the client-side script that you implement on your
                                tracked projects. This ensures no bloat or unnecessary data being stored.
                            </p>
                        </div>

                        {/* Customizable Data Collection */}
                        <div class="bg-card-light rounded-lg p-6 space-y-4">
                            <h2 class="text-2xl font-semibold text-primary flex items-center">
                                <svg class="w-6 h-6 mr-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Customizable Data Collection
                            </h2>
                            <p class="text-secondary leading-relaxed">
                                Understanding the importance of data privacy, we've designed WebPulse Analytics to only
                                collect the data you opt into during the setup of your website project within our
                                system. This customizable data collection approach ensures that you have full control
                                over the data being gathered, aligning with your privacy preferences and compliance
                                requirements.
                            </p>
                        </div>

                        {/* Anonymous Data Processing */}
                        <div class="bg-card-light rounded-lg p-6 space-y-4">
                            <h2 class="text-2xl font-semibold text-primary flex items-center">
                                <svg class="w-6 h-6 mr-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fill-rule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                                        clip-rule="evenodd"
                                    >
                                    </path>
                                </svg>
                                Anonymous Data Processing
                            </h2>
                            <p class="text-secondary leading-relaxed">
                                The data collected via the client-side script is anonymized to uphold the highest
                                standards of privacy and data protection. Our objective is to provide meaningful
                                analytics while ensuring user privacy remains uncompromised.
                            </p>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div class="text-center pt-8 border-t border-border">
                        <p class="text-secondary">
                            If you have any questions about our privacy policy, please contact us.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
