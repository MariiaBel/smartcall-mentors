"use client"

import styles from './mentor.module.css'
import { Page } from '@/components/Page';
import { Headline, Input, Textarea, Button, Switch, Cell } from '@telegram-apps/telegram-ui';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useSignal, initData } from '@telegram-apps/sdk-react';
import { createMentor, updateMentor } from '../lib/actions';
import { Mentor } from '@/app/lib/definitions';
import { BreadcrumbsDot } from '@/components/BreadcrumbsDot/BreadcrumbsDot';

const breadcrumbs= [
    {
        name: 'main-page',
        href: '/',
        componentName: 'a'
    },
    {
        name: 'mentor_card',
    },
]

export default function Mentor() {

    const t = useTranslations('mentor');

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [mentor, setMentor] = useState<Mentor | null>(null)

    const initDataState = useSignal(initData.state);

    useEffect(() => {
        async function getMentor() {
            if (initDataState?.user?.id) {
                const response = await fetch(`/api/mentor/?id=${initDataState?.user?.id}`)
                const mentorData = await response.json()

                setMentor(mentorData)
            }
        }
        if (initDataState?.user?.id || !!success) {
            getMentor()
        }
    }, [initDataState?.user?.id])

    const handleSubmit = async (formData: FormData) => {
        // event.preventDefault()

        setIsPending(true);

        formData.set('telegram_id', initDataState?.user?.id.toString() || '')
        formData.set('status', formData.get('visibility')? 'hidden' : '')
        let result;
        if (mentor || !!success) {
            result = await updateMentor(formData)
        } else {
            result = await createMentor(formData)
        }

        setIsPending(false);

        if (result?.status === 'success') {
            setSuccess(result?.message || 'Поздравляю! Данные сохранены.')
            setError('')
        } else {
            setError(result?.message || 'Ошибка. Свяжитесь с @MariiaBel');
            setSuccess('')
        }
        // redirect("/");
    };

    return (
        <Page>
            <section className="content">
                <BreadcrumbsDot breadcrumbs={breadcrumbs} />
                <Headline
                    weight="2"
                    className="header"
                >
                    &nbsp;  •  &nbsp; {t('header')} &nbsp;  •  &nbsp;
                </Headline>
                {
                    initDataState?.user?.isBot ? <p>{t('not-for-bot')}</p> :
                        initDataState?.user ? (
                            <form className={styles.form} action={handleSubmit}>
                                <fieldset className={styles.fieldset}>
                                    <Input name="name" header="Имя *" placeholder="Напишите свое имя" defaultValue={mentor?.name || ''} />
                                    <Input name="stack" header="Стек *" placeholder="ES6, React, HTML, CSS" defaultValue={mentor?.stack || ''} />
                                    <Input name="price" header="Цена *" placeholder="Цена за час консультации" defaultValue={mentor?.price || ''} />
                                    <Textarea name="description" header="О себе *" placeholder="С чем вы можите помочь" defaultValue={mentor?.description || ''} />
                                    <Cell
                                        Component="label"
                                        before={<Switch name="visibility" defaultChecked={mentor?.status === 'hidden'}/>}
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
                                    {mentor || !!success ? t('update') : t('save')}
                                </Button>

                                {error && <small className="error">{error}</small>}
                                {success && <small className="success">{success}</small>}
                            </form>
                        ) :
                            <p>{t('not-telegram-user')}</p>
                }

                <footer className="footer">
                    {t('footer')}
                </footer>
            </section>
        </Page>
    )
}