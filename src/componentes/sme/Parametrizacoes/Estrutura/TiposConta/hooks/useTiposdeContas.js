import { useState, useEffect, useCallback } from "react";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { EditIconButton } from "../../../../../Globais/UI/Button";
import { useGetTiposContas } from "./useGetTiposdeConta";
import { usePatchTiposDeConta } from "./usePatchTiposdeConta";
import { useDeleteTipodeConta } from "./useDeleteTiposdeConta";
import { usePostTipoConta } from "./usePostTiposdeConta";

// Modal
const initialStateFormModal = {
  nome: "",
  banco_nome: "",
  agencia: "",
  numero_conta: "",
  numero_cartao: "",
  apenas_leitura: false,
  permite_inativacao: false, 
  uuid: "",
  id: "",
  operacao: 'create',
  recurso: ""
};

// Filtros
  const initialStateFiltros = {
    nome: "",
    recurso_uuid: "",
  };

export const useTiposContas = () => {
  const { selectedRecurso } = useAbasPorRecursoContext();

  const rowsPerPage = 10;
  const [listaDeTiposContas, setListaDeTiposContas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModalForm, setShowModalForm] = useState(false);
  const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);

  const [showModalConfirmDeleteTipoConta, setShowModalConfirmDeleteTipoConta] = useState(false);

  const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes();

  const [draftFiltros, setDraftFiltros] = useState(initialStateFiltros);
  const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
  
  // Sincroniza o filtro de recurso_uuid quando selectedRecurso muda
  useEffect(() => {
    const initialFilterWithRecurso = {
      ...initialStateFiltros,
      recurso_uuid: selectedRecurso?.uuid || ""
    };

    setDraftFiltros(initialFilterWithRecurso);
    setStateFiltros(initialFilterWithRecurso);
  }, [selectedRecurso?.uuid]);
  
  const { isLoading, data: results, refetch } = useGetTiposContas(stateFiltros);
  const { mutationPatch } = usePatchTiposDeConta(setShowModalForm);
  const { mutationDelete } = useDeleteTipodeConta(setShowModalConfirmDeleteTipoConta, setShowModalForm);
  const { mutationPost  } = usePostTipoConta(setShowModalForm);

  const handleChangeFiltros = useCallback((nome, value) => {
    setDraftFiltros(prevState => ({
      ...prevState,
      [nome]: value
    }));
  }, []);

  const handleSubmitFiltros = async () => {
    setStateFiltros(draftFiltros);
  };

  const handleOpenCreateModal = () => {
    setStateFormModal({ ...initialStateFormModal, open: true, recurso: { uuid: selectedRecurso?.uuid } })
    setShowModalForm(true);
  };

  const handleEditFormModalTiposConta = useCallback( async (rowData) => {  
    setStateFormModal({
      ...stateFormModal,
      nome: rowData.nome,
      banco_nome: rowData.banco_nome,
      agencia: rowData.agencia,
      numero_conta: rowData.numero_conta,
      numero_cartao: rowData.numero_cartao,
      apenas_leitura: rowData.apenas_leitura,
      permite_inativacao: rowData.permite_inativacao, 
      uuid: rowData.uuid,
      id: rowData.id,
      operacao: 'edit',
      recurso: { uuid: rowData.recurso }
    });
    setShowModalForm(true)
  }, [stateFormModal, selectedRecurso]);
  
  const acoesTemplate = useCallback((rowData) => {
    return (
      <EditIconButton
          onClick={() => handleEditFormModalTiposConta(rowData)}
      />            
    )
  }, [handleEditFormModalTiposConta]);

  const handleSubmitModalFormTiposConta = useCallback(async (values) => {
    let payload = {
      nome: values.nome,
      banco_nome: values.banco_nome,
      agencia: values.agencia,
      numero_conta: values.numero_conta,
      numero_cartao: values.numero_cartao,
      apenas_leitura: values.apenas_leitura,
      permite_inativacao: values.permite_inativacao,
      recurso: values.recurso.uuid
    };

    if (values.operacao === 'create'){
      mutationPost.mutate({payload});
    } else {
      mutationPatch.mutate({UUID: values.uuid, payload});
    }
  }, []);

  const onDeleteTipoContaTrue = useCallback(async () => {
    mutationDelete.mutate(stateFormModal.uuid);
  }, [stateFormModal]);

  const handleCloseFormModal = useCallback(() => {
    setStateFormModal(initialStateFormModal);
    setShowModalForm(false)
  }, [initialStateFormModal]);

  const handleCloseConfirmDeleteTipoConta = useCallback(() => {
    setShowModalConfirmDeleteTipoConta(false)
  }, []);

  const handleLimparFiltros = () => {
    setDraftFiltros(prevState => ({...initialStateFiltros, recurso_uuid: prevState?.recurso_uuid }));
    setStateFiltros(prevState => ({...initialStateFiltros, recurso_uuid: prevState?.recurso_uuid }));
  }

  return {
    rowsPerPage,
    listaDeTiposContas,
    setListaDeTiposContas,
    loading,
    setLoading,
    showModalConfirmDeleteTipoConta,
    setShowModalConfirmDeleteTipoConta,
    TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES,
    stateFiltros,
    handleChangeFiltros,
    handleSubmitFiltros,
    showModalForm,
    draftFiltros,
    stateFormModal,
    handleOpenCreateModal,
    acoesTemplate,
    handleSubmitModalFormTiposConta,
    onDeleteTipoContaTrue,
    handleCloseFormModal,
    handleCloseConfirmDeleteTipoConta,
    handleLimparFiltros,
    isLoading,
    results
  }

}