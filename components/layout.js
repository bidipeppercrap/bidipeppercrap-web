import Head from 'next/head'
import Navbar from './navbar'
import Footer from './footer'

export default function Layout({ children, pageDescription, pageTitle }) {
    const siteTitle = pageTitle + ' - bidipeppercrap'

    return (
        <div className="layout__container">
            <Head>
                <meta name="description" content={pageDescription} />

                <meta property="og:title" content={siteTitle} key="ogtitle" />
                <meta property="og:description" content={pageDescription} key="ogdesc" />

                <title>{siteTitle}</title>
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <link rel="alternate icon" href="/favicon.ico" />
            </Head>
            <Navbar isRightHanded={true}/>
            <main className="page__container">{children}</main>
            <Footer />
        </div>
    )
}