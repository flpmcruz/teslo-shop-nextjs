import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/database";
import Product from "@/models/Product";
import { IProduct } from "@/interfaces";

type Data = { message: string } | IProduct[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return searchProducts(req, res);

    default:
      return res.status(400).json({
        message: "Bad Request",
      });
  }
}

async function searchProducts(req: NextApiRequest, res: NextApiResponse<Data>) {
  let { q = "" } = req.query;

  if (q.length === 0) {
    return res
      .status(400)
      .json({ message: "Debe especificar algo en el query de la busqueda" });
  }

  q = q.toString().toLowerCase();
  await db.connect();

  const products = await Product.find({
    $text: { $search: q },
  })
  .select("title images inStock slug -_id")
  .lean();

  const updatedProducts = products.map( product => {
    product.images = product.images.map( image => image.includes("http") ? image : `${process.env.HOST_NAME}products/${image}`)
    return product
  })

  await db.disconnect();
  return res.status(200).json(updatedProducts);
}
