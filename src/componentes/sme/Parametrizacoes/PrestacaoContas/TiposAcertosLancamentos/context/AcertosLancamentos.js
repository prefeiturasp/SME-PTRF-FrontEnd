import React, { createContext, useMemo, useState, useEffect } from 'react';
import { useGetTabelasAcertosLancamentos } from '../hooks/useGetTabelasAcertosLancamentos';
import { useAbasPorRecursoContext } from '../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext';

const initialFilter = {
    page: 1,
    filtrar_por_nome: "",
    filtrar_por_categoria: [],
    filtrar_por_ativo: "",
    recurso_uuid: ''
};

const initialStateFormModal = {
    uuid: '',
    id: '',
    recurso: '',
    nome: "",
    categoria: "",
    ativo: false,
    pode_alterar_saldo_conciliacao: false,
    operacao: 'create',
};

export const AcertosLancamentosContext = createContext({
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

    bloquearBtnSalvarForm: false,
    setBloquearBtnSalvarForm: () => {},

    tabelas: null,
    isLoading: false,
    initialStateFormModal: initialStateFormModal,
})

export const AcertosLancamentosProvider = ({children}) => {
    const [filter, setFilter] = useState(initialFilter);
    const [currentPage, setCurrentPage] = useState(1);
    const [firstPage, setFirstPage] = useState(1);
    const [showModalForm, setShowModalForm] = useState(false);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);
    const [showModalConfirmacaoExclusao, setShowModalConfirmacaoExclusao] = useState(false);
    const [bloquearBtnSalvarForm, setBloquearBtnSalvarForm] = useState(false);

    const { selectedRecurso } = useAbasPorRecursoContext();

    const { data: tabelas, isLoading } = useGetTabelasAcertosLancamentos(filter.recurso_uuid);

    useEffect(() => {
        const initialFilterWithRecursoUuid = {
            ...initialFilter,
            recurso_uuid: selectedRecurso?.uuid || '',
            page: 1,
        };
        setFilter(initialFilterWithRecursoUuid);
        setCurrentPage(1);
        setFirstPage(1);
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
            tabelas,
            isLoading,
        };
    }, [filter, currentPage, firstPage, showModalForm, stateFormModal, showModalConfirmacaoExclusao, bloquearBtnSalvarForm, tabelas, isLoading]);

    return (
        <AcertosLancamentosContext.Provider value={contextValue}>
            {children}
        </AcertosLancamentosContext.Provider>
    )
}
