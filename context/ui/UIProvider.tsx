import { FC, ReactNode, useReducer } from 'react'
import { UIContext, uiReducer } from './'

export interface UIState {
     isMenuOpen: boolean
}

const UI_INITIAL_STATE: UIState = {
     isMenuOpen: false,
}

interface Props {
     children: ReactNode
}

export const UIProvider: FC<Props> = ({ children }) => {

     const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE)

     const toogleSlideMenu = () => {
          dispatch({ type: '[UI] - ToogleMenu' })
     }

     return (
          <UIContext.Provider value={{
               ...state,

               // Actions
               toogleSlideMenu
          }}>
               {children}
          </UIContext.Provider>
     )
}