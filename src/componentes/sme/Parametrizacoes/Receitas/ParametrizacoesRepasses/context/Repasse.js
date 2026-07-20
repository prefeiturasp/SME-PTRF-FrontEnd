import React, { createContext, useMemo, useState, useEffect } from 'react';
import { useAbasPorRecursoContext } from '../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext';
import useUnidadeSelecionada from '../../../../../../hooks/Globais/useUnidadeSelecionada';
import { visoesService } from '../../../../../../services/visoes.service';
import { useGetTabelasRepasse } from '../hooks/useGetTabelasRepasse';

const initialFilter = {
    page: 1,
    is_required_recurso_uuid: true,
    recurso_uuid: '',
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
    },
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

    tabelas: null,
    isLoading: false,
})

export const RepassesProvider = ({children}) => {
    const { selectedRecurso } = useAbasPorRecursoContext();

    const [filter, setFilter] = useState(initialFilter);

    const [currentPage, setCurrentPage] = useState(1);
    const [firstPage, setFirstPage] = useState(1);

    const [showModalForm, setShowModalForm] = useState(false);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);

    const [showModalConfirmacaoExclusao, setShowModalConfirmacaoExclusao] = useState(false);

    const [bloquearBtnSalvarForm, setBloquearBtnSalvarForm] = useState(false);

    const { isSME } = useUnidadeSelecionada(visoesService);

    const { data: tabelas, isLoading } = useGetTabelasRepasse({ 
        filters: filter, 
        solicitacao_sme: isSME() 
    });

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
        <RepassesContext.Provider value={contextValue}>
            {children}
        </RepassesContext.Provider>
    )

}