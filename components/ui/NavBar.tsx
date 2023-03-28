import { useContext, useState } from "react";
import NextLink from "next/link"
import { useRouter } from "next/router";
import { AppBar, Toolbar, Typography, Link, Box, Button, IconButton, Badge, Input, InputAdornment } from '@mui/material';
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material";
import { UIContext } from "@/context";

export const NavBar = () => {

    const { toogleSlideMenu } = useContext(UIContext)
    const { asPath, push } = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const [isSearchVisible, setIsSearchVisible] = useState(false)

    const onSearchTerm = () => {
        if(searchTerm.trim().length === 0) return
        push(`/search/${searchTerm}`)
    }

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

                    <Box 
                        sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }}
                        className="fadeIn"
                    >
                        <NextLink href='/category/men' passHref legacyBehavior>
                            <Link alignItems='center'>
                                <Button color={(asPath === '/category/men') ? 'primary' : 'info'}>Hombres</Button>
                            </Link>
                        </NextLink>
                        <NextLink href='/category/women' passHref legacyBehavior>
                            <Link alignItems='center'>
                                <Button color={(asPath === '/category/women') ? 'primary' : 'info'}>Mujeres</Button>
                            </Link>
                        </NextLink>
                        <NextLink href='/category/kid' passHref legacyBehavior>
                            <Link alignItems='center'>
                                <Button color={(asPath === '/category/kid') ? 'primary' : 'info'}>kid</Button>
                            </Link>
                        </NextLink>
                    </Box>

                    <Box flex={1} />

                    {
                        isSearchVisible
                        ? ( 
                            <Input
                                sx={{ display: { xs: 'none', sm: 'flex' } }}
                                className="fadeIn"
                                autoFocus
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && onSearchTerm()}
                                type='text'
                                placeholder="Buscar..."
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={ () => setIsSearchVisible(false)}
                                        >
                                            <ClearOutlined />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        )
                        : (
                            <IconButton
                                onClick={ () => setIsSearchVisible(true)}
                                sx={{ display: { xs: 'none', sm: 'flex' } }}
                                className="fadeIn"
                            >
                                <SearchOutlined />
                            </IconButton>
                        )
                    }

                    <IconButton
                        sx={{ display: { xs: 'flex', sm: 'none' } }}
                        onClick={toogleSlideMenu}
                    >
                        <SearchOutlined />
                    </IconButton>

                    <NextLink href='/cart' passHref legacyBehavior>
                        <Link alignItems='center'>
                            <IconButton>
                                <Badge badgeContent={2} color="secondary">
                                    <ShoppingCartOutlined />
                                </Badge>
                            </IconButton>
                        </Link>
                    </NextLink>

                    <Button onClick={toogleSlideMenu}>
                        Menu
                    </Button>

                </Toolbar>
            </AppBar>
        )
    )
}
