import { supabase } from "@/utils/supabase-client"

export default function Category({ posts, title }) {
    return (
        <div>
            <h1>{title}</h1>
        </div>
    )
}

export async function getStaticPaths() {
    const { data: categories, error } = await supabase.from('categories').select('id, name')

    const paths = categories.map((category) => ({
        params: { id: category.id, category: category.name }
    }))

    return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
    const { data: posts, error } = await supabase.from('posts').select(`
        id, title, content
    `)

    return { props: { posts, title: params.category } }
}