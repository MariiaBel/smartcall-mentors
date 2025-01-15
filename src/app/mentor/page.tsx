"use client"

import styles from './mentor.module.css'
import { Page } from '@/components/Page';
import { Headline, Input, Textarea, Button } from '@telegram-apps/telegram-ui';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useSignal, initData } from '@telegram-apps/sdk-react';

export default function Mentor() {
    
  const t = useTranslations('mentor');

  const [success, setSuccess] = useState('');
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const initDataState = useSignal(initData.state);


  const handleSubmit = async () => {
    setIsPending(true);
    // const error = await updateName(name);
    setIsPending(false);
    if (error) {
      setError(error);
    } else {
        setSuccess('Данные сохранены')
    }
    // redirect("/");
  };

    return (
        <Page>
            <section className="content">
                <Headline
                    weight="2"
                    className="header"
                >
                    &nbsp;  •  &nbsp; {t('header')} &nbsp;  •  &nbsp;
                </Headline>
                { 
                    initDataState?.user?.isBot ? <p>{t('not-for-bot')}</p> : 
                    initDataState?.user ? (
                        <form className={styles.form}> 
                            <fieldset className={styles.fieldset}>
                                <Input name="name" header="Имя" placeholder="Напишите свое имя" />
                                <Input name="stack" header="Стек" placeholder="ES6, React, HTML, CSS" />
                                <Input name="price" header="Цена" placeholder="Цена за час консультации" />
                                <Textarea name="description" header="О себе" placeholder="С чем вы можите помочь" />
                                <Input disabled header="UserId" value={initDataState?.user?.id.toString()} />
                                <Input disabled header="Date" value={new Date().toJSON()} />
                            </fieldset>
                            <Button
                                type="submit"
                                Component="button"
                                onClick={handleSubmit}
                                disabled={isPending}
                                mode="outline"
                                size="l"
                                >
                                {t('save')}
                            </Button>
                            {error || success && <p>{error || success}</p>}
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