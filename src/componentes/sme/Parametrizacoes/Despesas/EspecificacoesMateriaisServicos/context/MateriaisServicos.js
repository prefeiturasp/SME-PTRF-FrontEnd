import React, { createContext, useMemo } from 'react';

export const MateriaisServicosContext = createContext({
})

export const MateriaisServicosProvider = ({children}) => {

    const contextValue = useMemo(() => {
        return {
        };
    }, []);

    return (
        <MateriaisServicosContext.Provider value={contextValue}>
            {children}
        </MateriaisServicosContext.Provider>
    )
}