import React, { createContext, useMemo, useState, useEffect } from 'react';
import { useAbasPorRecursoContext } from '../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext';

const initialFilter = {
    motivo: '',
    recurso: '',
};

const initialStateFormModal = {
    id: '',
    uuid: '',
    motivo: '',
    recurso: '',
};

export const MotivosAprovacaoPcRessalvaContext = createContext({
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

    showModalConfirmacaoExclusao: { open: false, uuid: '' },
    setShowModalConfirmacaoExclusao: () => {},

    bloquearBtnSalvarForm: '',
    setBloquearBtnSalvarForm: () => {},
})

export const MotivosAprovacaoPcRessalvaProvider = ({children}) => {

    const { selectedRecurso } = useAbasPorRecursoContext();

    const [filter, setFilter] = useState(initialFilter);

    const [currentPage, setCurrentPage] = useState(1);
    const [firstPage, setFirstPage] = useState(1);

    const [showModalForm, setShowModalForm] = useState(false);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);

    const [showModalConfirmacaoExclusao, setShowModalConfirmacaoExclusao] = useState({ open: false, uuid: '' });

    const [bloquearBtnSalvarForm, setBloquearBtnSalvarForm] = useState(false);

    // Monitora mudanças no recurso selecionado e atualiza o filtro
    useEffect(() => {
        setFilter(prevFilter => ({
            ...prevFilter,
            recurso: selectedRecurso ? selectedRecurso.uuid : ''
        }));
        // Reseta para a primeira página quando muda de aba
        setCurrentPage(1);
        setFirstPage(0);
    }, [selectedRecurso]);

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
        <MotivosAprovacaoPcRessalvaContext.Provider value={contextValue}>
            {children}
        </MotivosAprovacaoPcRessalvaContext.Provider>
    )

}