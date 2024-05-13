import React, { createContext, useMemo, useState } from 'react';

const initialFilter = {
    search: '',
    periodo: '',
    conta: '',
    acao: '',
    status: ''
};

const initialStateFormModal = {
    uuid: '',
    associacao: '',
    valor_capital: 0,
    valor_custeio: 0,
    valor_livre: 0,
    conta_associacao: '',
    acao_associacao: '',
    periodo: '',
    status: 'PENDENTE',
    realizado_capital: '',
    realizado_custeio: '',
    realizado_livre: '',
    nome_unidade: '',
    carga_origem: '',
    id_linha_carga: '',
    id: '',
    campos_editaveis: {
        campos_de_realizacao: false
    }
};

export const RepassesContext = createContext({
    initialFilter: initialFilter,
    filter: initialFilter,
    setFilter: () => {},

    currentPage: 1,
    setCurrentPage: () => {},
    firstPage: 0,
    setFirstPage: () => {},

    showModalForm: false,
    setShowModalForm: () => {},
    stateFormModal: initialStateFormModal,
    setStateFormModal: () => {},

    showModalConfirmacaoExclusao: false,
    setShowModalConfirmacaoExclusao: () => {},

    bloquearBtnSalvarForm: '',
    setBloquearBtnSalvarForm: () => {},
})

export const RepassesProvider = ({children}) => {

    const [filter, setFilter] = useState(initialFilter);

    const [currentPage, setCurrentPage] = useState(1);
    const [firstPage, setFirstPage] = useState(1);

    const [showModalForm, setShowModalForm] = useState(false);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);

    const [showModalConfirmacaoExclusao, setShowModalConfirmacaoExclusao] = useState(false);

    const [bloquearBtnSalvarForm, setBloquearBtnSalvarForm] = useState(false);

    const contextValue = useMemo(() => {
        return {
            initialFilter,
            filter,
            setFilter,
            currentPage,
            setCurrentPage,
            firstPage,
            setFirstPage,
            showModalForm,
            setShowModalForm,
            initialStateFormModal,
            stateFormModal,
            setStateFormModal,
            showModalConfirmacaoExclusao,
            setShowModalConfirmacaoExclusao,
            bloquearBtnSalvarForm,
            setBloquearBtnSalvarForm,
        };
    }, [filter, currentPage, firstPage, showModalForm, stateFormModal, showModalConfirmacaoExclusao, bloquearBtnSalvarForm]);

    return (
        <RepassesContext.Provider value={contextValue}>
            {children}
        </RepassesContext.Provider>
    )

}