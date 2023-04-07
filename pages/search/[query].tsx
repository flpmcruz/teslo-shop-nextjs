import { GetServerSideProps, NextPage } from "next";
import { Box, Typography } from "@mui/material";

import { ProductList } from "@/components/products";
import { ShopLayout } from '@/components/layouts/ShopLayout';
import { getProductByTerm } from "@/database/dbProducts";
import { IProduct } from "@/interfaces";

interface Props {
    products: IProduct[]
    foundProducts: boolean
    query: string
}

const SearchPage: NextPage<Props> = ({products, foundProducts, query}) => {

    return (
        <ShopLayout title="Tesla-Shop - Search" pageDescription="Encuentra los mejores productos de Teslo aqui">
            <Typography variant="h1" component='h1'>Buscar</Typography>

            {
                foundProducts 
                    ? <Typography variant="h2" sx={{ mb: 3 }} textTransform='capitalize'>{query}, {products.length} Productos</Typography>
                    : (
                        <Box display='flex'>
                            <Typography variant="h2" sx={{ mb: 3 }}>No se encontraron productos</Typography>
                            <Typography variant="h2" sx={{ ml: 1 }} color='secondary' textTransform='capitalize'>"{query}"</Typography>
                        </Box>
                    )
            }

            <ProductList products={products} />

        </ShopLayout>
    )
}

//getserversideprops
export const getServerSideProps: GetServerSideProps = async ({ params }: any) => {

    const { query = '' } = params as { query: string }

    if ( query.trim().length === 0 ) {
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }

    let products = await getProductByTerm(query)
    const foundProducts = products.length > 0

    //TODO: Si no hay productos retornar otros productos
    if (!foundProducts) {
        //Return random products o algo asi
        products = await getProductByTerm('kid')
    }

    return {
        props: {
            products,
            foundProducts,
            query
        }
    }
}

export default SearchPage;