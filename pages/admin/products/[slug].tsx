import { ChangeEvent, FC, useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { InsertDriveFileRounded, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material';

import { AdminLayout } from '@/components/layouts'
import { dbProducts } from '@/database';
import { IProduct } from '@/interfaces';
import { tesloApi } from '@/api';
import { Product } from '@/models';

const validTypes  = ['shirts','pants','hoodies','hats']
const validGender = ['men','women','kid','unisex']
const validSizes = ['XS','S','M','L','XL','XXL','XXXL']

interface Props {
    product: IProduct;
}

interface FormData {
    _id?        : string;
    description : string;
    images      : string[];
    inStock     : number;
    price       : number;
    sizes       : string[];
    slug        : string;
    tags        : string[];
    title       : string;
    type        : string;
    gender      : string
}   

const ProductAdminPage:FC<Props> = ({ product }) => {

    const router = useRouter()
    const [newTagValue, setNewTagValue] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    const { register, handleSubmit, formState: {errors}, getValues, setValue, watch } = useForm<FormData>({
        defaultValues: product
    })

    useEffect(() => {
        // Si cambia el título, cambiamos el slug
        const subscription = watch( (value, { name, type }) => {
            if( name === 'title') {
                // Removemos los espacios, los acentos y los ponemos en minúsculas
                const newSlug = value.title?.trim()
                                            .replaceAll(' ', '_')
                                            .replaceAll("'", '')
                                            .toLowerCase() || ''
                // Actualizamos el slug
                setValue('slug', newSlug, { shouldValidate: true })
            }
        })

        // Limpiamos el observable
        return () => subscription.unsubscribe()
    }, [])

    const onFilesSelected = async({ target }: ChangeEvent<HTMLInputElement> ) => {
        if( !target.files || target.files.length === 0 ) return

        try {
            for (const file of target.files) {
                const formData = new FormData()
                formData.append('file', file)
                const {data} = await tesloApi.post<{message: string}>('/admin/upload', formData)
                setValue('images', [...getValues('images'), data.message], { shouldValidate: true })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onDeleteImage = ( image: string ) => {
        const currentImages = getValues('images').filter( i => i !== image )
        setValue('images', currentImages, { shouldValidate: true })
    }

    const onDeleteTag = ( tag: string ) => {
        const currentTags = getValues('tags').filter( t => t !== tag )
        setValue('tags', currentTags, { shouldValidate: true })
    }

    const onNewTag = () => {
        const newTag = newTagValue.trim().toLocaleLowerCase()
        setNewTagValue('')

        const currentTags = getValues('tags')
        if( currentTags.includes(newTag) ) return // Si ya existe, no hacemos nada

        currentTags.push(newTag) // Agregamos el nuevo tag y reenderizamos el componente
    }

    const onChangeSize = ( size: string ) => {
        const currentSizes = getValues('sizes')

        // Si ya existe la talla, la removemos //shouldValidate: true para que se vuelva a validar y redibuje el componente
        if( currentSizes.includes(size) ) 
            return setValue('sizes', currentSizes.filter( s => s !== size ), { shouldValidate: true })

        // Si no existe, la agregamos
        setValue('sizes', [...currentSizes, size], { shouldValidate: true })
    }

    const onSubmit = async( form: FormData ) => {

        if(form.images.length < 2) return alert('Debe agregar al menos 3 imágenes')
        setIsSaving(true)

        // Actualizamos el producto
        try {
            const {data} = await tesloApi({
                url: `/admin/products/`,
                method: form._id ? 'PUT' : 'POST',
                data: form
            })

            if(!form._id){
                // Si no existe el id, es porque es un nuevo producto. Recargar el navegador
                router.replace(`/admin/products/${data.slug}`)
            } else {
                // Si existe el id, es porque estamos editando un producto
                setIsSaving(false) 
            }
        } catch (error) {
            setIsSaving(false)
        }
    }

    return (
        <AdminLayout 
            title={'Producto'}
            subtitle={`Editando: ${ product.title }`} 
            icon={ <InsertDriveFileRounded /> }
        >
            <form onSubmit={handleSubmit(onSubmit)} >
                <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
                    <Button 
                        color="secondary"
                        startIcon={ <SaveOutlined /> }
                        sx={{ width: '150px' }}
                        type="submit"
                        disabled={ isSaving }
                    >
                        Guardar
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={ 6 }>

                        <TextField
                            label="Título"
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            { ...register('title', {
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                            })}
                            error={ !!errors.title }
                            helperText={ errors.title?.message }
                        />

                        <TextField
                            label="Descripción"
                            variant="filled"
                            fullWidth 
                            multiline
                            sx={{ mb: 1 }}
                            { ...register('description', {
                                required: 'Este campo es requerido',
                            })}
                            error={ !!errors.description }
                            helperText={ errors.description?.message }
                        />

                        {/* Inventario y Precio */}
                        <Box display={'flex'} gap={2}>
                            <TextField
                                label="Inventario"
                                type='number'
                                variant="filled"
                                fullWidth 
                                sx={{ mb: 1 }}
                                { ...register('inStock', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 0, message: 'Mínimo valor cero' }
                                })}
                                error={ !!errors.inStock }
                                helperText={ errors.inStock?.message }
                            />
                            
                            <TextField
                                label="Precio"
                                type='number'
                                variant="filled"
                                fullWidth 
                                sx={{ mb: 1 }}
                                { ...register('price', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 0, message: 'Mínimo valor cero' }
                                })}
                                error={ !!errors.price }
                                helperText={ errors.price?.message }
                            />
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        {/* Tipo */}
                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Tipo</FormLabel>
                            <RadioGroup
                                row
                                value={getValues('type')}
                                onChange={ (event) => setValue('type', event.target.value, { shouldValidate: true}) }
                            >
                                {
                                    validTypes.map( option => (
                                        <FormControlLabel 
                                            key={ option }
                                            value={ option }
                                            control={ <Radio color='secondary' /> }
                                            label={ capitalize(option) }
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        {/* Gender */}
                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Género</FormLabel>
                            <RadioGroup
                                row
                                value={getValues('gender')}
                                onChange={ (event) => setValue('gender', event.target.value, { shouldValidate: true}) }
                            >
                                {
                                    validGender.map( option => (
                                        <FormControlLabel 
                                            key={ option }
                                            value={ option }
                                            control={ <Radio color='secondary' /> }
                                            label={ capitalize(option) }
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        {/* Tallas */}
                        <FormGroup>
                            <FormLabel>Tallas</FormLabel>
                            <Box display={'flex'}>
                                {
                                    validSizes.map(size => (
                                        <FormControlLabel 
                                            key={size} 
                                            label={ size } 
                                            control={<Checkbox checked={ getValues('sizes').includes(size)}/>} 
                                            onChange={ () => onChangeSize(size)}
                                        />
                                    ))
                                }
                            </Box>
                        </FormGroup>

                    </Grid>

                    {/* Tags e imagenes */}
                    <Grid item xs={12} sm={ 6 }>
                        
                        {/* Slug */}
                        <TextField
                            label="Slug - URL"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            { ...register('slug', {
                                required: 'Este campo es requerido',
                                validate: (value) => value.trim().includes(' ') ? 'No puede contener espacios en blanco ' : undefined
                            })}
                            error={ !!errors.slug }
                            helperText={ errors.slug?.message }
                        />

                        {/* Tags */}
                        <TextField
                            label="Etiquetas"
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            helperText="Presiona [spacebar] para agregar"
                            value={newTagValue}
                            onChange={ (event) => setNewTagValue(event.target.value)}
                            onKeyUp={ ({code}) => code === 'Space' ? onNewTag() : undefined }
                        />
                        <Box 
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                listStyle: 'none',
                                p: 0,
                                m: 0,
                            }}
                            component="ul">
                                {
                                    getValues('tags').map((tag) => {
                                        return (
                                            <Chip
                                                key={tag}
                                                label={tag}
                                                onDelete={ () => onDeleteTag(tag)}
                                                color="primary"
                                                size='small'
                                                sx={{ ml: 1, mt: 1}}
                                            />
                                        );
                                    })
                                }
                        </Box>
                        {/* Fin Tags */}

                        <Divider sx={{ my: 2  }}/>
                        
                        <Box display='flex' flexDirection="column">
                            
                            {/* Imagenes */}
                            <FormLabel sx={{ mb:1 }}>Imágenes</FormLabel>
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                startIcon={ <UploadOutlined /> }
                                sx={{ mb: 3 }}
                                component="label"
                            >
                                Cargar imagen
                                <input 
                                    hidden 
                                    type='file' 
                                    multiple 
                                    accept="image/png, image/gif, image/jpeg"
                                    onChange={ (event) => onFilesSelected(event) }
                                />
                            </Button>

                            <Chip 
                                label="Es necesario al 2 imagenes"
                                color='error'
                                variant='outlined'
                                sx={{ display: getValues('images').length < 2 ? 'block' : 'none' }}
                            />

                            <Grid container spacing={2}>
                                {
                                    getValues('images').map( img => (
                                        <Grid item xs={4} sm={3} key={img}>
                                            <Card>
                                                <CardMedia 
                                                    component='img'
                                                    className='fadeIn'
                                                    image={ `${ img }` }
                                                    alt={ img }
                                                />
                                                <CardActions>
                                                    <Button 
                                                        fullWidth 
                                                        color="error"
                                                        onClick={ () => onDeleteImage(img) }
                                                    >
                                                        Borrar
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))
                                }
                            </Grid>

                        </Box>

                    </Grid>

                </Grid>
            </form>
        </AdminLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    
    const { slug = ''} = query;

    let product: IProduct | null

    if( slug === 'new' ) {
        //crear producto
        const tempProduct = JSON.parse(JSON.stringify( new Product()));
        delete tempProduct._id;
        tempProduct.images = ['img1.jpg', 'img2.jpg']
        product = tempProduct;
    } else {
        product = await dbProducts.getProductBySlug(slug.toString());
    }

    if ( !product ) {
        return {
            redirect: {
                destination: '/admin/products',
                permanent: false,
            }
        }
    }
    
    return {
        props: {
            product
        }
    }
}

export default ProductAdminPage