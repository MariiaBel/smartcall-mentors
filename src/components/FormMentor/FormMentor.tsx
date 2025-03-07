"use client";
import { useEffect, useState, use } from "react";
import { EStatusMentor, TMentor } from "@/app/lib/definitions";
import { createMentor, updateMentor } from "@/app/lib/actions";
import styles from "./FormMentor.module.css";
import { useTranslations } from "next-intl";
import {
    Input,
    Textarea,
    Button,
    Switch,
    Cell,
} from "@telegram-apps/telegram-ui";

type TFormMentorProp = {
    user: {
        allowsWriteToPm: boolean;
        firstName: string;
        id: number;
        isPremium: boolean;
        languageCode: "en" | "ru";
        lastName: string;
        username: string;
    };
    mentorResponse: Promise<TMentor[]>;
};

export default function FormMentor({ user, mentorResponse }: TFormMentorProp) {
    const t = useTranslations("mentor");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [isPending, setIsPending] = useState(false);
    const mentor = use(mentorResponse);

    const handleSubmit = async (formData: FormData) => {
        // event.preventDefault()

        setIsPending(true);

        formData.set("telegram_id", user.id.toString() || "");
        formData.set("username", user.username || "");
        formData.set(
            "status",
            formData.get("visibility") ? EStatusMentor.hidden : ""
        );
        let result;
        if (mentor || !!success) {
            result = await updateMentor(formData);
        } else {
            result = await createMentor(formData);
        }

        setIsPending(false);

        if (result?.status === "success") {
            setSuccess(result?.message || t("form.save_data"));
            setError("");
        } else {
            setError(result?.message || t("form.error"));
            setSuccess("");
        }
        // redirect("/");
    };

    return (
        <form className={styles.form} action={handleSubmit}>
            <fieldset className={styles.fieldset}>
                <Input
                    name="name"
                    header={`${t('form.name')} *`}
                    placeholder={t('form.placeholder_name')}
                    defaultValue={mentor?.name || ""}
                />
                <Input
                    name="stack"
                    header={`${t('form.stack')} *`}
                    placeholder={t('form.placeholder_stack')}
                    defaultValue={mentor?.stack || ""}
                />
                <Input
                    name="price"
                    header={`${t('form.price')} *`}
                    placeholder={t('form.placeholder_price')}
                    defaultValue={mentor?.price || ""}
                />
                <Textarea
                    name="description"
                    header={`${t('form.desc')} *`}
                    placeholder={t('form.placeholder_desc')}
                    defaultValue={mentor?.description || ""}
                />
                <Cell
                    Component="label"
                    before={
                        <Switch
                            name="visibility"
                            defaultChecked={
                                mentor?.status === EStatusMentor.hidden
                            }
                        />
                    }
                    description={t('form.card_hidden')}
                    multiline
                ></Cell>
            </fieldset>
            <Button
                type="submit"
                Component="button"
                disabled={isPending}
                mode="outline"
                size="l"
                className={styles.btn}
            >
                {mentor || !!success ? t("update") : t("save")}
            </Button>

            {error && <small className="error">{error}</small>}
            {success && <small className="success">{success}</small>}
        </form>
    );
}
