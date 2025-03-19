"use client";
import { MultiselectOption } from "@/app/types";
import { Multiselect } from "@telegram-apps/telegram-ui";
import { useCallback, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { TMentor } from "@/app/lib/definitions";
import { getValues, uniqueOptions } from "./../../app/utiles";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

type TFilterMentorsProp = {
    mentors: TMentor[];
};

export default function FilterMentors({ mentors }: TFilterMentorsProp) {
    const t = useTranslations("mentors");
    const searchParam = useSearchParams();
    const params = new URLSearchParams(searchParam);
    const pathname = usePathname();
    const { replace } = useRouter();

    const [optionValue, setOptionValue] = useState<MultiselectOption[]>([]);
    const [allOptionsValue, setAllOptionsValue] = useState<MultiselectOption[]>(
        []
    );

    useEffect(() => {
        let options = uniqueOptions(mentors, "stack", ",");

        setAllOptionsValue(
            options.sort().map((option) => ({
                value: option.split(" ").join("+").toLowerCase(),
                label: option,
            }))
        );

        const chosenStack = params.get("stack");
        if (chosenStack) {
            const stack = chosenStack.split(",").map((item) => ({
                value: item.split(" ").join("+").toLowerCase(),
                label: item,
            }));
            setOptionValue(stack);
        }
    }, []);

    const doChangeOptions = (options: MultiselectOption[]) => {
        const values = getValues(options);

        if (values) {
            params.set("stack", values);
        } else {
            params.delete("stack");
        }
        setOptionValue(options);

        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div>
            <Multiselect
                closeDropdownAfterSelect
                header={t("search")}
                placeholder={t("search_by_criteria")}
                selectedBehavior="hide"
                options={allOptionsValue}
                value={optionValue}
                onChange={doChangeOptions}
            />
        </div>
    );
}
