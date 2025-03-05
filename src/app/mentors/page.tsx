// import styles from "./mentors.module.css";
import { Page } from "@/components/Page";
import { BreadcrumbsDot } from "@/components/BreadcrumbsDot/BreadcrumbsDot";
import { Headline } from "@telegram-apps/telegram-ui";
import { getTranslations } from "next-intl/server";
import { fetchMentors } from "../lib/data";
import Accordion from "@/components/Accordion/Accordion";

const breadcrumbs = [
    {
        name: "main-page",
        href: "/",
        componentName: "a",
    },
    {
        name: "mentor_card",
        href: "/mentor",
        componentName: "a",
    },
    {
        name: "mentor_list",
    },
];

export default async function Mentors() {
    const t = await getTranslations("mentors");

    const mentorList = await fetchMentors();

    return (
        <Page>
            <section className="content">
                <BreadcrumbsDot breadcrumbs={breadcrumbs} />
                <Headline weight="2" className="header">
                    &nbsp; • &nbsp; {t("header")} &nbsp; • &nbsp;
                </Headline>
                {mentorList?.map((mentor, index) => (
                    <Accordion
                        key={index}
                        mentor={mentor}
                        actionText={t("connect_to_mentor")}
                    />
                ))}
                <footer className="footer">{t("footer")}</footer>
            </section>
        </Page>
    );
}
