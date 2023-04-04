import { FC, useContext } from 'react';
import { Grid, Typography } from "@mui/material"

import { CartContext } from '@/context';
import { currency } from '@/utils'

interface Props { 
    orderValues?: {
        numberOfItems: number
        subTotal: number
        tax: number
        total: number
    }
}

export const OrderSummary: FC<Props> = ({orderValues}) => {

    const { numberOfItems, subTotal, tax, total } = useContext(CartContext)
    const values = orderValues ? orderValues : { numberOfItems, subTotal, tax, total }

    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography>
                    No. Productos
                </Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>
                    {values.numberOfItems}
                </Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>
                    Subtotal
                </Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>
                    {currency.format(values.subTotal)}
                </Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>
                    Impuestos ({`${Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100 || 0}`}%)
                </Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>
                    {currency.format(values.tax)}
                </Typography>
            </Grid>

            <Grid item xs={6} sx={{ mt:1 }}>
                <Typography variant="subtitle1">
                    Total:
                </Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography variant="subtitle1">
                    {currency.format(values.total)}
                </Typography>
            </Grid>
        </Grid>
    )
}
