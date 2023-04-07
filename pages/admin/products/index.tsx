import NextLink from 'next/link';
import useSWR from 'swr';
import { Box, Button, CardMedia, Grid, Link } from "@mui/material";
import { AddOutlined, CategoryOutlined } from "@mui/icons-material"
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { AdminLayout } from "@/components/layouts"
import { IProduct } from "@/interfaces";

const columns: GridColDef[] = [
    { 
        field: 'img', 
        headerName: 'Foto',
        renderCell: ({row}: GridRenderCellParams) => {
            return (
                <a href={`/product/${row.slug}`} target='_blank'>
                    <CardMedia
                        component="img"
                        image={`${row.img}`}
                        alt={row.title}
                        className='fadeIn'
                    />
                </a>
            )
        } 
    },
    { 
        field: 'title', 
        headerName: 'Title',
        width: 200,
        renderCell: ({row}: GridRenderCellParams) => {
            return (
                <NextLink href={`/admin/products/${row.slug}`} target='_blank' passHref legacyBehavior>
                    <Link underline='always'>
                        {row.title}
                    </Link>
                </NextLink>
            )
        } 
    },
    { field: 'gender', headerName: 'Genero'},
    { field: 'type', headerName: 'Tipo'},
    { field: 'inStock', headerName: 'Inventario'},
    { field: 'price', headerName: 'Precio'},
    { field: 'sizes', headerName: 'Tallas'},
];

const ProductsPage = () => {

    const { data, error } = useSWR<IProduct[]>('/api/admin/products')

    if (!data && !error) return <div>Loading...</div>

    const rows = data!.map((product) => ({
        id: product._id,
        img: product.images[0],
        title: product.title,
        gender: product.gender,
        type: product.type,
        inStock: product.inStock,
        price: product.price,
        sizes: product.sizes.join(', '), // ['S', 'M', 'L'] => 'S, M, L'
        slug: product.slug
    }))

    return (
        <AdminLayout title={`Productos (${data?.length})`} subtitle={"Mantenimiento de Productos"} icon={<CategoryOutlined />}>

            <Box display={'flex'} justifyContent={'end'} sx={{ mb:2}}>
                <Button 
                    startIcon={<AddOutlined/>}
                    color='secondary'
                    href='/admin/products/new'    
                >
                    Nuevo Producto
                </Button>
            </Box>
            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                    />
                </Grid>
            </Grid>

        </AdminLayout>
    )
}

export default ProductsPage