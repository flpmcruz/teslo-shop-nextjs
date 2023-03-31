import { IUser } from '@/interfaces'
import { createContext } from 'react'

export interface AuthContextProps {
     isLoggedIn: boolean
     user?: IUser

     // Actions
     loginUser: (email: string, password: string) => Promise<boolean>
     registerUser: (email: string, password: string, name: string) => Promise<{ hasError: boolean; message?: string }>
}

export const AuthContext = createContext({

} as AuthContextProps)