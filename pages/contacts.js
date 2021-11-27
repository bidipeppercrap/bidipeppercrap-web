import { useRouter } from 'next/router'
import { supabase } from '@/utils/supabaseClient'

import Layout from '@/components/layout'
import PageFallback from '@/components/page-fallback'

export default function Contacts({ contacts }) {
    const router = useRouter()

    if (router.isFallback) return <PageFallback />

    return (
        <Layout pageTitle="contacts" pageDescription={'Contacts for bidipeppercrap are listed here'}>
            <h1 className="page__title">contacts</h1>
            <ul className="contact__list">
                {contacts.map((contact) => (
                    <li key={contact.id} className="contact__item">
                        <a target="_blank" href={contact.url} className={!contact.url ? 'contact__no-link' : undefined}>
                            {contact.icon_url &&
                                <img src={contact.icon_url} alt={contact.title + ' icon'} className="contact__icon" />
                            }
                            <p className="contact__description">{contact.description}</p>
                        </a>
                    </li>
                ))}
            </ul>
        </Layout>
    )
}

export async function getStaticProps() {
    const { data: contacts, error } = await supabase.from('contacts').select(`
        id, title, description, url, icon_url
    `)

    return {
        props: {
            contacts
        },
        revalidate: 10
    }
}