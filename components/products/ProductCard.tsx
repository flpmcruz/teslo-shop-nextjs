import { FC, useMemo, useState } from "react"
import { Grid, Card, CardActionArea, CardMedia, Typography } from "@mui/material"
import { IProducts } from "@/interfaces"
import { Box } from "@mui/system"
import Link from "next/link"

interface Props {
    product: IProducts
}

export const ProductCard: FC<Props> = ({product}) => {

  const [isHovered, setIsHovered] = useState(false)

  const productImage = useMemo(() => {
    return isHovered 
              ? `products/${product.images[1]}` 
              : `products/${product.images[0]}`
  }, [isHovered])

  return (
      <Grid 
        item xs={6} 
        sm={4}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >

        <Card>
          <Link href='/product/slug' passHref prefetch={false}>
            <CardActionArea>
              <CardMedia
                className="fadeIn"
                component="img"
                image={productImage}
                alt={product.title}
              />
            </CardActionArea>
          </Link>
        </Card>

        <Box sx={{ mt: 1}} className='fadeIn'>
          <Typography fontWeight={700}>{product.title}</Typography>
          <Typography fontWeight={500}>${product.price}</Typography>
        </Box>

      </Grid>
  )
}
