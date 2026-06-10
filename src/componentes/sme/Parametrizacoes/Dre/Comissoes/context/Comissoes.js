import React, { createContext, useEffect, useMemo, useState } from 'react';

const initialFilter = {
    comissoes_uuid: [],
    recursos_uuid: [],
    responsavel_analise_pc: false,
    page: 1,
    page_size: 10,
};

const initialStateFormModal = {
    id: '',
    uuid: '',
    nome: '',
    recursos: [],
    responsavel_analise_pc: false,
    isOpen: false
};

const initialStateModalConfirmacaoExclusao = {
    is_open: false,
    uuid: ''
}

export const ComissoesContext = createContext({
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

    showModalConfirmacaoExclusao: initialStateModalConfirmacaoExclusao,
    setShowModalConfirmacaoExclusao: () => {},

    bloquearBtnSalvarForm: '',
    setBloquearBtnSalvarForm: () => {},

    handleOpenCreateModal: () => {},
    handleCloseModalForm: () => {},
})

export const ComissoesProvider = ({children}) => {
    const [filter, setFilter] = useState(initialFilter);

    const [currentPage, setCurrentPage] = useState(1);
    const [firstPage, setFirstPage] = useState(1);

    const [showModalForm, setShowModalForm] = useState(false);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);

    const [showModalConfirmacaoExclusao, setShowModalConfirmacaoExclusao] = useState(initialStateModalConfirmacaoExclusao);

    const [bloquearBtnSalvarForm, setBloquearBtnSalvarForm] = useState(false);

    const handleOpenCreateModal = () => {
        setStateFormModal({ ...initialStateFormModal, isOpen: true });
    }

    const handleCloseModalForm = () => {
        setStateFormModal({ ...initialStateFormModal, isOpen: false });
    }

    const handleOpenModalConfirmacaoExclusao = (uuid) => {
        setShowModalConfirmacaoExclusao({ is_open: true, uuid: uuid });
    }

    const handleCloseModalConfirmacaoExclusao = () => {
        setShowModalConfirmacaoExclusao({ is_open: false, uuid: '' });
    }

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
            handleOpenCreateModal,
            handleCloseModalForm,
            handleOpenModalConfirmacaoExclusao,
            handleCloseModalConfirmacaoExclusao,
        };
    }, [filter, currentPage, firstPage, showModalForm, stateFormModal, showModalConfirmacaoExclusao, bloquearBtnSalvarForm]);

    return (
        <ComissoesContext.Provider value={contextValue}>
            {children}
        </ComissoesContext.Provider>
    )

}