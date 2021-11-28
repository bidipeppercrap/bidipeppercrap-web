import { supabase } from '@/utils/supabaseClient'

import Link from 'next/link'
import Layout from '@/components/layout'
import Pagination from '@/components/pagination'

export default function PostsPage({ posts, currentPage, pageCount }) {
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
                                    <h3 className="post__title">{post.title}</h3>
                                </article>
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>
            <Pagination currentPage={currentPage} pageCount={pageCount} url="/posts" />
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

    return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
    const skip = process.env.NEXT_PAGINATION_SKIP
    const { page: currentPage } = params
    const startIndex = (currentPage - 1) * skip
    const endIndex = startIndex + (skip - 1)

    const { data: posts, count } = await supabase
        .from('posts')
        .select('id, title, thumbnail_url', { count: 'exact' })
        .eq('is_published', true)
        .eq('include_in_posts', true)
        .order('is_highlighted', { ascending: false })
        .order('created_at', { ascending: false })
        .range(startIndex, endIndex)

    const pageCount = Math.ceil(count / skip)
    
    return { props: { posts, currentPage, pageCount }, revalidate: 10 }
}