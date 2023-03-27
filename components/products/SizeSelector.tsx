import { FC } from "react"
import { Button, Box } from '@mui/material';
import { ISize } from "@/interfaces"

interface Props {
    selectedSize?: ISize
    sizes: ISize[]
}

export const SizeSelector: FC<Props> = ({ selectedSize, sizes }) => {
    return (
        <Box sx={{mb:2}}>
            {
                sizes.map((size) => (
                    <Button
                        key={size}
                        size='small'
                        color={selectedSize === size ? 'primary' : 'info'}
                    >
                        {size}
                    </Button>
                ))
            }
        </Box>
    )
}
