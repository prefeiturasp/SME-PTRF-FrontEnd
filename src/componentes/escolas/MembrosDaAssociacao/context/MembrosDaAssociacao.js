import React, { createContext, useMemo, useState } from 'react';
export const MembrosDaAssociacaoContext = createContext({
    composicaoUuid: '',
    setComposicaoUuid: () => {},
    currentPage: 1,
    setCurrentPage: () => {},
    firstPage: 0,
    setFirstPage: () => {},
})

export const MembrosDaAssociacaoProvider = ({children}) => {

    const [composicaoUuid, setComposicaoUuid] = useState('');
    const [firstPage, setFirstPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const contextValue = useMemo(() => {
        return{
            composicaoUuid,
            setComposicaoUuid,
            firstPage,
            setFirstPage,
            currentPage,
            setCurrentPage,
        }
    }, [composicaoUuid, firstPage, currentPage])

    return (
        <MembrosDaAssociacaoContext.Provider value={contextValue}>
            {children}
        </MembrosDaAssociacaoContext.Provider>
    )

}