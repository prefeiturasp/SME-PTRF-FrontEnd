import { createContext, useEffect, useMemo, useState } from 'react';

import { useAbasPorRecursoContext } from '../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext';

import { useGetAssociacoes } from '../hooks/useGetAssociacoes';
import { useGetAcoesAssociacoes } from '../hooks/useGetAcoesAssociacoes';
import { useGetAssociacoesTiposAcoes } from '../hooks/useGetAssociacoesTiposAcoes';
import { useGetAcoesAssociacoesTabela } from '../hooks/useGetAcoesAssociacoesTabela';
import { usePostAcaoAssociacao } from '../hooks/usePostAcaoAssociacao';
import { usePatchAcaoAssociacao } from '../hooks/usePatchAcaoAssociacao';
import { useDeleteAcaoAssociacao } from '../hooks/useDeleteAcaoAssociacao';

const initialFilters = {
    page: 1,
    is_required_recurso_uuid: true,
    recurso_uuid: '',
    filtrar_por_nome_cod_eol: '',
    filtrar_por_acao: '',
    filtrar_por_status: '',
    filtro_informacoes: []
};

const initialStateFormModal = {
    associacao: "",
    acao: "",
    status: "",
    codigo_eol: "",
    uuid: "",
    id: "",
    nome_unidade: "",
    operacao: 'create',
};

export const AcoesDasAssociacoesContext = createContext({
  filters: initialFilters,
  setFilters: () => {},
  initialFilters: initialFilters,

  stateFormModal: initialStateFormModal,
  setStateFormModal: () => {},
  initialStateFormModal: initialStateFormModal,

  formReadOnly: true,
  setFormReadOnly: () => {},

  isOpenModalForm: false,
  setIsOpenModalForm: () => {},

  isOpenModalConfirmDelete: false,
  setIsOpenModalConfirmDelete: () => {},

  tabelaAssociacoes: {},
  isLoadingTabela: true,

  listaTiposDeAcao: [],
  isLoadingTiposDeAcao: true,

  acoesAssociacoes: [],
  isLoadingAcoesAssociacoes: true,
  countAcoesAssociacoes: 0,

  todasAsAcoesAutoComplete: [],
  isLoadingAssociacoes: true,

  handleOpenFormModalCreate: () => {},
  handleCloseModalForm: () => {},
  handleChangeFormModal: (nome , value) => {},
  handleSubmitModalFormAcoesDasAssociacoes: (event) => {},
  handleOpenConfirmDelete: () => {},
  handleCloseModalConfirmDelete: () => {},
  handleDeleteAcaoAssociacao: () => {},

  recebeAcaoAutoComplete: (selectAcao) => {},
})

