// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/database";
import Product from "@/models/Product";
import { IProduct } from "@/interfaces";

type Data = { message: string } | IProduct;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProduct(req, res);

    default:
      return res.status(400).json({
        message: "Bad Request",
      });
  }
}

async function getProduct(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { slug } = req.query;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  if(!product) return res.status(404).json({ message: "Product not found" })

  product.images.map( image => image.includes("http") ? image : `${process.env.HOST_NAME}products/${image}`)

  return res.status(200).json(product);
}
