import type { PropsWithChildren } from "react";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import { Root } from "@/components/Root/Root";
import { I18nProvider } from "@/core/i18n/provider";
import { Analytics } from "@vercel/analytics/next";

import "@telegram-apps/telegram-ui/dist/styles.css";
import "normalize.css/normalize.css";
import "./_assets/globals.css";

export const metadata: Metadata = {
    title: "SmartCall - поиск ментора без посредника",
    description:
        "SmartCall позволит найти подходящего метора и стать ментором. Без посрдеников.",
    metadataBase: new URL("https://t.me/smartcall_mentors_bot"),
};

export default async function RootLayout({ children }: PropsWithChildren) {
    const locale = await getLocale();

    return (
        <html lang={locale}>
            <body class="body">
                <I18nProvider>
                    <Root>{children}</Root>
                </I18nProvider>
            </body>
            <Analytics />
        </html>
    );
}
