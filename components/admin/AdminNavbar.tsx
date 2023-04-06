import { useContext } from "react";
import NextLink from "next/link"
import { AppBar, Toolbar, Typography, Link, Box, Button } from '@mui/material';
import {  UIContext } from "@/context";

export const AdminNavBar = () => {

    const { toogleSlideMenu } = useContext(UIContext)

    return (
        (
            <AppBar>
                <Toolbar>
                    <NextLink href='/' passHref legacyBehavior>
                        <Link display='flex' alignItems='center'>
                            <Typography variant="h6">Teslo |</Typography>
                            <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                        </Link>
                    </NextLink>

                    <Box flex={1} />

                    <Button onClick={toogleSlideMenu}>
                        Menu
                    </Button>

                </Toolbar>
            </AppBar>
        )
    )
}
