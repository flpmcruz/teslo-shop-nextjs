import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

import { AuthLayout } from '@/components/layouts'
import { validations } from '@/utils';
import { AuthContext } from '@/context';

type FormData = {
    email: string
    password: string
};

const LoginPage = () => {

    const router = useRouter()
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const { loginUser } = useContext(AuthContext)
    const [showError, setShowError] = useState(false)

    const destination = router.query.p?.toString() || '/'
    const onSubmit = async ({ email, password }: FormData) => {

        const isValidLogin = await loginUser(email, password)

        if (!isValidLogin) {
            setShowError(true)
            setTimeout(() => setShowError(false), 3000)
            return
        }
        router.replace(destination)
    }

    return (
        <AuthLayout title={'Ingresar'}>
            <form onSubmit={handleSubmit(onSubmit)}> {/* Llama onSubmit si pasan las validaciones */}
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component="h1">Iniciar Sesión</Typography>

                            <Chip
                                label='No reconocemos este correo electrónico o la contrasena'
                                color='error'
                                icon={<ErrorOutline />}
                                className='fadeIn'
                                sx={{ display: showError ? 'flex' : 'none', mt: 2 }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                type="email"
                                label="Correo"
                                variant="filled"
                                fullWidth

                                /* Validacion del campo */
                                {
                                ...register('email', {
                                    required: 'Este campo es requerido',
                                    validate: (email) => validations.isEmail(email) /* Validacion personalizada */
                                })}
                                error={!!errors.email} /* chequeo si el objeto errors tiene un error */
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Contraseña"
                                type='password'
                                variant="filled"
                                fullWidth
                                /* Validacion del campo */
                                {
                                ...register('password', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
                                })}

                                /* errors lo retorna el react-hook-form */
                                error={!!errors.password} /* chequeo si el objeto errors tiene un error */
                                helperText={errors.password?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type='submit'
                                color="secondary"
                                className='circular-btn'
                                size='large'
                                fullWidth>
                                Ingresar
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <NextLink href={`/auth/register?p=${destination}`} passHref legacyBehavior>
                                <Link underline='always'>
                                    ¿No tienes cuenta?
                                </Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export default LoginPage