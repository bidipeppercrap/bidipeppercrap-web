import Head from 'next/head'

export const siteTitle = "bidipeppercrap"

export default function Layout({ children }) {
    return (
        <div className="layout__container">
            <Head>
                <title>bidipeppercrap</title>
                <meta name="description" content="Everything about bidipeppercrap can be found here :)" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>{children}</main>
        </div>
    )
}