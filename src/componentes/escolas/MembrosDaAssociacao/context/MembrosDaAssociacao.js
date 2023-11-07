import React, {createContext, useCallback, useMemo, useState} from 'react';
export const MembrosDaAssociacaoContext = createContext({
    composicaoUuid: '',
    setComposicaoUuid: () => {},
    currentPage: 1,
    setCurrentPage: () => {},
    firstPage: 0,
    setFirstPage: () => {},
    mandatoUuid: '',
    setMandatoUuid: () => {},
    reiniciaEstadosControleComposicoes: () => {},
})

export const MembrosDaAssociacaoProvider = ({children}) => {

    const [composicaoUuid, setComposicaoUuid] = useState('');
    const [firstPage, setFirstPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [mandatoUuid, setMandatoUuid] = useState('');
    
    const reiniciaEstadosControleComposicoes = useCallback(() => {
        setComposicaoUuid('')
        setCurrentPage(1)
        setFirstPage(0)
    }, [])

    const contextValue = useMemo(() => {
        return{
            composicaoUuid,
            setComposicaoUuid,
            firstPage,
            setFirstPage,
            currentPage,
            setCurrentPage,
            mandatoUuid,
            setMandatoUuid,
            reiniciaEstadosControleComposicoes,
        }
    }, [composicaoUuid, firstPage, currentPage, mandatoUuid, reiniciaEstadosControleComposicoes])

    return (
        <MembrosDaAssociacaoContext.Provider value={contextValue}>
            {children}
        </MembrosDaAssociacaoContext.Provider>
    )
}