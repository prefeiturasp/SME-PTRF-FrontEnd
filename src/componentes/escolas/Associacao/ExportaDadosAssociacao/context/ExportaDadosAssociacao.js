import React, {createContext, useMemo, useState} from 'react';

export const ExportaDadosAssociacaoContext = createContext({
    exibeComponent: false,
    setExibeComponent: () => {}
})

export const ExportaDadosAssociacaoProvider = ({children}) => {

    const [exibeComponent, setExibeComponent] = useState(false);
    
    const contextValue = useMemo(() => {
        return{
            exibeComponent,
            setExibeComponent,
        }
    }, [exibeComponent])

    return (
        <ExportaDadosAssociacaoContext.Provider value={contextValue}>
            {children}
        </ExportaDadosAssociacaoContext.Provider>
    )
}