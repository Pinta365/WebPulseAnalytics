export function Footer() {
    return (
        <footer class="container-fluid">
            <div class="grid">
                <div class="footer-section">
                    <h6>Contact</h6>
                    <small>
                        <a href="mailto:hello&#64;webpulseanalytics&#46;com">
                            <img src="/img/svg/mail-filled.svg" alt="email icon" /> Send Email
                        </a>
                    </small>
                    <br />
                    <small>
                        <a href="https://github.com/Pinta365/WebPulseAnalytics" target="_blank">
                            <img
                                src="/img/svg/github.svg"
                                alt="github brand icon"
                            />{" "}
                            GitHub Repository
                        </a>
                    </small>
                    <br />
                    <small>
                        <a href="https://discord.gg/J7QtVxAt6F" target="_blank">
                            <img
                                src="/img/svg/discord.svg"
                                alt="discord brand icon"
                            />{" "}
                            Discord Server
                        </a>
                    </small>
                </div>
                <div class="footer-section">
                    <h6>About</h6>
                    <small>
                        <a href="/docs">Documentation</a>
                    </small>
                    <br />
                    <small>
                        <a href="/info/privacy">Privacy Policy</a>
                    </small>
                    <br />
                    <small>
                        <a href="https://github.com/Pinta365/WebPulseAnalytics/blob/main/LICENSE" target="_blank">
                            MIT License
                        </a>
                    </small>
                </div>
            </div>
        </footer>
    );
}
