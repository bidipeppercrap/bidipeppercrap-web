import { useRouter } from 'next/router'
import { supabase } from '@/utils/supabaseClient'

import Layout from '@/components/layout'
import PageFallback from '@/components/page-fallback'

export default function Contacts({ contacts }) {
    const router = useRouter()

    if (router.isFallback) return <PageFallback />

    return (
        <Layout pageTitle="contacts" pageDescription={'Contacts for bidipeppercrap are listed here'}>
            <h1 className="page__title">Contacts</h1>
            <ul className="contact__list">
                {contacts.map((contact) => (
                    <li key={contact.id} className="contact__item">
                        {contact.title}
                    </li>
                ))}
            </ul>
        </Layout>
    )
}

export async function getStaticProps() {
    const { data: contacts, error } = await supabase.from('contacts').select(`
        id, title, url, icon_url
    `)

    return {
        props: {
            contacts
        }
    }
}