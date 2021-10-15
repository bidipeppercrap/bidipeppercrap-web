import Head from 'next/head'

export default function Layout({ children, pageDescription, pageTitle }) {
    const siteTitle = pageTitle + ' - bidipeppercrap'
    
    return (
        <div className="layout__container">
            <Head>
                <meta charSet="utf-8" />
                <meta name="description" content={pageDescription} />

                <meta property="og:title" content={siteTitle} key="ogtitle" />
                <meta property="og:description" content={pageDescription} key="ogdesc" />

                <title>{siteTitle}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="page__container">{children}</main>
        </div>
    )
}