import { Button, Chip, Grid, Typography, Box } from '@mui/material';
import { ShopLayout } from '@/components/layouts';
import { initialData } from '@/database/products';
import { ProductSlideshow, SizeSelector } from '@/components/products';
import { ItemCounter } from '@/components/ui';

const product = initialData.products[0]

function ProductPage() {
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

export default ProductPage