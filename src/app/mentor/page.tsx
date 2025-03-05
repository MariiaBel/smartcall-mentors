"use client";

import { Page } from "@/components/Page";
import { Headline } from "@telegram-apps/telegram-ui";
import { useTranslations } from "next-intl";
import { Suspense, useMemo } from "react";
import { useSignal, initData } from "@telegram-apps/sdk-react";
import { BreadcrumbsDot } from "@/components/BreadcrumbsDot/BreadcrumbsDot";
import FormMentor from "./../../components/FormMentor/FormMentor";
import { fetchMentor } from "@/app/lib/data";
import { TMentor } from "@/app/lib/definitions";

const breadcrumbs = [
    {
        name: "main-page",
        href: "/",
        componentName: "a",
    },
    {
        name: "mentor_list",
        href: "/mentors",
        componentName: "a",
    },
    {
        name: "mentor_card",
    },
];

export default function Mentor() {
    const t = useTranslations("mentor");

    const initDataState = useSignal(initData.state);

    const mentorResponse: Promise<TMentor[]> | null = useMemo(() => {
        if (initDataState?.user?.id) {
            return fetchMentor(initDataState?.user?.id);
        }
        return null;
    }, [initDataState?.user?.id]);
    
    return (
        <Page>
            <section className="content">
                <BreadcrumbsDot breadcrumbs={breadcrumbs} />
                <Headline weight="2" className="header">
                    &nbsp; • &nbsp; {t("header")} &nbsp; • &nbsp;
                </Headline>
                {initDataState?.user?.isBot ? (
                    <p>{t("not-for-bot")}</p>
                ) : initDataState?.user ? (
                    initDataState?.user?.id &&
                    mentorResponse && (
                        <Suspense fallback={<p>Loading ...</p>}>
                            <FormMentor
                                userId={initDataState?.user?.id}
                                mentorResponse={mentorResponse}
                            />
                        </Suspense>
                    )
                ) : (
                    <p>{t("not-telegram-user")}</p>
                )}

                <footer className="footer">{t("footer")}</footer>
            </section>
        </Page>
    );
}
