import React, {createContext, useMemo, useState} from 'react';

export const UnidadesUsuarioContext = createContext({
    currentPage: 1,
    setCurrentPage: () => {},
    firstPage: 0,
    setFirstPage: () => {},
    showFaixaIndicativa: false,
    setShowFaixaIndicativa: () => {}
});

export const UnidadesUsuarioProvider = ({children}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [firstPage, setFirstPage] = useState(1);
    const [showFaixaIndicativa, setShowFaixaIndicativa] = useState(false);

    const contextValue = useMemo(() => {
        return {
            currentPage,
            setCurrentPage,
            firstPage,
            setFirstPage,
            showFaixaIndicativa,
            setShowFaixaIndicativa
        };
    }, [currentPage, firstPage, showFaixaIndicativa]);

    return (
        <UnidadesUsuarioContext.Provider value={contextValue}>
            {children}
        </UnidadesUsuarioContext.Provider>
    )
}