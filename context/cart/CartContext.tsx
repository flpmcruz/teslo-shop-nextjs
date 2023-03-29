import { createContext } from 'react'
import { ICartProduct } from '@/interfaces'

export interface ContextProps {
    cart: ICartProduct[]
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;

    // Actions
    addProductToCart: (product: ICartProduct) => void
    updateCartQuantity: (product: ICartProduct) => void
    removeCartQuantity: (product: ICartProduct) => void
}

export const CartContext = createContext({} as ContextProps)