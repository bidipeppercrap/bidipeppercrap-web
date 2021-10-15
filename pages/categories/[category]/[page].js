import { useRouter } from 'next/router'
import { supabase } from "@/utils/supabaseClient"

import Head from 'next/head'
import Layout, {siteTitle} from '@/components/layout'
import PageFallback from '@/components/page-fallback'
import Nothing from '@/components/nothing'

export default function CategoryPage({ posts, currentPage, displayedName }) {
    const router = useRouter()

    if (router.isFallback) return (<PageFallback />)

    return (
        <Layout>
            <Head>
                <title>{displayedName} - {siteTitle}</title>
            </Head>
    
            <h1 className="page__title">{displayedName}</h1>
            <ul className="post__list">
                {!posts.length && <Nothing />}
                {posts.length && posts.map(post => (
                    <li key={post.id} className="post__wrapper">
                        <article className="post">
                            <h2 className="post__title">{post.title}</h2>
                        </article>
                    </li>
                ))}
            </ul>
        </Layout>
    )
}

export async function getStaticPaths() {
    const paths = []
    const { data: categories } = await supabase.from('categories').select('id')

    if (!categories.length) return { paths, fallback: false }

    for (const category of categories) {
        const { count } = await supabase
        .from('posts')
        .select('id', { count: 'exact', head: true })
        .eq('category_id', category.id)

        for (let i = 0; i < count; i++) {
            paths.push({
                params: {
                    page: (i + 1).toString(),
                    category: category.id,
                },
            })
        }
    }

    return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
    const { page: currentPage, category: categoryId } = params
    const skip = process.env.NEXT_PAGINATION_SKIP
    const pageIndex = currentPage - 1
    const startIndex = pageIndex * skip
    const endIndex = startIndex + (skip - 1)

    const { data: category } = await supabase
        .from('categories')
        .select('displayed_name')
        .eq('id', categoryId)
        .single()

    const { data: posts } = await supabase
        .from('posts')
        .select('id, title')
        .eq('category_id', categoryId)
        .eq('is_published', true)
        .range(startIndex, endIndex)

    return { props: { posts, currentPage, displayedName: category.displayed_name }}
}