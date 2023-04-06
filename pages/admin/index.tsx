import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from "@mui/icons-material"
import { Grid, Typography } from "@mui/material"

import { AdminLayout } from "@/components/layouts"
import { SummaryTile } from "@/components/admin/SummaryTile"
import { DashboardSummaryResponse } from '@/interfaces';

const DashboardPage = () => {

    const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
        refreshInterval: 30 * 1000, // 30 seconds
    })

    const [refresIn, setRefresIn] = useState(30)
    
    useEffect(() => {
        const interval = setInterval(() => { 
            setRefresIn( refresIn  => refresIn > 0 ? refresIn - 1 : 30 ) 
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    if (!error && !data) return <div>loading...</div>
    if (error) return <Typography>Error al cargar informacion</Typography>

    const { 
        numberOfOrders,
        paidOrders,
        notPaidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory, 
    } = data!

    return (
        <AdminLayout
            title="Dashboard"
            subtitle="Estadisticas Generales"
            icon={<DashboardOutlined />}
        >

            <Grid container spacing={2}>
                <SummaryTile
                    title={numberOfOrders}
                    subtitle={"Ordenes Totales"}
                    icon={<CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={paidOrders}
                    subtitle={"Ordenes Pagadas"}
                    icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={notPaidOrders}
                    subtitle={"Ordenes Pendientes"}
                    icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={numberOfClients}
                    subtitle={"Clientes"}
                    icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={numberOfProducts}
                    subtitle={"Productos"}
                    icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={productsWithNoInventory}
                    subtitle={"Sin Existencias"}
                    icon={<CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={lowInventory}
                    subtitle={"Bajo inventario"}
                    icon={<ProductionQuantityLimitsOutlined color="warning" sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={refresIn}
                    subtitle={"Actualizacion en:"}
                    icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
                />

            </Grid>
        </AdminLayout>
    )
}

export default DashboardPage