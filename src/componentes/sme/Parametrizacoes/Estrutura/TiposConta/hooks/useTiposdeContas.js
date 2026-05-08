import { useState, useEffect, useCallback } from "react";
import { useAbasPorRecursosContext } from "../../../componentes/AbasPorRecurso/hooks/useRecursosContext";
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

export const useTiposContas = () => {

  const rowsPerPage = 10;
  const [listaDeTiposContas, setListaDeTiposContas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModalForm, setShowModalForm] = useState(false);
  const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);

  const { selectedRecurso } = useAbasPorRecursosContext();

  const [showModalConfirmDeleteTipoConta, setShowModalConfirmDeleteTipoConta] = useState(false);

  const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes();

  // Filtros
  const initialStateFiltros = {
      nome: "",
      recurso_uuid: selectedRecurso?.uuid || "",
  };
  const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
  
  // Sincroniza o filtro de recurso_uuid quando selectedRecurso muda
  useEffect(() => {
    if (selectedRecurso?.uuid) {
      setStateFiltros(prevState => ({
        ...prevState,
        recurso_uuid: selectedRecurso?.uuid
      }));
    }
  }, [selectedRecurso?.uuid]);
  
  const { isLoading, data: results, refetch } = useGetTiposContas(stateFiltros);
  const { mutationPatch } = usePatchTiposDeConta(setShowModalForm);
  const { mutationDelete } = useDeleteTipodeConta(setShowModalConfirmDeleteTipoConta, setShowModalForm);
  const { mutationPost  } = usePostTipoConta(setShowModalForm);

  const handleChangeFiltros = useCallback((nome, value) => {
    setStateFiltros({
      ...stateFiltros,
      [nome]: value
    });
  }, [stateFiltros]);

  const handleSubmitFiltros = async () => {
    refetch();
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
    setStateFiltros(prevState => ({...prevState, nome: "" }))

    setTimeout(() => refetch(), 100);
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