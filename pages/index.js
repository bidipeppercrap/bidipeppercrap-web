import { supabase } from '@/utils/supabaseClient'

import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/layout'

import logo_long from '../public/logo_long.svg'

export default function Home({ posts, contacts }) {
  return (
    <Layout pageTitle="home" pageDescription="Welcome to the bidipeppercrap.com">
      <div className="main-page__logo">
        <Image
          src={logo_long}
          alt="bidipeppercrap logo long"
          width={220}
          height={28}
          priority={true}
        />
      </div>
      {posts &&
        <div className="new-posts">
          <h1 className="new-posts__title">new posts</h1>
          <ul className="new-posts__list">
            {posts.map(post => (
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
            <li className="load-more">
              <Link href={`/posts/1`}>
                <a>👉</a>
              </Link>
            </li>
          </ul>
        </div>
      }
      {contacts &&
        <div className="main-page__contacts">
          <h1 className="main-page__contacts__title">contacts</h1>
          <ul className="main-page__contacts__list">
            {contacts.map(contact => (
              <li key={contact.id} className="main-page__contacts__item">
                <Link href={contact.url}>
                  <a>
                    <img src={contact.icon_url} alt={contact.title} />
                  </a>
                </Link>
              </li>
            ))}
            <li className="main-page__contacts__item load-more">
              <Link href="/contacts">
                <a>👉</a>
              </Link>
            </li>
          </ul>
        </div>
      }
    </Layout>
  )
}

export async function getStaticProps() {
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, thumbnail_url')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .range(0, 5)
  
  const { data: contacts } = await supabase
    .from('contacts')
    .select('id, title, description, url, icon_url')
    .neq('url', null)
    .neq('icon_url', null)
    .range(0, 9)

  return { props: { posts, contacts } }
}