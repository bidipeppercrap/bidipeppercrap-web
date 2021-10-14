import { useRouter } from 'next/router'
import { supabase } from "@/utils/supabaseClient"

import PageFallback from '@/components/page-fallback'

export default function CategoryPage({ posts, currentPage, displayedName }) {
    const router = useRouter()

    if (router.isFallback) return (<PageFallback />)

    return (
        <div>
            <h1>{displayedName}</h1>
            <ul>
                {posts.map(post => (
                    <li>{post.title}</li>
                ))}
            </ul>
        </div>
    )
}

export async function getStaticPaths() {
    let paths = []
    const { data: categories, error } = await supabase.from('categories').select('id, name, displayed_name')

    for (const category of categories) {
        const { data, error, count } = await supabase
        .from('posts')
        .select('id', { count: 'exact', head: true })
        .eq('category_id', category.id)

        for (let i = 0; i < count; i++) {
            paths.push({
                params: {
                    page: (i + 1).toString(),
                    categoryId: category.id,
                    category: category.name,
                    displayedName: category.displayed_name,
                },
            })
        }
    }

    return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
    const { page: currentPage, displayedName, categoryId } = params

    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, title')
        .eq('category_id', categoryId)

    return { props: { posts, currentPage, displayedName }}
}