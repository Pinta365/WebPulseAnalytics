import type { Handlers, PageProps } from "$fresh/server.ts";
import { Footer } from "components/layout/Footer.tsx";
import { config } from "lib/config.ts";
import { NavTop } from "components/layout/NavTop.tsx";
import { SessionUser } from "lib/commonTypes.ts";

export const handler: Handlers = {
    GET(_req, ctx) {
        return ctx.render(ctx.state);
    },
};

export default function Privacy({ data }: PageProps<SessionUser>) {
    return (
        <body>
            <NavTop {...data} />
            <main class="container">
                <div>
                    <p>
                        WebPulse Analytics is a streamlined web analytics solution designed for effortless monitoring of
                        page events and user behavior through a simple client-side script. Tailored for intuitive
                        understanding, our tool offers deeper insight into user interactions on your website, empowering
                        you to optimize your online presence.
                    </p>

                    <h4>Your Privacy is Our Priority</h4>

                    <p>
                        At WebPulse Analytics, we hold a strong commitment to safeguarding user privacy. Our
                        administrative dashboard operates solely on functional cookies for essential purposes such as
                        retaining language preferences and maintaining active sessions.

                        No cookies are being created by the client-side script that you implement on your tracked
                        projects. This ensures no bloat or unnecessary data being stored.
                    </p>

                    <h4>Customizable Data Collection</h4>

                    <p>
                        Understanding the importance of data privacy, we've designed WebPulse Analytics to only collect
                        the data you opt into during the setup of your website project within our system. This
                        customizable data collection approach ensures that you have full control over the data being
                        gathered, aligning with your privacy preferences and compliance requirements.
                    </p>

                    <h4>Anonymous Data Processing</h4>

                    <p>
                        The data collected via the client-side script is anonymized to uphold the highest standards of
                        privacy and data protection. Our objective is to provide meaningful analytics while ensuring
                        user privacy remains uncompromised.
                    </p>
                </div>
            </main>
            <Footer />
        </body>
    );
}
