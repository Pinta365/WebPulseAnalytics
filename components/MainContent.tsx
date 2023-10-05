import { SessionUser } from "lib/commonTypes.ts";
import { NavSide } from "islands/NavSide.tsx";

export function MainContent(data: SessionUser) {
    return (
        <main class="container">
            <div class="grid">
                <NavSide />
                <section>
                    <h1>Test</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio, neque qui velit. Magni dolorum quidem ipsam eligendi, totam, facilis laudantium cum accusamus ullam voluptatibus commodi numquam, error, est. Ea, consequatur.</p>
                    <img src="/img/svg/logo1.svg" class="logo" alt="the webpulse logo" />
                </section>
            </div>
        </main>
    );
}
