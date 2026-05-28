import React, { createContext, useEffect, useMemo, useState } from 'react';
import { useAbasPorRecursoContext } from '../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext';

const initialFilter = {
    motivo:'',
    page: 1,
    page_size: 10,
    recurso_uuid: '',
    is_required_recurso_uuid: true,
};

const initialStateFormModal = {
    id: '',
    uuid: '',
    motivo: '',
    recurso_uuid: '',
    isOpen: false
};

const initialStateModalConfirmacaoExclusao = {
    is_open: false,
    motivo_uuid: ''
}

export const MotivosReprovacaoPcContext = createContext({
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

export const MotivosReprovacaoPcProvider = ({children}) => {
    const { selectedRecurso } = useAbasPorRecursoContext();
    const [filter, setFilter] = useState(initialFilter);

    const [currentPage, setCurrentPage] = useState(1);
    const [firstPage, setFirstPage] = useState(1);

    const [showModalForm, setShowModalForm] = useState(false);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);

    const [showModalConfirmacaoExclusao, setShowModalConfirmacaoExclusao] = useState(initialStateModalConfirmacaoExclusao);

    const [bloquearBtnSalvarForm, setBloquearBtnSalvarForm] = useState(false);

    const handleOpenCreateModal = (recurso) => {
        setStateFormModal({ ...initialStateFormModal, recurso_uuid: recurso?.uuid, isOpen: true });
    }

    const handleCloseModalForm = () => {
        setStateFormModal({ ...initialStateFormModal, recurso_uuid: '', isOpen: false });
    }

    const handleOpenModalConfirmacaoExclusao = (motivoUuid) => {
        setShowModalConfirmacaoExclusao({ is_open: true, motivo_uuid: motivoUuid });
    }

    const handleCloseModalConfirmacaoExclusao = () => {
        setShowModalConfirmacaoExclusao({ is_open: false, motivo_uuid: '' });
    }

    useEffect(() => {
        const initialFilterWithRecurso = {
            ...initialFilter,
            recurso_uuid: selectedRecurso?.uuid || '',
        }
        
        setFilter(initialFilterWithRecurso);
    }, [selectedRecurso?.uuid])

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
        <MotivosReprovacaoPcContext.Provider value={contextValue}>
            {children}
        </MotivosReprovacaoPcContext.Provider>
    )

}