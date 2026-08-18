import React, { createContext, useMemo, useState } from 'react';
import { useGetAssociacaoListagem } from '../hooks/useGetAssociacaoListagem';
import { useGetTabelaAssociacaoListagem } from '../hooks/useGetTabelaAssociacaoListagem';

const initialFilter = {
    recurso_uuid: '',
    page: 1,
    associacao: "",
    dre: "",
    tipo_ue: "",
    informacao: []
};

export const AssociacaoListagemContext = createContext({
    initialFilter: initialFilter,
    filter: initialFilter,
    setFilter: () => {},
    handleApplyFilter: () => {},
    handleClearFilter: () => {},

    draftFilter: initialFilter,
    setDraftFilter: () => {},

    isLoadingAssociacaoListagem: false,
    dataAssociacaoListagem: {},
    countAssociacaoListagem: 0,

    isLoadingTabelaAssociacaoListagem: false,
    dataTabelaAssociacaoListagem: {},
})

export const AssociacaoListagemProvider = ({children}) => {
    const [draftFilter, setDraftFilter] = useState(initialFilter);
    const [filter, setFilter] = useState(initialFilter);

    const { isLoading: isLoadingTabelaAssociacaoListagem, data: dataTabelaAssociacaoListagem } = useGetTabelaAssociacaoListagem()
    const { isLoading: isLoadingAssociacaoListagem, data: dataAssociacaoListagem, count: countAssociacaoListagem } = useGetAssociacaoListagem({ filters: filter })

    const handleApplyFilter = () => {
        setFilter(draftFilter);
    }

    const handleClearFilter = () => {
        setDraftFilter(initialFilter);
        setFilter(initialFilter);
    }

    const contextValue = useMemo(() => {
        return {
            initialFilter,
            filter,
            setFilter,
            handleApplyFilter,
            handleClearFilter,

            draftFilter,
            setDraftFilter,

            isLoadingAssociacaoListagem,
            dataAssociacaoListagem,
            countAssociacaoListagem,

            isLoadingTabelaAssociacaoListagem,
            dataTabelaAssociacaoListagem,
        };
    }, [
        filter,
        draftFilter,
        isLoadingAssociacaoListagem,
        dataAssociacaoListagem,
        countAssociacaoListagem,
        isLoadingTabelaAssociacaoListagem,
        dataTabelaAssociacaoListagem
    ]);

    return (
        <AssociacaoListagemContext.Provider value={contextValue}>
            {children}
        </AssociacaoListagemContext.Provider>
    )

}
