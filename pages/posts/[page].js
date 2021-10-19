import { supabase } from '@/utils/supabaseClient'

import Link from 'next/link'
import Layout from '@/components/layout'

export default function PostsPage({ posts, currentPage }) {
    return (
        <Layout pageTitle="posts" pageDescription={'Page ' + currentPage + ' of posts'}>
            <h1 className="page__title">posts</h1>
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