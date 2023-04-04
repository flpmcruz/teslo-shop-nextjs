import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { OrderResponseBody } from "@paypal/paypal-js"
import { Box, Typography, Grid, Card, CardContent, Divider, Link, Chip, CircularProgress } from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { CartList, OrderSummary } from '@/components/cart';
import { ShopLayout } from '@/components/layouts/ShopLayout';
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';
import { tesloApi } from '@/api';

interface Props {
    order: IOrder
}

/* export type OrderResponseBody = {
    id: string;
    status: 
        | "COMPLETED"
        | "SAVED"
        | "APPROVED"
        | "VOIDED"
        | "PAYER_ACTION_REQUIRED"
} */

const OrderPage: NextPage<Props> = ({ order }) => {

    const { shippingAddress } = order;
    const router = useRouter();
    const [isPaying, setIsPaying] = useState(false)

    const onOrderCompleted = async( details: OrderResponseBody) => {
        if(details.status !== 'COMPLETED'){
            return alert('Error al procesar el pago')
        }
        setIsPaying(true)

        try {
            const {data} = await tesloApi.post(`/orders/pay`, {
                orderId: order._id,
                transactionId: details.id
            })

            router.reload()
        } catch (error) {
            setIsPaying(false)
            console.log(error)
            alert('Error al procesar el pago')
        }
    }

    return (

        <ShopLayout title={'Resumen de la orden'} pageDescription={'Resumen de la orden'}>
            <Typography variant='h1' component='h1'>Orden: {order._id}</Typography>

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

                            <Box sx={{ mt: 3 }}>

                                <Box 
                                    display={'flex'} 
                                    justifyContent={'center'}
                                    sx={{ display: isPaying ? 'flex' : 'none' }}
                                >
                                    <CircularProgress/>
                                </Box>

                                <Box
                                    flexDirection={'column'}
                                    sx={{ display: isPaying ? 'none' : 'flex' }}
                                    flex={1}
                                >
                                    {order.isPaid
                                        ? (
                                            <Chip
                                            sx={{ my: 2 }}
                                            label='Orden ya fue Pagada'
                                            variant='outlined'
                                            color='success'
                                            icon={<CreditScoreOutlined />}
                                            />
                                        )
                                        : (
                                            <PayPalButtons
                                                createOrder={(data, actions) => {
                                                    return actions.order.create({
                                                        purchase_units: [
                                                            {
                                                                amount: {
                                                                    value: `${order.total}`,
                                                                },
                                                            },
                                                        ],
                                                    });
                                                }}
                                                onApprove={(data, actions) => {
                                                    return actions.order!.capture().then((details) => {
                                                        
                                                        onOrderCompleted(details)
                                                    });
                                                }}
                                            />
                                        )
                                    }
                                </Box>

                                
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const { id = '' } = query;

    //Verify if user is logged in
    const session: any = await getSession({ req });
    if (!session) {
        return {
            redirect: {
                destination: `/auth/login?p=orders/${id}`,
                permanent: false
            }
        }
    }

    //Verify if order exists
    const order = await dbOrders.getOrderById(id.toString())
    if (!order) {
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false
            }
        }
    }

    //Verify if order belongs to user
    if (order.user !== session.user._id) {
        return {
            redirect: {
                destination: `/orders/history`,
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