import { FC, ReactNode, useEffect, useReducer } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import axios from 'axios'

import { AuthContext, authReducer } from './'
import { IUser } from '@/interfaces'
import { tesloApi } from '@/api'

export interface AuthState {
     isLoggedIn: boolean
     user?: IUser
}

const AUTH_INITIAL_STATE: AuthState = {
     isLoggedIn: false,
     user: undefined
}

interface Props {
     children: ReactNode
}

export const AuthProvider: FC<Props> = ({ children }) => {

     const router = useRouter()
     const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)

     useEffect(() => {
          checkToken()
     }, [])

     const checkToken = async() => {

          if( !Cookies.get('token') ) return
          
          try {
               const { data } = await tesloApi.get('/user/validate-token')
               const { token, user } = data
               Cookies.set('token', token, { expires: 7 })
               dispatch({ type: '[Auth] - Login', payload: user })
          } catch (error) {
               console.log(error)
               Cookies.remove('token')
          }
     }

     const loginUser = async(email: string, password: string): Promise<boolean> => {
          
          try {
               const { data } = await tesloApi.post('/user/login', { email, password })
               const { token, user } = data

               Cookies.set('token', token, { expires: 7 })
               dispatch({ type: '[Auth] - Login', payload: user })
               return true

          } catch (error) {
               console.log(error)
               return false
          }
     }

     const registerUser = async(email: string, password: string, name: string): Promise<{hasError: boolean; message?: string}> => {
          
          try {
               const { data } = await tesloApi.post('/user/register', { email, password, name })
               const { token, user } = data

               Cookies.set('token', token, { expires: 7 })
               dispatch({ type: '[Auth] - Login', payload: user })
               return {
                    hasError: false,
                    message: ''
               }

          } catch (error) {
               if ( axios.isAxiosError(error) ) {
                    return {
                         hasError: true,
                         message: error.response?.data.message
                    }
               }
               return {
                    hasError: true,
                    message: 'Ocurrio un error inesperado, intente de nuevo'
               }
          }
     }

     const logoutUser = () => {
          Cookies.remove('token')
          Cookies.remove('cart')

          //hace un refresh a la pagina
          router.reload()
     }

     return (
          <AuthContext.Provider value={{
               ...state,

               // Actions
               loginUser,
               registerUser,
               logoutUser,
          }}>

               {children}
          </AuthContext.Provider>
     )
}