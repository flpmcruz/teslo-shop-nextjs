import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { useForm, Controller } from "react-hook-form";
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

const getAddressFromCookies = (cleanRender: boolean): FormData => {
	return {
		firstName: cleanRender ? '' : Cookies.get('firstName') || '',
		lastName: cleanRender ? '' : Cookies.get('lastName') || '',
		address: cleanRender ? '' : Cookies.get('address') || '',
		address2: cleanRender ? '' : Cookies.get('address2') || '',
		zip: cleanRender ? '' : Cookies.get('zip') || '',
		city: cleanRender ? '' : Cookies.get('city') || '',
		country: cleanRender ? '' : Cookies.get('country') || '',
		phone: cleanRender ? '' : Cookies.get('phone') || ''
	};
};


const AddressPage = () => {

    const router = useRouter()
	const {
		reset,
		control,
		handleSubmit,
		formState: { errors }
	} = useForm<FormData>({
		defaultValues: { ...getAddressFromCookies(true) }
	});

	useEffect(() => {
		reset(getAddressFromCookies(false));
	}, [reset]);

    const { shippingAddress, updateShippingAddress } = useContext(CartContext)

    const onSubmitAddress = async (data: FormData) => {
        updateShippingAddress(data)
        router.push('/checkout/summary')
    }

    return (
		<ShopLayout title='Dirección' pageDescription='Confirmar dirección del destino'>
			<form onSubmit={handleSubmit(onSubmitAddress)}>
				<Typography variant='h1' component='h1'>
					Dirección
				</Typography>

				<Grid container spacing={2} sx={{ mt: 2 }}>
					<Grid item xs={12} sm={6}>
						<Controller
							name='firstName'
							control={control}
							rules={{ required: 'Este campo es requerido' }}
							defaultValue={''}
							render={({ field }) => (
								<TextField
									label='Nombre'
									variant='filled'
									value={field.value}
									onChange={field.onChange}
									fullWidth
									error={!!errors.firstName}
									helperText={errors.firstName?.message}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Controller
							name='lastName'
							control={control}
							rules={{ required: 'Este campo es requerido' }}
							defaultValue={''}
							render={({ field }) => (
								<TextField
									label='Apellido'
									variant='filled'
									value={field.value}
									onChange={field.onChange}
									fullWidth
									error={!!errors.lastName}
									helperText={errors.lastName?.message}
								/>
							)}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<Controller
							name='address'
							control={control}
							rules={{ required: 'Este campo es requerido' }}
							defaultValue={''}
							render={({ field }) => (
								<TextField
									label='Dirección'
									variant='filled'
									value={field.value}
									onChange={field.onChange}
									fullWidth
									error={!!errors.address}
									helperText={errors.address?.message}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Controller
							name='address2'
							control={control}
							defaultValue={''}
							render={({ field }) => (
								<TextField
									label='Dirección 2 (opcional)'
									variant='filled'
									value={field.value}
									onChange={field.onChange}
									fullWidth
								/>
							)}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<Controller
							name='zip'
							control={control}
							rules={{ required: 'Este campo es requerido' }}
							defaultValue={''}
							render={({ field }) => (
								<TextField
									label='Código Postal'
									variant='filled'
									value={field.value}
									onChange={field.onChange}
									fullWidth
									error={!!errors.zip}
									helperText={errors.zip?.message}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Controller
							name='city'
							control={control}
							rules={{ required: 'Este campo es requerido' }}
							defaultValue={''}
							render={({ field }) => (
								<TextField
									label='Ciudad'
									variant='filled'
									value={field.value}
									onChange={field.onChange}
									fullWidth
									error={!!errors.city}
									helperText={errors.city?.message}
								/>
							)}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<Controller
							name='country'
							control={control}
							rules={{ required: 'Este campo es requerido' }}
							defaultValue={''}
							render={({ field }) => (
								<FormControl fullWidth error={!!errors.country}>
									<InputLabel>Country</InputLabel>
									<Select {...field} label='Country'>
										{countries.map(country => (
											<MenuItem key={country.code} value={country.code}>
												{country.name}
											</MenuItem>
										))}
									</Select>
									<FormHelperText>{errors.country?.message}</FormHelperText>
								</FormControl>
							)}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Controller
							name='phone'
							control={control}
							rules={{ required: 'Este campo es requerido' }}
							defaultValue={''}
							render={({ field }) => (
								<TextField
									label='Teléfono'
									variant='filled'
									value={field.value}
									onChange={field.onChange}
									fullWidth
									error={!!errors.phone}
									helperText={errors.phone?.message}
								/>
							)}
						/>
					</Grid>
				</Grid>

				<Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
					<Button type='submit' color='secondary' className='circular-btn' size='large'>
						Revisar pedido
					</Button>
				</Box>
			</form>
		</ShopLayout>
	);
};


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