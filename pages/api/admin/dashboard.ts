// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/database";
import { Order, Product, User } from "@/models";

type Data = {
  numberOfOrders: number;
  paidOrders: number; // isPaid: true
  notPaidOrders: number;
  numberOfClients: number; // role: client
  numberOfProducts: number;
  productsWithNoInventory: number; // 0
  lowInventory: number; // 10 or less
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await db.connect();

  const [orders, clients, products] = await Promise.all([
    Order.find({}).lean(),
    User.find({ role: "clients" }).count(),
    Product.find({}).lean(),
  ]);

  await db.disconnect();

  const response = {
    numberOfOrders: orders.length,
    paidOrders: orders.filter((order) => order.isPaid).length,
    notPaidOrders: orders.filter((order) => !order.isPaid).length,
    numberOfClients: clients,
    numberOfProducts: products.length,
    productsWithNoInventory: products.filter((product) => product.inStock === 0).length,
    lowInventory: products.filter((product) => product.inStock <= 10).length,
  };
  
  res.status(200).json(response);
}
