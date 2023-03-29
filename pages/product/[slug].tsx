import { useState, useContext } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Button, Chip, Grid, Typography, Box } from '@mui/material';

import { getAllProductsSlugs, getProductBySlug } from '@/database/dbProducts';
import { ShopLayout } from '@/components/layouts';
import { CartContext } from '@/context';
import { ProductSlideshow, SizeSelector } from '@/components/products';
import { ItemCounter } from '@/components/ui';
import { ICartProduct, IProduct, ISize } from '@/interfaces';

interface Props {
  product: IProduct
}

const ProductPage: NextPage<Props> = ({ product }) => {

  // Una forma de hacerlo es con el hook useProducts - Client Side Rendering
  // const router = useRouter()
  // const { products: product, isLoading } = useProducts(`/products/${router.query.slug}`)
  // isLoading && <h1>Cargando...</h1>
  // !product && <h1>No existe...</h1>

  const router = useRouter()
  const { addProductToCart  } = useContext(CartContext)

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  })

  const addProduct = () => {
    if(!tempCartProduct.size) return

    //Dispatch action add to cart
    addProductToCart(tempCartProduct)
    router.push('/cart')
  }

  const onSelectSize = (size: ISize) => {
    setTempCartProduct({
      ...tempCartProduct,
      size
    })
  }

  const onUpdateQuantity = (quantity: number) => {
    setTempCartProduct({
      ...tempCartProduct,
      quantity
    })
  }

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
              <ItemCounter
                currentValue={tempCartProduct.quantity}
                updateQuantity={onUpdateQuantity}
                maxValue={product.inStock}
              />
              <SizeSelector sizes={product.sizes} selectedSize={tempCartProduct.size} onSelectSize={onSelectSize} />
            </Box>

            {
              (product.inStock > 0)
                ? (
                  <Button
                    color='secondary'
                    className='circular-btn'
                    onClick={addProduct}
                  >
                    {
                      tempCartProduct.size
                        ? 'Agregar al Carrito'
                        : 'Selecciona un tamaño'
                    }
                  </Button>
                )
                : <Chip label="No hay disponibles" color='error' variant='outlined' />
            }

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

export default ProductPage


//gestStaticPaths - Genera las rutas de las paginas estaticas
export async function getStaticPaths() {

  const productSlugs = await getAllProductsSlugs()

  return {
    paths: productSlugs.map(({ slug }) => ({
      params: { slug }
    })),
    fallback: 'blocking'
  }
}

//getStaticProps - Genera los datos de las paginas estaticas
export async function getStaticProps({ params }: any) {
  const { slug = '' } = params as { slug: string }
  const product = await getProductBySlug(slug)

  if (!product) {
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