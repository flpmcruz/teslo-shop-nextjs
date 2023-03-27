import { FC, useState } from "react"
import { Box, IconButton, Typography } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";

export const ItemCounter: FC = () => {

    const [counter, setCounter] = useState(0)

    return (
        <Box display='flex' alignItems='center'>
            <IconButton
                onClick={() => setCounter(counter - 1)}
            >
                <RemoveCircleOutline />
            </IconButton>
            <Typography sx={{ width: 40, textAlign: 'center' }}>{counter}</Typography>
            <IconButton
                onClick={() => setCounter(counter + 1)}
            >
                <AddCircleOutline />
            </IconButton>
        </Box>
    )
}
