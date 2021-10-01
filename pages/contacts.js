import { supabase } from '@/utils/supabase-client'

export default function Contacts({ contacts }) {
    return (
        <div className="page__layout">
            <h1 className="page__title">Contacts</h1>
            <ul className="contact__list">
                {contacts.map((contact) => (
                    <li key={contact.id} className="contact__item">
                        {contact.title}
                    </li>
                ))}
            </ul>
        </div>
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