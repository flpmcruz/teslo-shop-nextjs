import NextLink from 'next/link';
import { Box, Typography, Grid, Card, CardContent, Divider, Button, Link } from '@mui/material';
import { CartList, OrderSummary } from '@/components/cart';
import { ShopLayout } from '@/components/layouts/ShopLayout';

const SummaryPage = () => (
    <ShopLayout title={'Resumen de orden'} pageDescription={'Resumen de la orden'}>
        <Typography variant='h1' component='h1'>Resumen de la Orden</Typography>

        <Grid container>
            <Grid item xs={12} sm={7} marginTop={2}>
                <CartList />
            </Grid>
            <Grid item xs={12} sm={5}>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>Resumen (3 productos)</Typography>
                        <Divider sx={{ my: 1 }} />

                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Direccion de entrega</Typography>
                            <NextLink href={'/checkout/address'} passHref legacyBehavior>
                                <Link underline='always'>
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>

                        <Typography>Felipe Mireles</Typography>
                        <Typography>Situllsda, Hya 245</Typography>
                        <Typography>Panama</Typography>
                        <Typography>+507 64897354</Typography>

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

export default SummaryPage