import { FC, useReducer, ReactNode, useEffect, useState } from 'react';
import Cookie from 'js-cookie'
import { ICartProduct } from '@/interfaces'
import { CartContext, cartReducer } from './'

export interface CartState {
    cart: ICartProduct[]
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
}

const CART_INITIAL_STATE: CartState = {
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
}

interface Props {
    children: ReactNode
}

export const CartProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

    const [isMounted, setIsMounted] = useState(false);
 
    useEffect(() => {
        try {
            if (!isMounted) {
              const cart = JSON.parse(Cookie.get("cart") ?? "[]");
              dispatch({ type: "[Cart] - Load cart from cookies", payload: cart });
              setIsMounted(true);
            }
        } catch (error) {
            dispatch({ type: "[Cart] - Load cart from cookies", payload: [] });
        }
    }, [isMounted]);
   
    useEffect(() => {
      if (isMounted) Cookie.set("cart", JSON.stringify(state.cart));
    }, [state.cart, isMounted]);

    useEffect(() => {
        const numberOfItems = state.cart.reduce((acc, product) => acc + product.quantity, 0)
        const subTotal = state.cart.reduce((acc, product) => acc + product.price * product.quantity, 0)
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)

        const OrderSummary = {
            numberOfItems,
            subTotal,
            tax: subTotal * taxRate,
            total: subTotal + subTotal * taxRate
        }

        dispatch({ type: '[Cart] - Update order summary', payload: OrderSummary })
        
    }, [state.cart])

    const addProductToCart = (product: ICartProduct) => {

        //Validar si el producto ya existe en el carrito y tiene diferente tamaño
        const productInCart = state.cart.some(p => p._id === product._id && p.size === product.size)
        if (!productInCart)
            return dispatch({ type: '[Cart] - Update products in cart', payload: [...state.cart, product] })

        //Validar si el producto ya existe en el carrito y tiene el mismo tamaño, acumular cantidad
        const updatedCart = state.cart.map(p => {
            if (p._id !== product._id) return p
            if (p.size !== product.size) return p

            p.quantity += product.quantity
            return p
        })
        
        dispatch({ type: '[Cart] - Update products in cart', payload: updatedCart })
    }

    const updateCartQuantity = (product: ICartProduct) => {
        dispatch({ type: '[Cart] - Change product quantity', payload: product })
    }

    const removeCartQuantity = (product: ICartProduct) => {
        dispatch({ type: '[Cart] - Remove product in cart', payload: product })
    }

    return (
        <CartContext.Provider value={{
            ...state,

            // Actions
            addProductToCart,
            updateCartQuantity,
            removeCartQuantity,
        }}>

            {children}
        </CartContext.Provider>
    )
}