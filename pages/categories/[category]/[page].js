import { supabase } from "@/utils/supabaseClient"

import Link from 'next/link'
import Layout from '@/components/layout'
import Pagination from '@/components/pagination'
import Nothing from '@/components/nothing'

export default function CategoryPage({ posts, currentPage, pageCount, categoryId, displayedName }) {
    return (
        <Layout pageTitle={displayedName} pageDescription={'Page ' + currentPage + ' of ' + displayedName}>
            <h1 className="page__title">{displayedName}</h1>
            <ul className="post__list">
                {!posts.length && <Nothing />}
                {posts.length && posts.map(post => (
                    <li key={post.id} className="post__wrapper">
                        <Link href={`/post/${post.id}`}>
                            <a>
                                {post.thumbnail_url && <img className="post__thumbnail" src={post.thumbnail_url} alt="Thumbnail of this post" />}
                                <article className="post">
                                    <h2 className="post__title">{post.title}</h2>
                                </article>
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>
            <Pagination url={`/categories/${categoryId}`} currentPage={currentPage} pageCount={pageCount} />
        </Layout>
    )
}

export async function getStaticPaths() {
    const skip = process.env.NEXT_PAGINATION_SKIP
    const paths = []
    const { data: categories } = await supabase.from('categories').select('id')

    if (!categories.length) return { paths, fallback: false }

    for (const category of categories) {
        const { count } = await supabase
        .from('posts')
        .select('id', { count: 'exact', head: true })
        .eq('category_id', category.id)
        .eq('is_published', true)

        const pageCount = Math.ceil(count / skip)

        for (let i = 0; i < pageCount; i++) {
            paths.push({
                params: {
                    page: (i + 1).toString(),
                    category: category.id,
                },
            })
        }
    }

    return { paths, fallback: 'blocking' }
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

    const { data: posts, count } = await supabase
        .from('posts')
        .select('id, title, thumbnail_url', { count: 'exact' })
        .eq('category_id', categoryId)
        .eq('is_published', true)
        .order('is_highlighted', { ascending: false })
        .order('created_at', { ascending: false })
        .range(startIndex, endIndex)

    const pageCount = Math.ceil(count / skip)

    return {
        props:
            { posts, currentPage, pageCount, categoryId, displayedName: category.displayed_name },
        revalidate: 10
    }
}