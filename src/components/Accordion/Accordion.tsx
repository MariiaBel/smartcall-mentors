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
                        after={
                            <div className={styles.badget}>{mentor.price}</div>
                        }
                        // before={<Avatar size={48} />}
                        // description="Description"
                        // subhead={mentor.name}
                        subtitle={mentor.stack}
                        // titleBadge={<Badge type="dot" />}
                    >
                        {mentor.name}
                    </Cell>
                    <div></div>
                </summary>
                <Blockquote>{mentor.description}</Blockquote>
                <Button className={styles.btn} mode="outline" size="m">
                    <Link href={`https://t.me/${mentor.username}`}>
                        {actionText}
                    </Link>
                </Button>
            </details>
        </div>
    );
}
