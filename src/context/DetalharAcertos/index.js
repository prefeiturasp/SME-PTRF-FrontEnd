import React, {useState, createContext} from "react";


export const ValidarParcialTesouro = createContext(null)

export const ProviderValidaParcial = ({children}) => {

    const [isValorParcialValido, setIsValorParcialValido] = useState(false)
    return <ValidarParcialTesouro.Provider value={{isValorParcialValido, setIsValorParcialValido}}>
        {children}
    </ValidarParcialTesouro.Provider>
}