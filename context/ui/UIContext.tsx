import { createContext } from 'react'

export interface ContextProps {
     isMenuOpen: boolean

     // Actions
     toogleSlideMenu: () => void
}

export const UIContext = createContext({

} as ContextProps)