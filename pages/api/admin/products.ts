import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/database";
import { IProduct } from "@/interfaces";
import { Product } from "@/models";
import { isValidObjectId } from "mongoose";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config( process.env.CLOUDINARY_URL || '' );

type Data = 
    | { message: string } 
    | IProduct[]
    | IProduct

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProducts(req, res);

    case "PUT":
      return updateProduct(req, res);

    case "POST":
      return createProduct(req, res);

    default:
      return res.status(400).json({ message: "Bad Request" });
  }
}

const getProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    await db.connect()
    const products = await Product.find()
                            .sort({ createdAt: 'asc' })
                            .lean()
    await db.disconnect()

    const updatedProducts = products.map( product => {
      product.images = product.images.map( image => image.includes("http") ? image : `${process.env.HOST_NAME}products/${image}`)
      return product
    })

    return res.status(200).json(updatedProducts);
}

const updateProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { _id = '', images = [] } = req.body as IProduct

    if(!isValidObjectId(_id)) return res.status(400).json({ message: 'Invalid ID' })

    if(images.length < 2) return res.status(400).json({ message: 'You must upload at least 2 images' })

    try {
      await db.connect()
      const product = await Product.findById(_id)
      
      if(!product) {
        await db.disconnect()
        return res.status(400).json({ message: 'Product not found' })
      }

      // Delete images that are not in the new array from cloudinary
      product.images.forEach(async (image: string) => {
        if(!images.includes(image)) {
          const [ fileId, extension ] = image.substring(image.lastIndexOf('/') + 1).split('.')
          await cloudinary.uploader.destroy(fileId)
        }
      })

      await product.updateOne( req.body )
      await db.disconnect()

      return res.status(200).json(product);
    } catch (error) {
      console.log(error)
      await db.disconnect()
      return res.status(500).json({ message: 'Internal Server Error' })
    }

}

const createProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { images = [] } = req.body as IProduct

    if(images.length < 2) return res.status(400).json({ message: 'You must upload at least 2 images' })

    try {
      await db.connect()
      const productInDb = await Product.findOne({ slug: req.body.slug }).lean()
      if(productInDb) {
        await db.disconnect()
        return res.status(400).json({ message: 'Product already exists' })
      }

      const product = new Product(req.body)
      await product.save()
      await db.disconnect()

      return res.status(201).json(product);
    } catch (error) {
      console.log(error)
      await db.disconnect()
      return res.status(500).json({ message: 'Internal Server Error' })
    } 
}
