import React, { createContext, useEffect, useMemo, useState } from 'react';
import { useAbasPorRecursoContext } from '../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext';

const initialFilter = {
    nome: '',
    page: 1,
    recurso_uuid: '',
    is_required_recurso_uuid: true
};

const initialStateFormModal = {
    id: '',
    uuid: '',
    nome: '',
    tipo_receita: '',
    recurso_uuid: '',
    isOpen: false
};

const initialStateModalConfirmacaoExclusao = {
    is_open: false,
    uuid: ''
}

export const DetalhesTipoCreditoContext = createContext({
    initialFilter: initialFilter,
    filter: initialFilter,
    setFilter: () => {},
    draftFilter: initialFilter,
    setDraftFilter: () => {},

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

export const DetalhesTipoCreditoProvider = ({children}) => {    
    const [filter, setFilter] = useState(initialFilter);
    const [draftFilter, setDraftFilter] = useState(initialFilter);

    const [currentPage, setCurrentPage] = useState(1);
    const [firstPage, setFirstPage] = useState(1);

    const [showModalForm, setShowModalForm] = useState(false);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);

    const [showModalConfirmacaoExclusao, setShowModalConfirmacaoExclusao] = useState(initialStateModalConfirmacaoExclusao);

    const [bloquearBtnSalvarForm, setBloquearBtnSalvarForm] = useState(false);

    const { selectedRecurso } = useAbasPorRecursoContext();

    useEffect(() => {
        const initialFilterWithRecurso = { 
            ...initialFilter, 
            recurso_uuid: selectedRecurso ? selectedRecurso.uuid : null 
        };
        setFilter(initialFilterWithRecurso);
    }, [selectedRecurso?.uuid])

    const handleOpenCreateModal = (recurso) => {
        setStateFormModal({ ...initialStateFormModal, recurso_uuid: recurso?.uuid, isOpen: true });
    }

    const handleCloseModalForm = () => {
        setStateFormModal({ ...initialStateFormModal, recurso_uuid: '', isOpen: false });
    }

    const handleOpenModalConfirmacaoExclusao = (detalheUuid) => {
        setShowModalConfirmacaoExclusao({ is_open: true, uuid: detalheUuid });
    }

    const handleCloseModalConfirmacaoExclusao = () => {
        setShowModalConfirmacaoExclusao({ is_open: false, uuid: '' });
    }

    const contextValue = useMemo(() => {
        return {
            initialFilter,
            filter,
            setFilter,
            draftFilter,
            setDraftFilter,
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
        <DetalhesTipoCreditoContext.Provider value={contextValue}>
            {children}
        </DetalhesTipoCreditoContext.Provider>
    )

}