import { useContext } from "react";
import { useRouter } from "next/router";
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, TextField, Typography } from "@mui/material"
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

import { ShopLayout } from "@/components/layouts"
import { countries } from "@/utils";
import { CartContext } from "@/context";

type FormData = {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
}

const getAddreesFromCookies = (): FormData => {
    return {
        firstName: Cookies.get('firstName') || '',
        lastName: Cookies.get('lastName') || '',
        address: Cookies.get('address') || '',
        address2: Cookies.get('address2') || '',
        zip: Cookies.get('zip') || '',
        city: Cookies.get('city') || '',
        country: Cookies.get('country') || countries[0].code,
        phone: Cookies.get('phone') || '',
    }
}

const AddressPage = () => {

    const router = useRouter()
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: getAddreesFromCookies()
    });

    const { shippingAddress, updateShippingAddress } = useContext(CartContext)

    const onSubmit = async (data: FormData) => {
        updateShippingAddress(data)
        router.push('/checkout/summary')
    }

    return (
        <ShopLayout title={"Direccion"} pageDescription={"Confirmar direccion del destino"}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Typography variant="h1" component='h1'>Direccion</Typography>

                <Grid container spacing={2} sx={{ mt: 2 }} >
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Nombre'
                            variant="filled"
                            fullWidth
                            /* Validacion del campo */
                            {
                            ...register('firstName', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.firstName} /* chequeo si el objeto errors tiene un error */
                            helperText={errors.firstName?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Apellido'
                            variant="filled"
                            fullWidth
                            /* Validacion del campo */
                            {
                            ...register('lastName', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.lastName} /* chequeo si el objeto errors tiene un error */
                            helperText={errors.lastName?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Direccion'
                            variant="filled"
                            fullWidth
                            /* Validacion del campo */
                            {
                            ...register('address', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.address} /* chequeo si el objeto errors tiene un error */
                            helperText={errors.address?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Direccion 2 (opcional)'
                            variant="filled"
                            fullWidth
                            {...register('address2')}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Codigo Postal'
                            variant="filled"
                            fullWidth
                            /* Validacion del campo */
                            {
                            ...register('zip', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.zip} /* chequeo si el objeto errors tiene un error */
                            helperText={errors.zip?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Ciudad'
                            variant="filled"
                            fullWidth
                            /* Validacion del campo */
                            {
                            ...register('city', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.city} /* chequeo si el objeto errors tiene un error */
                            helperText={errors.city?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <TextField
                                select
                                defaultValue={shippingAddress?.country || countries[0].code}
                                variant="filled"
                                label="Pais"
                                /* Validacion del campo */
                                {
                                ...register('country', {
                                    required: 'Este campo es requerido',
                                })}
                                error={!!errors.country}
                            >
                                {
                                    countries.map((country) => (
                                        <MenuItem key={country.code} value={country.code}>{country.name}</MenuItem>
                                    ))
                                }
                            </TextField>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Telefono'
                            variant="filled"
                            fullWidth
                            /* Validacion del campo */
                            {
                            ...register('phone', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.phone} /* chequeo si el objeto errors tiene un error */
                            helperText={errors.phone?.message}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
                    <Button
                        color="secondary"
                        className="circular-btn"
                        size="large"
                        type="submit"
                    >
                        Revisar Pedido
                    </Button>
                </Box>
            </form>
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

export default AddressPage