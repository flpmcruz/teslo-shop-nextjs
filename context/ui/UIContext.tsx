import { createContext } from 'react'

export interface UIContextProps {
     isMenuOpen: boolean

     // Actions
     toogleSlideMenu: () => void
}

export const UIContext = createContext({

} as UIContextProps)