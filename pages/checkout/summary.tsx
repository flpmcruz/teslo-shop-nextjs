import { useContext } from 'react';
import NextLink from 'next/link';
import { Box, Typography, Grid, Card, CardContent, Divider, Button, Link } from '@mui/material';
import { CartList, OrderSummary } from '@/components/cart';

import { ShopLayout } from '@/components/layouts/ShopLayout';
import { CartContext } from '@/context';
import { countries } from '@/utils/countries'

const SummaryPage = () => {

    const { shippingAddress, numberOfItems } = useContext(CartContext)

    if (!shippingAddress) {
        return <></>
    }

    let { firstName, lastName, address, address2, city, zip, country, phone } = shippingAddress

    return (
        <ShopLayout title={'Resumen de orden'} pageDescription={'Resumen de la orden'}>
            <Typography variant='h1' component='h1'>Resumen de la Orden</Typography>

            <Grid container>
                <Grid item xs={12} sm={7} marginTop={2}>
                    <CartList />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Resumen ({numberOfItems} productos)</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Direccion de entrega</Typography>
                                <NextLink href={'/checkout/address'} passHref legacyBehavior>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <Typography>{firstName} {lastName}</Typography>
                            <Typography>{address} {address2} {city} {zip}</Typography>
                            <Typography>{ countries.find( c => c.code === country)?.name  }</Typography>
                            <Typography>{phone}</Typography>

                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='end'>
                                <NextLink href={'/cart'} passHref legacyBehavior>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <OrderSummary />

                            <Box sx={{ mt: 3 }}>
                                <Button color='secondary' className='circular-btn' fullWidth>
                                    Confirmar orden
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

//Ya no necesito validarlo aqui porque estoy usando un middleware
// export const getServerSideProps: GetServerSideProps = async ({req}) => {

//     const { token = '' } = req.cookies
//     let isValidToken = false

//     try {
//         await jwt.isValidToken(token)
//         isValidToken = true
//     } catch (error) {
//         isValidToken = false
//     }

//     if (!isValidToken) {
//         return {
//             redirect: {
//                 destination: '/auth/login?p=/checkout/address',
//                 permanent: false
//             }
//         }
//     }

//     return {
//         props: {}
//     }
// }

export default SummaryPage