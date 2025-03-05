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
    userId: string;
    mentorResponse: Promise<TMentor[]>;
};

export default function FormMentor({
    userId,
    mentorResponse,
}: TFormMentorProp) {
    const t = useTranslations("mentor");

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [isPending, setIsPending] = useState(false);
    const mentor = use(mentorResponse);

    const handleSubmit = async (formData: FormData) => {
        // event.preventDefault()

        setIsPending(true);

        formData.set("telegram_id", userId.toString() || "");
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
            setSuccess(result?.message || "Поздравляю! Данные сохранены.");
            setError("");
        } else {
            setError(result?.message || "Ошибка. Свяжитесь с @MariiaBel");
            setSuccess("");
        }
        // redirect("/");
    };

    return (
        <form className={styles.form} action={handleSubmit}>
            <fieldset className={styles.fieldset}>
                <Input
                    name="name"
                    header="Имя *"
                    placeholder="Напишите свое имя"
                    defaultValue={mentor?.name || ""}
                />
                <Input
                    name="stack"
                    header="Стек *"
                    placeholder="ES6, React, HTML, CSS"
                    defaultValue={mentor?.stack || ""}
                />
                <Input
                    name="price"
                    header="Цена *"
                    placeholder="Цена за час консультации"
                    defaultValue={mentor?.price || ""}
                />
                <Textarea
                    name="description"
                    header="О себе *"
                    placeholder="С чем вы можите помочь"
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
                    description="Скрыть карточку ментора"
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
