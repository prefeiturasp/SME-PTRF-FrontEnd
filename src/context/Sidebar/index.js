import React, {useState, createContext} from "react";

export const SidebarContext = createContext( {
    sideBarStatus: '',
    setSideBarStatus(){},

    // Esse estado é usado para definir quando o click no item do menu deve ir diretamento para url
    irParaUrl: '',
    setIrParaUrl(){},
});

export const SidebarContextProvider = ({children}) => {
    const [sideBarStatus, setSideBarStatus] = useState(true)

    // Como padrão, o click no item do menu deve sempre ir diretamente para url, ao menos que esse estado
    // seja mudado para false
    
    const [irParaUrl, setIrParaUrl] = useState(true)
    return (
        <SidebarContext.Provider value={ { sideBarStatus, setSideBarStatus, irParaUrl, setIrParaUrl } }>
            {children}
        </SidebarContext.Provider>
    )
}