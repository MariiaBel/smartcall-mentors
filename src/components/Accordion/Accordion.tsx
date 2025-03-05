"use client";

import { Blockquote, Cell, Badge, Button } from "@telegram-apps/telegram-ui";
import { EStatusMentor, Mentor } from "@/app/lib/definitions";
import { Link } from "@/components/Link/Link";

import styles from "./Accordion.module.css";

type TAccordionProps = {
    mentor: Mentor;
    actionText: string;
};

export default function Accordion({ mentor, actionText }: TAccordionProps) {
    if (mentor.status === EStatusMentor.hidden) {
        return;
    }
    return (
        <div>
            {/* {JSON.stringify(mentor, null, 2)} */}
            <details className={styles.accordion}>
                <summary className={styles.summary}>
                    <Cell
                        after={<Badge type="number">{mentor.price}</Badge>}
                        // before={<Avatar size={48} />}
                        // description="Description"
                        // subhead={mentor.name}
                        subtitle={mentor.stack}
                        // titleBadge={<Badge type="dot" />}
                    >
                        {mentor.name}
                    </Cell>
                </summary>
                <Blockquote>{mentor.description}</Blockquote>
                <Button className={styles.btn} mode="outline" size="m">
                    <Link href={`tg://user?id=${mentor.telegram_id}`}>
                        {actionText}
                    </Link>
                </Button>
            </details>
        </div>
    );
}
