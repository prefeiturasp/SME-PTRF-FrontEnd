import React, {createContext, useState, useMemo, useEffect} from 'react';
import { useAbasPorRecursoContext } from '../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext';
import { useGetTiposContas } from '../../TiposConta/hooks/useGetTiposdeConta';
import { useGetAssociacoes } from '../hooks/useGetAssociacoes';


const initialFilter = {
    recurso_uuid: '',
    is_required_recurso_uuid: true,
    page: 1,
    page_size: 10,
    associacao_nome: '',
    tipo_conta_uuid: '',
    status: '',
}

  const initialStateFormModal = {
    associacao: "",
    associacao_nome: "",
    tipo_conta: "",
    status: "",
    uuid: "",
    id: "",
    banco_nome: "",
    agencia: "",
    numero_conta: "",
    numero_cartao: "",
    data_inicio: "",
    recurso_uuid: "",
    isOpen: false,
  };

const initialStateModalConfirmacaoExclusao = {
    is_open: false,
    conta_uuid: ''
}

export const ContasDasAssociacoesContext = createContext({
    initialFilter: initialFilter,
    filter: initialFilter,
    setFilter: () => {},

    currentPage: 1,
    setCurrentPage: () => {},
    firstPage: 1,
    setFirstPage: () => {},

    stateFormModal: initialStateFormModal,
    setStateFormModal: () => {},

    showModalConfirmacaoExclusao: initialStateModalConfirmacaoExclusao,
    setShowModalConfirmacaoExclusao: () => {},

    bloquearBtnSalvarForm: false,
    setBloquearBtnSalvarForm: () => {},

    listaTiposDeConta: [],
    todasAsAssociacoesAutoComplete: [],
    loadingAssociacoes: false,

    handleOpenCreateModal: () => {},
    handleCloseModalForm: () => {},
    handleOpenModalConfirmacaoExclusao: () => {},
    handleCloseModalConfirmacaoExclusao: () => {},
    recebeAutoComplete: () => {},
    
})

export const ContasDasAssociacoesProvider = ({children}) => {
    const { selectedRecurso } = useAbasPorRecursoContext();
    const [filter, setFilter] = useState(initialFilter);
    const [currentPage, setCurrentPage] = useState(1);
    const [firstPage, setFirstPage] = useState(1);

    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);
    const [showModalConfirmacaoExclusao, setShowModalConfirmacaoExclusao] = useState(initialStateModalConfirmacaoExclusao);
    const [bloquearBtnSalvarForm, setBloquearBtnSalvarForm] = useState(false);
    const filters = {
        recurso_uuid: selectedRecurso?.uuid || '',
        is_required_recurso_uuid: true,
    };

    const { data: listaTiposDeConta } = useGetTiposContas({ recurso_uuid: selectedRecurso?.uuid });
    const { data: todasAsAssociacoesAutoComplete, isLoading: loadingAssociacoes } = useGetAssociacoes({ filters });

    useEffect(() => {
        const initialFilterWithRecurso = {
            ...initialFilter,
            recurso_uuid: selectedRecurso?.uuid || '',
        }
        
        setFilter(initialFilterWithRecurso);
    }, [selectedRecurso?.uuid])

    const handleOpenCreateModal = (recurso) => {
        setStateFormModal({ ...initialStateFormModal, recurso_uuid: recurso?.uuid, isOpen: true });
    }

    const handleCloseModalForm = () => {
        setStateFormModal(initialStateFormModal);
    }

    const handleOpenModalConfirmacaoExclusao = (contaUuid) => {
        setShowModalConfirmacaoExclusao({ is_open: true, conta_uuid: contaUuid });
    }

    const handleCloseModalConfirmacaoExclusao = () => {
        setShowModalConfirmacaoExclusao({ is_open: false, conta_uuid: '' });
    }

    const recebeAutoComplete = (selectAssociacao) => {
        setStateFormModal(prevState => ({
            ...prevState,
            associacao: selectAssociacao?.uuid || '',
            associacao_nome: selectAssociacao?.unidade?.nome_com_tipo || '',
        }));
    };

    const contextValue = useMemo(() => ({
        initialFilter,
        filter,
        setFilter,
        currentPage,
        setCurrentPage,
        firstPage,
        setFirstPage,
        initialStateFormModal,
        stateFormModal,
        setStateFormModal,
        showModalConfirmacaoExclusao,
        setShowModalConfirmacaoExclusao,
        bloquearBtnSalvarForm,
        setBloquearBtnSalvarForm,
        listaTiposDeConta,
        todasAsAssociacoesAutoComplete,
        loadingAssociacoes,
        handleOpenCreateModal,
        handleCloseModalForm,
        handleOpenModalConfirmacaoExclusao,
        handleCloseModalConfirmacaoExclusao,
        recebeAutoComplete,
    }), [filter, currentPage, firstPage, stateFormModal, showModalConfirmacaoExclusao, bloquearBtnSalvarForm, listaTiposDeConta, todasAsAssociacoesAutoComplete, loadingAssociacoes]);

    return (
        <ContasDasAssociacoesContext.Provider value={contextValue}>
            {children}
        </ContasDasAssociacoesContext.Provider>
    )
}
