import { NextPage } from 'next';
import { Button, Chip, Grid, Typography, Box } from '@mui/material';
import { getAllProductsSlugs, getProductBySlug } from '@/database/dbProducts';
import { ShopLayout } from '@/components/layouts';
import { ProductSlideshow, SizeSelector } from '@/components/products';
import { ItemCounter } from '@/components/ui';
import { IProduct } from '@/interfaces';

interface Props {
  product: IProduct
}

const ProductPage: NextPage<Props> = ({product}) => {

  // Una forma de hacerlo es con el hook useProducts - Client Side Rendering
  // const router = useRouter()
  // const { products: product, isLoading } = useProducts(`/products/${router.query.slug}`)
  // isLoading && <h1>Cargando...</h1>
  // !product && <h1>No existe...</h1>

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideshow
            images={product.images}
          />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column'>

            {/* Titulos */}
            <Typography variant='h1' component='h1'>{product.title}</Typography>
            <Typography variant='subtitle1' component='h2'>${product.price}</Typography>

            {/* Cantidad */}
            <Box>
              <Typography variant='subtitle2'>Cantidad</Typography>
              <ItemCounter />
              <SizeSelector sizes={ product.sizes } />
            </Box>

            {/* Agregar al Carrito */}
            <Button color='secondary' className='circular-btn'>
              Agregar al Carrito
            </Button>

            {/* <Chip label="No hay disponibles" color='error' variant='outlined'/> */}

            {/* Descripcion */}
            <Box sx={{ mt: 3 }}>
              <Typography variant='subtitle2'>Descripcion</Typography>
              <Typography variant='body2'>{product.description}</Typography>
            </Box>

          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

// Este metodo se ejecuta en el servidor, No usar si no es necesario
// export async function getServerSideProps({ params }: any) {
//   const { slug = '' } = params as { slug: string }
//   const product =  await getProductBySlug(slug)

//   if(!product) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false
//       }
//     }
//   }
//   return {
//     props: {
//       product
//     }
//   }
// }

//gestStaticPaths - Genera las rutas de las paginas estaticas
export async function getStaticPaths() {

  const productSlugs = await getAllProductsSlugs()

  return {
    paths: productSlugs.map(({slug}) => ({
      params: { slug }
    })),
    fallback: 'blocking'
  }
}

//getStaticProps - Genera los datos de las paginas estaticas
export async function getStaticProps({ params }: any) {
  const { slug = '' } = params as { slug: string }
  const product =  await getProductBySlug(slug)

  if(!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24 // 24 horas
  }
}


export default ProductPage