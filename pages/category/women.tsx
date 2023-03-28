import { NextPage } from "next";
import { Typography } from "@mui/material";
import { ShopLayout } from '@/components/layouts/ShopLayout';
import { useProducts } from '@/hooks/useProducts';
import { ProductList } from "@/components/products";
import { FullScreenLoading } from "@/components/ui";

const WomenPage: NextPage = () => {

  const { products, isLoading } = useProducts('/products?gender=women')

  return (
    <ShopLayout title="Tesla-Shop - Home" pageDescription="Encuentra los mejores productos de Teslo aqui">
      <Typography variant="h1" component='h1'>Tienda</Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>Productos de Mujeres</Typography>

      {
        isLoading
          ? <FullScreenLoading/>
          : <ProductList products={products} /> 
      }

    </ShopLayout>
  )
}

export default WomenPage;