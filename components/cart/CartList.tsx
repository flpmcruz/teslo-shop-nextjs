import { FC, useContext } from 'react';
import NextLink from "next/link";
import { Typography, Grid, Link, CardActionArea, CardMedia, Box, Button } from '@mui/material';
import { ItemCounter } from "../ui";
import { CartContext } from '@/context';
import { ICartProduct, IOrderItem } from '@/interfaces';

interface Props {
    editable?: boolean
    products?: IOrderItem[]
}

export const CartList: FC<Props> = ({ editable = false, products = [] }) => {

    const { cart, updateCartQuantity, removeCartQuantity } = useContext(CartContext)

    const onNewCartQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
        product.quantity = newQuantityValue
        updateCartQuantity(product)
    }

    // Para poder reutilizar el mismo componente en la pagina de carrito y en la pagina de checkout
    const productsToShow = products.length > 0 ? products : cart

    return (
        <>
            {
                productsToShow.map(product => (
                    <Grid container spacing={2} key={product.slug + product.size} sx={{ mb: 1 }}>
                        <Grid item xs={3}>
                            {/* Llevara la pagina del producto */}
                            <NextLink href={`/product/${product.slug}`} passHref legacyBehavior>
                                <Link>
                                    <CardActionArea>
                                        <CardMedia
                                            component="img"
                                            image={`${product.image}`}
                                            sx={{ borderRadius: '5px' }}
                                        />
                                    </CardActionArea>
                                </Link>
                            </NextLink>
                        </Grid>
                        <Grid item xs={7}>
                            <Box display='flex' flexDirection='column'>
                                <Typography variant="body1">{product.title}</Typography>
                                <Typography variant="body1">Talla: <strong>{product.size}</strong></Typography>

                                {
                                    editable
                                        ? <ItemCounter
                                            currentValue={product.quantity}
                                            maxValue={5}
                                            updateQuantity={(value) => onNewCartQuantityValue(product as ICartProduct, value)}
                                        />
                                        : <Typography variant="subtitle1">Cantidad: <strong>{product.quantity} { product.quantity === 1 ? 'producto' : 'productos'}</strong></Typography>
                                }

                            </Box>
                        </Grid>
                        <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                            <Typography variant='subtitle1'>${product.price}</Typography>

                            {
                                editable &&
                                    (
                                        <Button 
                                            variant="text" 
                                            color="secondary"
                                            onClick={() => removeCartQuantity(product as ICartProduct)}
                                        >
                                            Remover
                                        </Button>
                                    )
                            }

                        </Grid>
                    </Grid>
                ))
            }
        </>
    )
}
