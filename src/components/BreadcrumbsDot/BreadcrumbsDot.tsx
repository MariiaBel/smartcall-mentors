"use client"

import { useTranslations } from 'next-intl';
import { Link } from '@/components/Link/Link';
import styles from './BreadcrumbsDot.module.css'

type TBreadcrumbsProps = {
    breadcrumbs: TBreadcrumb[]
}

type TBreadcrumb= {
    name: string,
    href: string,
    componentName: string
}

export const BreadcrumbsDot = ({breadcrumbs}: TBreadcrumbsProps) => {

  const t = useTranslations();

    return (
        <div className={styles.breadcrumbs}>
            { breadcrumbs.map((item, index: number) => {
                return item.href ? (
                    <Link className={styles.breadcrumbItem} key={index} href={item.href}> {t(item.name)} </Link>
                ) : <span className={styles.breadcrumbItem} key={index}>{t(item.name)}</span>
            })}
        </div>
    )
}