// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = 
    | { message: string }

export default async function handler( req: NextApiRequest, res: NextApiResponse<Data> ) {

    switch (req.method) {
        case 'GET':
            return res.status(400).json({
                message: 'Debe especificar el query de la busqueda'
            })
    }
}