export const AcoesDasAssociacoesContextProvider = ({children}) => {
  const { selectedRecurso } = useAbasPorRecursoContext();
  
  const [filters, setFilters] = useState(initialFilters);
  const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);
  const [formReadOnly, setFormReadOnly] = useState(true);
  const [isOpenModalForm, setIsOpenModalForm] = useState(false);
  const [isOpenModalConfirmDelete, setIsOpenModalConfirmDelete] = useState(false);

  const handleCloseModalConfirmDelete = () => {
    setIsOpenModalConfirmDelete(false);
    setStateFormModal(initialStateFormModal);
  }

  const { data: todasAsAcoesAutoComplete, isLoading: isLoadingAssociacoes } = useGetAssociacoes({ filters });
  const {data: tabelaAssociacoes, isLoading: isLoadingTabela} = useGetAcoesAssociacoesTabela({ filters });
  const {data: listaTiposDeAcao, isLoading: isLoadingTiposDeAcao} = useGetAssociacoesTiposAcoes({ filters });
  const { results: acoesAssociacoes, isLoading: isLoadingAcoesAssociacoes, count: countAcoesAssociacoes } = useGetAcoesAssociacoes({ filters });
  const { mutationPost } = usePostAcaoAssociacao(setIsOpenModalForm);
  const { mutationPatch } = usePatchAcaoAssociacao(setIsOpenModalForm);
  const { mutationDelete } = useDeleteAcaoAssociacao(handleCloseModalConfirmDelete);

  const handleOpenFormModalCreate = () => {
    setStateFormModal({ ...initialStateFormModal, recurso: selectedRecurso?.uuid || "", });
    setIsOpenModalForm(true);
  }

  const handleCloseModalForm = () => {
    setStateFormModal(initialStateFormModal);
    setIsOpenModalForm(false);
  }

  const handleChangeFormModal = (name, value) => {
    setStateFormModal(prevState => ({
        ...prevState,
        [name]: value
    }));
  };

  const recebeAcaoAutoComplete = (selectAcao) => {
    if (selectAcao) {
        setStateFormModal(prevState => ({
            ...prevState,
            associacao: selectAcao.uuid,
            codigo_eol: selectAcao.unidade.codigo_eol,
            uuid: selectAcao.acao?.uuid ? selectAcao.acao.uuid : "",
            id: selectAcao.acao?.id ? selectAcao.acao.id : "",
        }));

        setFormReadOnly(false)
    }
  };

  const handleSubmitModalFormAcoesDasAssociacoes = (event) => {
    event.preventDefault();

    const payload = {
        recurso_uuid: stateFormModal.recurso,
        associacao: stateFormModal.associacao,
        acao: stateFormModal.acao,
        status: stateFormModal.status,
    };

    if (stateFormModal.operacao === 'create') {
        mutationPost.mutate({ payload });
    } else {
      mutationPatch.mutate({ UUID: stateFormModal.uuid, payload })
    }
  };

  const handleOpenConfirmDelete = () => {
    setIsOpenModalConfirmDelete(true);
    setIsOpenModalForm(false);
  };

  const handleDeleteAcaoAssociacao = () => {
    mutationDelete.mutate({ uuid: stateFormModal.uuid, recurso_uuid: stateFormModal.recurso });
  };

  useEffect(() => {
    const initialFiltersWithRecursoUuid = {
        ...initialFilters,
        recurso_uuid: selectedRecurso?.uuid || "",
    };

    setFilters(initialFiltersWithRecursoUuid);
  }, [selectedRecurso])

  const contextValue = useMemo(() => {
    return {
      filters,
      setFilters,
      initialFilters,

      stateFormModal,
      setStateFormModal,
      initialStateFormModal,

      formReadOnly,
      setFormReadOnly,

      isOpenModalForm,
      setIsOpenModalForm,

      isOpenModalConfirmDelete,
      setIsOpenModalConfirmDelete,

      tabelaAssociacoes,
      isLoadingTabela,

      listaTiposDeAcao,
      isLoadingTiposDeAcao,

      acoesAssociacoes,
      isLoadingAcoesAssociacoes,
      countAcoesAssociacoes,

      todasAsAcoesAutoComplete,
      isLoadingAssociacoes,

      handleOpenFormModalCreate,
      handleCloseModalForm,
      handleChangeFormModal,
      handleSubmitModalFormAcoesDasAssociacoes,
      handleOpenConfirmDelete,
      handleCloseModalConfirmDelete,
      handleDeleteAcaoAssociacao,

      recebeAcaoAutoComplete,
    }
  }, [
    filters,
    stateFormModal,
    formReadOnly,
    isOpenModalForm,
    isOpenModalConfirmDelete,
    tabelaAssociacoes,
    listaTiposDeAcao,
    acoesAssociacoes,
    countAcoesAssociacoes,
    todasAsAcoesAutoComplete,
    isLoadingTabela,
    isLoadingTiposDeAcao,
    isLoadingAcoesAssociacoes,
    isLoadingAssociacoes,
  ]);

  return (
    <AcoesDasAssociacoesContext.Provider value={contextValue}>
      {children}
    </AcoesDasAssociacoesContext.Provider>
  )

}