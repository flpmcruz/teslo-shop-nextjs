import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { IPaypal } from "@/interfaces";
import { db, dbOrders } from "@/database";
import { Order } from "@/models";

type Data = { message: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return payOrder(req, res);

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const getPaypalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT}:${PAYPAL_SECRET}`,
    "utf-8"
  ).toString("base64");
  const body = new URLSearchParams("grant_type=client_credentials");

  try {
    const { data } = await axios.post(
      process.env.PAYPAL_OAUTH_URL || "",
      body,
      {
        headers: {
          Authorization: `Basic ${base64Token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
    } else {
      console.log(error);
    }

    return null;
  }
};

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  //TODO validar sesion del usuario

  //Validar mongoID

  const paypalBearerToken = await getPaypalBearerToken();
  if (!paypalBearerToken)
    return res.status(500).json({ message: "Error getting paypal token" });

  const { transactionId = "", orderId = "" } = req.body;

  const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(
    `${process.env.PAYPAL_ORDER_URL}/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${paypalBearerToken}`,
      },
    }
  );

  if (data.status !== "COMPLETED") {
    return res.status(500).json({ message: "Order not completed" });
  }

  await db.connect();
  const dbOrders = await Order.findById(orderId);

  if (!dbOrders) {
    await db.disconnect();
    return res.status(500).json({ message: "Order not found" });
  }

  if (dbOrders.total !== Number(data.purchase_units[0].amount.value)) {
    await db.disconnect();
    return res
      .status(500)
      .json({ message: "Order total and order paypal paid not match" });
  }

  dbOrders.transactionId = transactionId;
  dbOrders.isPaid = true;
  await dbOrders.save();
  db.disconnect();

  return res.status(200).json({ message: "Orden Pagada" });
};
