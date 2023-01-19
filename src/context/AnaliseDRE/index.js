import React, {useState, createContext} from "react";


export const AnaliseDREContext = createContext(null)

export const AnaliseDREProvider = ({children}) => {
    const [lancamentosAjustes, setLancamentosAjustes] = useState([])
    const [podeConcluir, setPodeConcluir] = useState(false)

    return <AnaliseDREContext.Provider value={{lancamentosAjustes, setLancamentosAjustes, podeConcluir, setPodeConcluir}}>
        {children}
    </AnaliseDREContext.Provider>
}