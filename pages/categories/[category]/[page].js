import { useRouter } from 'next/router'
import { supabase } from "@/utils/supabaseClient"

import PageFallback from '@/components/page-fallback'

export default function CategoryPage({ posts, currentPage }) {
    const router = useRouter()

    if (router.isFallback) return (<PageFallback />)

    return (
        <div>
            <h1>{currentPage}</h1>
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

    categories.forEach(async (c) => {
        const { data, error, count } = await supabase
            .from('posts')
            .select('id', { count: 'exact', head: true })
            .eq('category_id', c.id)

        const pages = []
        for (let i = 0; i < count; i++) {
            pages.push({
                params: {
                    page: i + 1,
                    categoryId: c.id,
                    category: c.name,
                    displayedName: c.displayed_name
                }
            })
        }

        paths = [...pages]
    })

    return { paths, fallback: true }
}

export async function getStaticProps({ params }) {
    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, title')
        .eq('category_id', params.categoryId)

    return { props: { posts, category: params.category, currentPage: params.page, displayedName: params.displayedName } }
}