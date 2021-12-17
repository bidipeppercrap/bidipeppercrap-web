import { useRouter } from 'next/router'
import { supabase } from "@/utils/supabaseClient"

import { remark } from 'remark'
import html from 'remark-html'

import Layout from '@/components/layout'

export default function Post({ post }) {
    const router = useRouter()

    return (
        <Layout pageTitle={post.title} pageDescription={post.content}>
            <h1 className="page__title">{post.categories ? post.categories.displayed_name : 'posts'}</h1>
            <div className="post__wrapper">
                {post.thumbnail_url && <img className="post__thumbnail" src={post.thumbnail_url} alt="Thumbnail of this post" />}
                <article className="post">
                    <h3 className="post__title">{post.title}</h3>
                    {post.content && <div className="post__content" dangerouslySetInnerHTML={{ __html: post.content }} />}
                </article>
            </div>
            <a onClick={() => router.back()} className="page__button">👈</a>
        </Layout>
    )
}

export async function getStaticPaths() {
    const { data: posts } = await supabase.from('posts').select('id')

    const paths = posts.map(post => ({ params: { id: post.id } }))

    return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
    const { data: post } = await supabase
        .from('posts')
        .select(`
            title, content, thumbnail_url, created_at,
            categories (
                displayed_name
            )`)
        .eq('id', params.id)
        .single()
    
    const processedContent = await remark()
        .use(html)
        .process(post.content)

    post.content = processedContent.toString()

    return {
        props:
            { post },
        revalidate: 10
    }
}