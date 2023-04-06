import useSWR from 'swr';
import { ConfirmationNumberOutlined } from "@mui/icons-material"
import { Chip, Grid } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { AdminLayout } from "@/components/layouts"
import { IOrder, IUser } from "@/interfaces";

const columns: GridColDef[] = [
    { field: 'id', headerName: 'Order ID', width: 250 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'name', headerName: 'Nombre Completo', width: 200 },
    { field: 'total', headerName: 'Total', width: 100 },
    {
        field: 'isPaid',
        headerName: 'Pagado',
        renderCell: ({row}: GridRenderCellParams) => {
            return row.isPaid 
                ? (<Chip variant='outlined' label="Pagado" color="success" />)
                : (<Chip variant='outlined' label="No Pagado" color="error" />) 
        }
    },
    { field: 'noProducts', headerName: 'No.Productos', align: 'center', width: 100 },
    {
        field: 'check',
        headerName: 'Ver Orden',
        renderCell: ({row}: GridRenderCellParams) => {
            return (<a href={`/admin/orders/${row.id}`} target='_blank'>Ver orden</a>) 
        }
    },
    { field: 'createdAt', headerName: 'Creada en', width: 100 },
];

const OrdersPage = () => {

    const { data, error } = useSWR<IOrder[]>('/api/admin/orders')

    if (!data && !error) return <div>Loading...</div>

    const rows = data!.map((order) => ({
        id: order._id,
        email: (order.user as IUser).email,
        name: (order.user as IUser).name,
        total: order.total,
        isPaid: order.isPaid,
        noProducts: order.numberOfItems,
        createdAt: order.createdAt!.split('T')[0]
    }))

    return (
        <AdminLayout title={"Ordenes"} subtitle={"Mantenimiento de Ordenes"} icon={<ConfirmationNumberOutlined />}>

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

export default OrdersPage