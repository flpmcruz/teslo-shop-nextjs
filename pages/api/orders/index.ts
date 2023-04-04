import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { IOrder } from "@/interfaces";
import { db } from "@/database";
import { Order, Product } from "@/models";

type Data = 
    | { message: string }
    | IOrder

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return createOrder(req, res);

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function createOrder(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { orderItems, total } = req.body as IOrder;

  //verificar que tengamos un usuario logueado
  const session: any = await getSession({ req });
  if (!session) return res.status(401).json({ message: "Not authorized" });

  //Crear un arreglo con los productos que la persona quiere comprar
  const productsIds = orderItems.map((item) => item._id);

  await db.connect();
  const dbProducts = await Product.find({ _id: { $in: productsIds } });

  try {
    //Verificar que los productos que la persona quiere comprar tienen el mismo precio que en la base de datos
    const subTotal = orderItems.reduce((prev, current) => {
        const currentPrice = dbProducts.find((product) => product.id === current._id)?.price;
        if(!currentPrice) throw new Error('Product not found');

        return (currentPrice * current.quantity) + prev;
    }, 0);

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE) || 0;
    const backendTotal = subTotal * (1 + taxRate);
    if(backendTotal !== total) throw new Error('Invalid total !!! Usuario intentando hackear el sistema')

    //Guardar la orden en la base de datos - TODO OK
    console.log(req.body)
    const userId = session.user._id;
    const newOrder = new Order({ ...req.body, isPaid: false, user: userId  });
    newOrder.total = Math.round( newOrder.total * 100 ) / 100; // Redondear a 2 decimales

    await newOrder.save();
    await db.disconnect();
    
    return res.status(201).json( newOrder );

  } catch (error: any) { 
    await db.disconnect();
    console.log(error);
    return res.status(400).json({ message: error.message || 'Revise logs' });
  }
}
