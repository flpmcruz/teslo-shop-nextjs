import { GetServerSideProps, NextPage } from 'next';
import { Box, Typography, Grid, Card, CardContent, Divider, Chip } from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { CartList, OrderSummary } from '@/components/cart';
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';
import { AdminLayout } from '@/components/layouts';

interface Props {
    order: IOrder
}

const OrderPage: NextPage<Props> = ({ order }) => {

    const { shippingAddress } = order;

    return (

        <AdminLayout 
            title={'Resumen de la orden'} 
            subtitle={`Order Id: ${order._id!.toString()}`}
            icon={<CreditScoreOutlined />}
        >

            {order.isPaid
                ?
                (
                    <Chip
                        sx={{ my: 2 }}
                        label='Orden ya fue Pagada'
                        variant='outlined'
                        color='success'
                        icon={<CreditScoreOutlined />}
                    />)
                :
                (
                    <Chip
                        sx={{ my: 2 }}
                        label='Pendiente de pago'
                        variant='outlined'
                        color='error'
                        icon={<CreditCardOffOutlined />}
                    />
                )
            }

            <Grid container className='fadeIn'>
                <Grid item xs={12} sm={7} marginTop={2}>
                    <CartList products={order.orderItems}/>
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Resumen ({order.numberOfItems} productos)</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Direccion de entrega</Typography>
                            </Box>

                            <Typography>{shippingAddress.firstName} {shippingAddress.lastName}</Typography>
                            <Typography>{shippingAddress.address} {shippingAddress.address2 ? shippingAddress.address2 : ''}</Typography>
                            <Typography>{shippingAddress.country}</Typography>
                            <Typography>{shippingAddress.phone}</Typography>

                            <Divider sx={{ my: 1 }} />

                            <OrderSummary
                                orderValues={{
                                    numberOfItems: order.numberOfItems,
                                    subTotal: order.subTotal,
                                    tax: order.tax,
                                    total: order.total
                                }}
                            />

                            {order.isPaid
                                ?
                                (
                                    <Chip
                                        sx={{ my: 2 }}
                                        label='Orden ya fue Pagada'
                                        variant='outlined'
                                        color='success'
                                        icon={<CreditScoreOutlined />}
                                    />)
                                :
                                (
                                    <Chip
                                        sx={{ my: 2 }}
                                        label='Pendiente de pago'
                                        variant='outlined'
                                        color='error'
                                        icon={<CreditCardOffOutlined />}
                                    />
                                )
                            }
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </AdminLayout>
    )
}


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const { id = '' } = query;

    //Verify if order exists
    const order = await dbOrders.getOrderById(id.toString())
    if (!order) {
        return {
            redirect: {
                destination: '/admin/orders',
                permanent: false
            }
        }
    }

    return {
        props: {
            order
        }
    }
}


export default OrderPage