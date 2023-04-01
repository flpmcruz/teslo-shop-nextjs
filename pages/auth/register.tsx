import { useContext, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { getSession, signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

import { AuthLayout } from '@/components/layouts'
import { validations } from '@/utils';
import { AuthContext } from '@/context';

type FormData = {
    email: string
    password: string
    name: string
};

const RegisterPage = () => {

    const router = useRouter()
    const { registerUser } = useContext(AuthContext)
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const destination = router.query.p?.toString() || '/'
    const onRegisterForm = async ({ email, password, name }: FormData) => {

        setShowError(false)

        const { hasError, message } = await registerUser(email, password, name)

        if (hasError) {
            setShowError(true)
            setTimeout(() => setShowError(false), 3000)
            setErrorMessage(message!)
            return
        }

        await signIn('credentials', { email, password})
        //router.replace(destination)
    }

    return (
        <AuthLayout title={'Ingresar'}>
            <form onSubmit={handleSubmit(onRegisterForm)}> {/* Llama onSubmit si pasan las validaciones */}
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component="h1">Crear cuenta</Typography>
                            <Chip
                                label={errorMessage}
                                color='error'
                                icon={<ErrorOutline />}
                                className='fadeIn'
                                sx={{ display: showError ? 'flex' : 'none', mt: 2 }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField 
                                label="Nombre completo" 
                                variant="filled" 
                                fullWidth 

                                /* Validacion del campo */
                                {
                                    ...register('name', {
                                        required: 'Este campo es requerido',
                                        minLength: { value: 3, message: 'El nombre debe tener al menos 6 caracteres' }
                                    })}
                                    error={!!errors.name} /* chequeo si el objeto errors tiene un error */
                                    helperText={errors.name?.message}
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
                                fullWidth
                            >
                                Crear Cuenta
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <NextLink href={`/auth/login?p=${destination}`} passHref legacyBehavior>
                                <Link underline='always'>
                                    ¿Ya tienes cuenta?
                                </Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {

    const session = await getSession({ req })
    const { p = '/'} = query

    if (session) {
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}

export default RegisterPage