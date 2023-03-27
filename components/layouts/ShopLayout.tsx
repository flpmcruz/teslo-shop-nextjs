import { FC } from "react"
import Head from "next/head"
import { NavBar, SideMenu } from "../ui"

interface Props {
    title: string
    pageDescription: string
    imageFullUrl?: string
    children: React.ReactNode
}

export const ShopLayout: FC<Props> = ({children, title, pageDescription, imageFullUrl}) => {
  return (
    <>
        <Head>
            <title>{title}</title>
            <meta name="description" content={pageDescription} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={pageDescription} />
            {
                imageFullUrl && <meta property="og:image" content={imageFullUrl} />
            }
        </Head>

        <NavBar/>

        <SideMenu/>

        <main style={{
            margin: '80px auto',
            maxWidth: '1440px',
            padding: '0 30px'
        }}>
            {children}
        </main>

        <footer>
            {/* TODO */}
        </footer>
    </>
  )
}
