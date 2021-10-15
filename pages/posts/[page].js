import { supabase } from '@/utils/supabaseClient'

import Head from 'next/head'
import Layout, { siteTitle } from '@/components/layout'

export default function PostsPage({ posts, currentPage }) {
    return (
        <Layout>
            <Head>
                <title>Posts - {siteTitle}</title>
            </Head>

            <h1 className="page__title">Posts</h1>
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
    const skip = process.env.NEXT_PAGINATION_SKIP
    const { count } = await supabase
        .from('posts')
        .select('id', { count: 'exact', head: true })
        .eq('is_published', true)
    
    const pageCount = Math.ceil(count / skip)
    const paths = []

    for (let i = 0; i < pageCount; i++) {
        paths.push({
            params: {
                page: (i + 1).toString()
            }
        })
    }

    return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
    const skip = process.env.NEXT_PAGINATION_SKIP
    const { page: currentPage } = params
    const startIndex = (currentPage - 1) * skip
    const endIndex = startIndex + (skip - 1)

    const { data: posts } = await supabase
        .from('posts')
        .select('id, title, thumbnail_url')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .range(startIndex, endIndex)
    
    return { props: { posts, currentPage } }
}