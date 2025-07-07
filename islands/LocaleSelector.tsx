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
            <div class="mt-6">
                <label class="font-semibold text-lg mb-2 block text-primary">
                    Date/Time Locale
                </label>
                <select
                    class="block w-full px-4 py-2 mt-1 bg-card-light border border-card-light rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent transition"
                    value={locale}
                    onChange={handleLocaleChange}
                >
                    {/* English */}
                    <optgroup label="English" class="text-secondary bg-card-light">
                        <option class="text-secondary bg-card-light" value="en-US">English (US)</option>
                        <option class="text-secondary bg-card-light" value="en-GB">English (UK)</option>
                        <option class="text-secondary bg-card-light" value="en-CA">English (Canada)</option>
                        <option class="text-secondary bg-card-light" value="en-AU">English (Australia)</option>
                        <option class="text-secondary bg-card-light" value="en-NZ">English (New Zealand)</option>
                        <option class="text-secondary bg-card-light" value="en-IN">English (India)</option>
                    </optgroup>

                    {/* European Languages */}
                    <optgroup label="European Languages" class="text-secondary bg-card-light">
                        <option class="text-secondary bg-card-light" value="sv-SE">Swedish (Sweden)</option>
                        <option class="text-secondary bg-card-light" value="fr-FR">French (France)</option>
                        <option class="text-secondary bg-card-light" value="fr-CA">French (Canada)</option>
                        <option class="text-secondary bg-card-light" value="de-DE">German (Germany)</option>
                        <option class="text-secondary bg-card-light" value="de-AT">German (Austria)</option>
                        <option class="text-secondary bg-card-light" value="de-CH">German (Switzerland)</option>
                        <option class="text-secondary bg-card-light" value="es-ES">Spanish (Spain)</option>
                        <option class="text-secondary bg-card-light" value="es-MX">Spanish (Mexico)</option>
                        <option class="text-secondary bg-card-light" value="it-IT">Italian (Italy)</option>
                        <option class="text-secondary bg-card-light" value="pt-PT">Portuguese (Portugal)</option>
                        <option class="text-secondary bg-card-light" value="pt-BR">Portuguese (Brazil)</option>
                        <option class="text-secondary bg-card-light" value="nl-NL">Dutch (Netherlands)</option>
                        <option class="text-secondary bg-card-light" value="nl-BE">Dutch (Belgium)</option>
                        <option class="text-secondary bg-card-light" value="da-DK">Danish (Denmark)</option>
                        <option class="text-secondary bg-card-light" value="no-NO">Norwegian (Norway)</option>
                        <option class="text-secondary bg-card-light" value="fi-FI">Finnish (Finland)</option>
                        <option class="text-secondary bg-card-light" value="pl-PL">Polish (Poland)</option>
                        <option class="text-secondary bg-card-light" value="cs-CZ">Czech (Czech Republic)</option>
                        <option class="text-secondary bg-card-light" value="hu-HU">Hungarian (Hungary)</option>
                        <option class="text-secondary bg-card-light" value="ro-RO">Romanian (Romania)</option>
                        <option class="text-secondary bg-card-light" value="bg-BG">Bulgarian (Bulgaria)</option>
                        <option class="text-secondary bg-card-light" value="hr-HR">Croatian (Croatia)</option>
                        <option class="text-secondary bg-card-light" value="sk-SK">Slovak (Slovakia)</option>
                        <option class="text-secondary bg-card-light" value="sl-SI">Slovenian (Slovenia)</option>
                        <option class="text-secondary bg-card-light" value="et-EE">Estonian (Estonia)</option>
                        <option class="text-secondary bg-card-light" value="lv-LV">Latvian (Latvia)</option>
                        <option class="text-secondary bg-card-light" value="lt-LT">Lithuanian (Lithuania)</option>
                        <option class="text-secondary bg-card-light" value="el-GR">Greek (Greece)</option>
                        <option class="text-secondary bg-card-light" value="ru-RU">Russian (Russia)</option>
                        <option class="text-secondary bg-card-light" value="uk-UA">Ukrainian (Ukraine)</option>
                        <option class="text-secondary bg-card-light" value="tr-TR">Turkish (Turkey)</option>
                    </optgroup>

                    {/* Asian Languages */}
                    <optgroup label="Asian Languages" class="text-secondary bg-card-light">
                        <option class="text-secondary bg-card-light" value="ja-JP">Japanese (Japan)</option>
                        <option class="text-secondary bg-card-light" value="ko-KR">Korean (South Korea)</option>
                        <option class="text-secondary bg-card-light" value="zh-CN">Chinese (Simplified, China)</option>
                        <option class="text-secondary bg-card-light" value="zh-TW">
                            Chinese (Traditional, Taiwan)
                        </option>
                        <option class="text-secondary bg-card-light" value="zh-HK">
                            Chinese (Traditional, Hong Kong)
                        </option>
                        <option class="text-secondary bg-card-light" value="th-TH">Thai (Thailand)</option>
                        <option class="text-secondary bg-card-light" value="vi-VN">Vietnamese (Vietnam)</option>
                        <option class="text-secondary bg-card-light" value="id-ID">Indonesian (Indonesia)</option>
                        <option class="text-secondary bg-card-light" value="ms-MY">Malay (Malaysia)</option>
                        <option class="text-secondary bg-card-light" value="hi-IN">Hindi (India)</option>
                        <option class="text-secondary bg-card-light" value="bn-IN">Bengali (India)</option>
                        <option class="text-secondary bg-card-light" value="ta-IN">Tamil (India)</option>
                        <option class="text-secondary bg-card-light" value="te-IN">Telugu (India)</option>
                        <option class="text-secondary bg-card-light" value="mr-IN">Marathi (India)</option>
                        <option class="text-secondary bg-card-light" value="gu-IN">Gujarati (India)</option>
                        <option class="text-secondary bg-card-light" value="kn-IN">Kannada (India)</option>
                        <option class="text-secondary bg-card-light" value="ml-IN">Malayalam (India)</option>
                        <option class="text-secondary bg-card-light" value="pa-IN">Punjabi (India)</option>
                        <option class="text-secondary bg-card-light" value="ur-PK">Urdu (Pakistan)</option>
                        <option class="text-secondary bg-card-light" value="fa-IR">Persian (Iran)</option>
                        <option class="text-secondary bg-card-light" value="ar-SA">Arabic (Saudi Arabia)</option>
                        <option class="text-secondary bg-card-light" value="ar-EG">Arabic (Egypt)</option>
                        <option class="text-secondary bg-card-light" value="he-IL">Hebrew (Israel)</option>
                    </optgroup>

                    {/* Americas */}
                    <optgroup label="Americas" class="text-secondary bg-card-light">
                        <option class="text-secondary bg-card-light" value="es-AR">Spanish (Argentina)</option>
                        <option class="text-secondary bg-card-light" value="es-CO">Spanish (Colombia)</option>
                        <option class="text-secondary bg-card-light" value="es-PE">Spanish (Peru)</option>
                        <option class="text-secondary bg-card-light" value="es-VE">Spanish (Venezuela)</option>
                        <option class="text-secondary bg-card-light" value="es-CL">Spanish (Chile)</option>
                        <option class="text-secondary bg-card-light" value="es-EC">Spanish (Ecuador)</option>
                        <option class="text-secondary bg-card-light" value="es-GT">Spanish (Guatemala)</option>
                        <option class="text-secondary bg-card-light" value="es-CR">Spanish (Costa Rica)</option>
                        <option class="text-secondary bg-card-light" value="es-PA">Spanish (Panama)</option>
                        <option class="text-secondary bg-card-light" value="es-CU">Spanish (Cuba)</option>
                        <option class="text-secondary bg-card-light" value="es-BO">Spanish (Bolivia)</option>
                        <option class="text-secondary bg-card-light" value="es-DO">Spanish (Dominican Republic)</option>
                        <option class="text-secondary bg-card-light" value="es-HN">Spanish (Honduras)</option>
                        <option class="text-secondary bg-card-light" value="es-PY">Spanish (Paraguay)</option>
                        <option class="text-secondary bg-card-light" value="es-SV">Spanish (El Salvador)</option>
                        <option class="text-secondary bg-card-light" value="es-NI">Spanish (Nicaragua)</option>
                        <option class="text-secondary bg-card-light" value="es-PR">Spanish (Puerto Rico)</option>
                        <option class="text-secondary bg-card-light" value="es-UY">Spanish (Uruguay)</option>
                        <option class="text-secondary bg-card-light" value="es-GQ">Spanish (Equatorial Guinea)</option>
                    </optgroup>

                    {/* Africa */}
                    <optgroup label="Africa" class="text-secondary bg-card-light">
                        <option class="text-secondary bg-card-light" value="ar-MA">Arabic (Morocco)</option>
                        <option class="text-secondary bg-card-light" value="ar-DZ">Arabic (Algeria)</option>
                        <option class="text-secondary bg-card-light" value="ar-TN">Arabic (Tunisia)</option>
                        <option class="text-secondary bg-card-light" value="ar-LY">Arabic (Libya)</option>
                        <option class="text-secondary bg-card-light" value="ar-SD">Arabic (Sudan)</option>
                        <option class="text-secondary bg-card-light" value="ar-OM">Arabic (Oman)</option>
                        <option class="text-secondary bg-card-light" value="ar-YE">Arabic (Yemen)</option>
                        <option class="text-secondary bg-card-light" value="ar-SY">Arabic (Syria)</option>
                        <option class="text-secondary bg-card-light" value="ar-JO">Arabic (Jordan)</option>
                        <option class="text-secondary bg-card-light" value="ar-LB">Arabic (Lebanon)</option>
                        <option class="text-secondary bg-card-light" value="ar-KW">Arabic (Kuwait)</option>
                        <option class="text-secondary bg-card-light" value="ar-AE">Arabic (UAE)</option>
                        <option class="text-secondary bg-card-light" value="ar-BH">Arabic (Bahrain)</option>
                        <option class="text-secondary bg-card-light" value="ar-QA">Arabic (Qatar)</option>
                        <option class="text-secondary bg-card-light" value="ar-IQ">Arabic (Iraq)</option>
                        <option class="text-secondary bg-card-light" value="ar-PS">Arabic (Palestine)</option>
                        <option class="text-secondary bg-card-light" value="af-ZA">Afrikaans (South Africa)</option>
                        <option class="text-secondary bg-card-light" value="zu-ZA">Zulu (South Africa)</option>
                        <option class="text-secondary bg-card-light" value="xh-ZA">Xhosa (South Africa)</option>
                        <option class="text-secondary bg-card-light" value="sw-KE">Swahili (Kenya)</option>
                        <option class="text-secondary bg-card-light" value="sw-TZ">Swahili (Tanzania)</option>
                        <option class="text-secondary bg-card-light" value="am-ET">Amharic (Ethiopia)</option>
                        <option class="text-secondary bg-card-light" value="ha-NG">Hausa (Nigeria)</option>
                        <option class="text-secondary bg-card-light" value="yo-NG">Yoruba (Nigeria)</option>
                        <option class="text-secondary bg-card-light" value="ig-NG">Igbo (Nigeria)</option>
                    </optgroup>

                    {/* Oceania */}
                    <optgroup label="Oceania" class="text-secondary bg-card-light">
                        <option class="text-secondary bg-card-light" value="mi-NZ">Maori (New Zealand)</option>
                        <option class="text-secondary bg-card-light" value="haw-US">Hawaiian (US)</option>
                    </optgroup>
                </select>
            </div>
        </>
    );
}

function NotificationBannerWrapper() {
    const { message, type, clearNotification } = useNotification();
    return <NotificationBanner message={message} type={type} onClose={clearNotification} />;
}
