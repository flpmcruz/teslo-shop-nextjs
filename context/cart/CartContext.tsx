import { createContext } from 'react'
import { ICartProduct, ShippingAddress } from '@/interfaces'

export interface CartContextProps {
    isLoaded: boolean
    cart: ICartProduct[]
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;

    shippingAddress?: ShippingAddress

    // Actions
    addProductToCart: (product: ICartProduct) => void
    updateCartQuantity: (product: ICartProduct) => void
    removeCartQuantity: (product: ICartProduct) => void
    updateShippingAddress: (shippingAddress: ShippingAddress) => void
    createOrder: () => Promise<{hasError: boolean; message: string}>
}

export const CartContext = createContext({} as CartContextProps)