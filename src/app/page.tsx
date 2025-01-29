'use client';

import { Section, Subheadline, Button, Headline } from '@telegram-apps/telegram-ui';
import { useTranslations } from 'next-intl';

import { Link } from '@/components/Link/Link';
import { Page } from '@/components/Page';
import styles from './page.module.css';

export default function Home() {
  const t = useTranslations();

  return (
    <Page back={false}>
        <section className='content'>
          <header className="header">
            <Headline
                weight="2"
            >
              &nbsp;  •  &nbsp; SmartCall &nbsp;  •  &nbsp;
            </Headline>
            <Subheadline
              level="2"
              weight="3"
            >
                {t('main-header')}
            </Subheadline>
          </header>

          <div className={styles.btns}>
            <Button
              mode="outline"
              size="l"
            >
              <Link href='/mentor'>{t('mentor_card')}</Link>
            </Button>
            <Button
              mode="outline"
              size="l"
            >
              <Link href='/mentor'>{t('list-of-mentors')}</Link>
            </Button>
          </div>

          <Section.Footer className='footer'>
            {t('main-footer')} &nbsp;  •  &nbsp;
            {<Link href="https://t.me/MariiaBel">@MariiaBel</Link>}
          </Section.Footer>
        </section>
    </Page>
  );
}
