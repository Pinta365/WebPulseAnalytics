import { useState } from "preact/hooks";
import { NotificationProvider, useNotification } from "../components/NotificationContext.tsx";
import { NotificationBanner } from "../components/NotificationBanner.tsx";

export default function LocaleSelector({ initialLocale }: { initialLocale: string }) {
    return (
        <NotificationProvider>
            <LocaleSelectorContent initialLocale={initialLocale} />
        </NotificationProvider>
    );
}

function LocaleSelectorContent({ initialLocale }: { initialLocale: string }) {
    const [locale, setLocale] = useState(initialLocale);
    const { showNotification } = useNotification();

    async function handleLocaleChange(e: Event) {
        const newLocale = (e.target as HTMLSelectElement).value;
        setLocale(newLocale);
        const res = await fetch("/dashboard/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ locale: newLocale }),
        });
        showNotification(
            res.ok ? "Locale updated!" : "Failed to update locale.",
            res.ok ? "success" : "error",
        );
    }

    return (
        <>
            <NotificationBannerWrapper />
            <div class="w-56 max-w-full">
                <label class="label" for="locale-select">Date &amp; time locale</label>
                <select
                    id="locale-select"
                    class="input-base"
                    value={locale}
                    onChange={handleLocaleChange}
                >
                    {/* English */}
                    <optgroup label="English">
                        <option value="en-US">English (US)</option>
                        <option value="en-GB">English (UK)</option>
                        <option value="en-CA">English (Canada)</option>
                        <option value="en-AU">English (Australia)</option>
                        <option value="en-NZ">English (New Zealand)</option>
                        <option value="en-IN">English (India)</option>
                    </optgroup>

                    {/* European Languages */}
                    <optgroup label="European Languages">
                        <option value="sv-SE">Swedish (Sweden)</option>
                        <option value="fr-FR">French (France)</option>
                        <option value="fr-CA">French (Canada)</option>
                        <option value="de-DE">German (Germany)</option>
                        <option value="de-AT">German (Austria)</option>
                        <option value="de-CH">German (Switzerland)</option>
                        <option value="es-ES">Spanish (Spain)</option>
                        <option value="es-MX">Spanish (Mexico)</option>
                        <option value="it-IT">Italian (Italy)</option>
                        <option value="pt-PT">Portuguese (Portugal)</option>
                        <option value="pt-BR">Portuguese (Brazil)</option>
                        <option value="nl-NL">Dutch (Netherlands)</option>
                        <option value="nl-BE">Dutch (Belgium)</option>
                        <option value="da-DK">Danish (Denmark)</option>
                        <option value="no-NO">Norwegian (Norway)</option>
                        <option value="fi-FI">Finnish (Finland)</option>
                        <option value="pl-PL">Polish (Poland)</option>
                        <option value="cs-CZ">Czech (Czech Republic)</option>
                        <option value="hu-HU">Hungarian (Hungary)</option>
                        <option value="ro-RO">Romanian (Romania)</option>
                        <option value="bg-BG">Bulgarian (Bulgaria)</option>
                        <option value="hr-HR">Croatian (Croatia)</option>
                        <option value="sk-SK">Slovak (Slovakia)</option>
                        <option value="sl-SI">Slovenian (Slovenia)</option>
                        <option value="et-EE">Estonian (Estonia)</option>
                        <option value="lv-LV">Latvian (Latvia)</option>
                        <option value="lt-LT">Lithuanian (Lithuania)</option>
                        <option value="el-GR">Greek (Greece)</option>
                        <option value="ru-RU">Russian (Russia)</option>
                        <option value="uk-UA">Ukrainian (Ukraine)</option>
                        <option value="tr-TR">Turkish (Turkey)</option>
                    </optgroup>

                    {/* Asian Languages */}
                    <optgroup label="Asian Languages">
                        <option value="ja-JP">Japanese (Japan)</option>
                        <option value="ko-KR">Korean (South Korea)</option>
                        <option value="zh-CN">Chinese (Simplified, China)</option>
                        <option value="zh-TW">
                            Chinese (Traditional, Taiwan)
                        </option>
                        <option value="zh-HK">
                            Chinese (Traditional, Hong Kong)
                        </option>
                        <option value="th-TH">Thai (Thailand)</option>
                        <option value="vi-VN">Vietnamese (Vietnam)</option>
                        <option value="id-ID">Indonesian (Indonesia)</option>
                        <option value="ms-MY">Malay (Malaysia)</option>
                        <option value="hi-IN">Hindi (India)</option>
                        <option value="bn-IN">Bengali (India)</option>
                        <option value="ta-IN">Tamil (India)</option>
                        <option value="te-IN">Telugu (India)</option>
                        <option value="mr-IN">Marathi (India)</option>
                        <option value="gu-IN">Gujarati (India)</option>
                        <option value="kn-IN">Kannada (India)</option>
                        <option value="ml-IN">Malayalam (India)</option>
                        <option value="pa-IN">Punjabi (India)</option>
                        <option value="ur-PK">Urdu (Pakistan)</option>
                        <option value="fa-IR">Persian (Iran)</option>
                        <option value="ar-SA">Arabic (Saudi Arabia)</option>
                        <option value="ar-EG">Arabic (Egypt)</option>
                        <option value="he-IL">Hebrew (Israel)</option>
                    </optgroup>

                    {/* Americas */}
                    <optgroup label="Americas">
                        <option value="es-AR">Spanish (Argentina)</option>
                        <option value="es-CO">Spanish (Colombia)</option>
                        <option value="es-PE">Spanish (Peru)</option>
                        <option value="es-VE">Spanish (Venezuela)</option>
                        <option value="es-CL">Spanish (Chile)</option>
                        <option value="es-EC">Spanish (Ecuador)</option>
                        <option value="es-GT">Spanish (Guatemala)</option>
                        <option value="es-CR">Spanish (Costa Rica)</option>
                        <option value="es-PA">Spanish (Panama)</option>
                        <option value="es-CU">Spanish (Cuba)</option>
                        <option value="es-BO">Spanish (Bolivia)</option>
                        <option value="es-DO">Spanish (Dominican Republic)</option>
                        <option value="es-HN">Spanish (Honduras)</option>
                        <option value="es-PY">Spanish (Paraguay)</option>
                        <option value="es-SV">Spanish (El Salvador)</option>
                        <option value="es-NI">Spanish (Nicaragua)</option>
                        <option value="es-PR">Spanish (Puerto Rico)</option>
                        <option value="es-UY">Spanish (Uruguay)</option>
                        <option value="es-GQ">Spanish (Equatorial Guinea)</option>
                    </optgroup>

                    {/* Africa */}
                    <optgroup label="Africa">
                        <option value="ar-MA">Arabic (Morocco)</option>
                        <option value="ar-DZ">Arabic (Algeria)</option>
                        <option value="ar-TN">Arabic (Tunisia)</option>
                        <option value="ar-LY">Arabic (Libya)</option>
                        <option value="ar-SD">Arabic (Sudan)</option>
                        <option value="ar-OM">Arabic (Oman)</option>
                        <option value="ar-YE">Arabic (Yemen)</option>
                        <option value="ar-SY">Arabic (Syria)</option>
                        <option value="ar-JO">Arabic (Jordan)</option>
                        <option value="ar-LB">Arabic (Lebanon)</option>
                        <option value="ar-KW">Arabic (Kuwait)</option>
                        <option value="ar-AE">Arabic (UAE)</option>
                        <option value="ar-BH">Arabic (Bahrain)</option>
                        <option value="ar-QA">Arabic (Qatar)</option>
                        <option value="ar-IQ">Arabic (Iraq)</option>
                        <option value="ar-PS">Arabic (Palestine)</option>
                        <option value="af-ZA">Afrikaans (South Africa)</option>
                        <option value="zu-ZA">Zulu (South Africa)</option>
                        <option value="xh-ZA">Xhosa (South Africa)</option>
                        <option value="sw-KE">Swahili (Kenya)</option>
                        <option value="sw-TZ">Swahili (Tanzania)</option>
                        <option value="am-ET">Amharic (Ethiopia)</option>
                        <option value="ha-NG">Hausa (Nigeria)</option>
                        <option value="yo-NG">Yoruba (Nigeria)</option>
                        <option value="ig-NG">Igbo (Nigeria)</option>
                    </optgroup>

                    {/* Oceania */}
                    <optgroup label="Oceania">
                        <option value="mi-NZ">Maori (New Zealand)</option>
                        <option value="haw-US">Hawaiian (US)</option>
                    </optgroup>
                </select>
                <p class="hint mt-1.5">
                    Preview: {new Date().toLocaleString(locale)} &middot; {(1234567.89).toLocaleString(locale)}
                </p>
            </div>
        </>
    );
}

function NotificationBannerWrapper() {
    const { message, type, clearNotification } = useNotification();
    return <NotificationBanner message={message} type={type} onClose={clearNotification} />;
}
