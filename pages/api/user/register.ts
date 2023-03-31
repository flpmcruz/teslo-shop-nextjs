import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from 'bcryptjs';
import { db } from "@/database";
import { User } from "@/models";
import { jwt, validations } from '@/utils';

type Data = 
    | { message: string }
    | { 
        token: string, 
        user: { 
            name: string, 
            email: string, 
            role: string 
        } 
    }

export default async function handler( req: NextApiRequest, res: NextApiResponse<Data> ) {

    switch (req.method) {
        case 'POST':
            return registerUser(req, res)

        default:
            return res.status(400).json({
                message: 'BadRequest'
            })
    }
}

const registerUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { email = '' , password = '', name = '' } = req.body as { email: string, password: string, name: string }

    if (password.length < 6) {
        await db.disconnect()
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' })
    }
    
    if (name.length < 3) {
        await db.disconnect()
        return res.status(400).json({ message: 'El nombre debe tener al menos 3 caracteres' })
    }
    
    if (!validations.isValidEmail(email)) {
        await db.disconnect()
        return res.status(400).json({ message: 'El email no es válido' })
    }

    await db.connect()
    const user = await User.findOne({email})
    
    if( user ) {
        await db.disconnect()
        return res.status(400).json({ message: 'Correo ya registrado' })
    }   

    const newUser = new User({
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password, 10),
        role: 'client',
        name
    })

    try {
        await newUser.save({ validateBeforeSave: true })
        await db.disconnect()
    } catch (error) {
        console.log(error)
        await db.disconnect()
        return res.status(500).json({ message: 'Error al registrar usuario' })
    }

    const { _id, role } = newUser
    const token = jwt.signToken(_id, email)

    return res.status(201).json({
        token,
        user: {
            email,
            name,
            role,
        }
    })
}

