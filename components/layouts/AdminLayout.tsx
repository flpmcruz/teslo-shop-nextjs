import { FC } from "react"
import { Box, Typography } from "@mui/material"
import { SideMenu } from "../ui"
import { AdminNavBar } from "../admin"

interface Props {
    title: string
    subtitle: string
    icon?: JSX.Element
    children: React.ReactNode
}

export const AdminLayout: FC<Props> = ({children, title, subtitle, icon}) => {
  return (
    <>
        <AdminNavBar/>

        <SideMenu/>

        <main style={{
            margin: '80px auto',
            maxWidth: '1440px',
            padding: '0 30px'
        }}>
            <Box display={'felx'} flexDirection={'column'}>
                <Typography variant="h1" component="h1">
                    {icon}{" "}
                    {title}
                </Typography>
                <Typography variant="h2" sx={{ mb: 1}}>
                    {subtitle}
                </Typography>
            </Box>
            <Box className='fadeIn'>
                {children}
            </Box>
        </main>
    </>
  )
}
