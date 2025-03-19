// import styles from "./mentors.module.css";
import { Page } from "@/components/Page";
import { BreadcrumbsDot } from "@/components/BreadcrumbsDot/BreadcrumbsDot";
import { Headline } from "@telegram-apps/telegram-ui";
import { getTranslations } from "next-intl/server";
import { fetchMentors } from "../lib/data";
import Accordion from "@/components/Accordion/Accordion";
import { Link } from "@/components/Link/Link";
import styles from "./mentors.module.css";
import FilterMentors from "@/components/FilterMentors/FilterMentors";

type TMentorProps = {
    searchParams?: Promise<{
        stack?: string;
    }>;
};

const breadcrumbs = [
    {
        name: "main-page",
        href: "/",
        componentName: "a",
    },
    {
        name: "mentor_list",
    },
    {
        name: "mentor_card",
        href: "/mentor",
        componentName: "a",
    },
];

export default async function Mentors(props: TMentorProps) {
    const t = await getTranslations("mentors");
    const mentorList = await fetchMentors();
    const searchParams = await props.searchParams;
    const chosenStack: string = searchParams?.stack || "";

    return (
        <Page className={styles.page}>
            <section className="content">
                <BreadcrumbsDot breadcrumbs={breadcrumbs} />
                <Headline weight="2" className="header">
                    &nbsp; • &nbsp; {t("header")} &nbsp; • &nbsp;
                </Headline>

                <FilterMentors mentors={mentorList || []} />

                {mentorList
                    ?.filter((mentor) =>
                        chosenStack
                            .split(",")
                            .map((item: string) => item.toLowerCase().trim())
                            .every(
                                (stack: string) =>
                                    mentor.stack
                                        .toLowerCase()
                                        .indexOf(stack) !== -1
                            )
                    )
                    .map((mentor, index) => (
                        <Accordion
                            key={index}
                            mentor={mentor}
                            actionText={t("connect_to_mentor")}
                        />
                    ))}
                <footer className="footer">
                    {t("footer")}{" "}
                    <Link href="https://t.me/MariiaBel">@MariiaBel</Link>
                </footer>
            </section>
        </Page>
    );
}
