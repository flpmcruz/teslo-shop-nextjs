import { FC, useReducer, ReactNode, useEffect, useState } from 'react';
import Cookies from 'js-cookie'
import { ICartProduct } from '@/interfaces'
import { CartContext, cartReducer } from './'

export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[]
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
    shippingAddress?: ShippingAddress;
}

export interface ShippingAddress {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
}

const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined
}

interface Props {
    children: ReactNode
}

export const CartProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (!isMounted) {
            if( Cookies.get('firstName')){
                const shippingAddress = {
                  firstName: Cookies.get('firstName') || '',
                  lastName: Cookies.get('lastName') || '',
                  address: Cookies.get('address') || '',
                  address2: Cookies.get('address2') || '',
                  zip: Cookies.get('zip') || '',
                  city: Cookies.get('city') || '',
                  country: Cookies.get('country') || '',
                  phone: Cookies.get('phone') || '',
              }
                dispatch({ type: "[Cart] - Load address from cookies", payload: shippingAddress });
                setIsMounted(true);
            } 
        } 
    }, [])
    
    useEffect(() => {
        try {
            if (!isMounted) {
              const cart = JSON.parse(Cookies.get("cart") ?? "[]");
              dispatch({ type: "[Cart] - Load cart from cookies", payload: cart });
              setIsMounted(true);
            }
        } catch (error) {
            dispatch({ type: "[Cart] - Load cart from cookies", payload: [] });
        }
    }, [isMounted]);
   
    useEffect(() => {
      if (isMounted) Cookies.set("cart", JSON.stringify(state.cart));
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

    const updateShippingAddress = (shippingAddress: ShippingAddress) => {

        Cookies.set('firstName', shippingAddress.firstName)
        Cookies.set('lastName', shippingAddress.lastName)
        Cookies.set('address', shippingAddress.address)
        Cookies.set('address2', shippingAddress.address2 || '')
        Cookies.set('zip', shippingAddress.zip)
        Cookies.set('city', shippingAddress.city)
        Cookies.set('country', shippingAddress.country)
        Cookies.set('phone', shippingAddress.phone)

        dispatch({ type: '[Cart] - Update Address', payload: shippingAddress })
    }

    return (
        <CartContext.Provider value={{
            ...state,

            // Actions
            addProductToCart,
            updateCartQuantity,
            removeCartQuantity,
            updateShippingAddress
        }}>

            {children}
        </CartContext.Provider>
    )
}