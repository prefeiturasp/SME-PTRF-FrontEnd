import { createContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useAbasPorRecursoContext } from '../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext';
import { useGetAcoes } from '../hooks/useGetAcoes';
import { usePostAcao } from '../hooks/usePostAcao';
import { usePatchAcao } from '../hooks/usePatchAcao';
import { useDeleteAcao } from '../hooks/useDeleteAcao';
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from '../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes';

const initialFilters = {
    filtrar_por_nome: "",
    is_required_recurso_uuid: true,
    recurso_uuid: '',
};

const initialStateFormModal = {
    nome: "",
    e_recursos_proprios: false,
    aceita_capital: false,
    aceita_custeio: false,
    aceita_livre: false,
    exibir_paa: true,
    uuid: "",
    id: "",
    operacao: 'create',
    open: false,
    recurso_uuid: "",
    recurso: { uuid: "" },
    // guarda para validação no submit
    exibir_paa_original: true,
    // adicionados no serializer para validação na desativação da ação
    tem_receitas_previstas_paa_em_elaboracao: false,
    tem_prioridades_paa_em_elaboracao: false,
};

const initialStateModalConfirmDesabilitarAcao = {
    open: false,
    form: {}
}

export const AcoesContext = createContext({
    filters: initialFilters,
    setFilters: () => {},
    draftFilters: initialFilters,
    setDraftFilters: () => {},

    modalForm: initialStateFormModal,
    setModalForm: () => {},

    showModalConfirmDesabilitarAcao: initialStateModalConfirmDesabilitarAcao,
    setShowModalConfirmDesabilitarAcao: () => {},

    showModalDeleteAcao: false,
    setShowModalDeleteAcao: () => {},

    isLoading: true,
    results: [],
    TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES: false,

    handleOpenCreateModal: () => {},
    handleClose: () => {},
    handleOpenModalForm: () => {},
    handleDelete: () => {},
    handleSubmitFormModal: () => {},
    handleChangeFiltros: () => {},
    handleSubmitFiltros: () => {},
    limpaFiltros: () => {},
    handleCloseModalConfirmDesabilitarAcao: () => {},
    handleCloseInfoNaoPodeExcluir: () => {},
    handleCloseInfoNaoPodeGravar: () => {},
});

export const AcoesContextProvider = ({ children }) => {
    const { selectedRecurso } = useAbasPorRecursoContext();
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes();

    const [modalForm, setModalForm] = useState(initialStateFormModal);
    const [draftFilters, setDraftFilters] = useState(initialFilters);
    const [filters, setFilters] = useState(initialFilters);
    const [showModalConfirmDesabilitarAcao, setShowModalConfirmDesabilitarAcao] = useState(initialStateModalConfirmDesabilitarAcao);

    const [showModalDeleteAcao, setShowModalDeleteAcao] = useState(false);

    const { mutationPatch } = usePatchAcao(setModalForm);
    const { mutationPost } = usePostAcao(setModalForm);
    const { mutationDelete } = useDeleteAcao(setModalForm);
    const { isLoading, data: results } = useGetAcoes({ filters });

    useEffect(() => {
        const initialFilterWithRecurso = { 
          ...initialFilters, 
          recurso_uuid: selectedRecurso?.uuid || ""
        };

        setDraftFilters(initialFilterWithRecurso);
        setFilters(initialFilterWithRecurso);
    }, [selectedRecurso?.uuid]);

    const handleOpenCreateModal = useCallback(() => {
        setModalForm({ 
          ...initialStateFormModal, 
          open: true,
          recurso_uuid: selectedRecurso?.uuid || "",
          recurso: { uuid: selectedRecurso?.uuid || "" }
        })
    }, [selectedRecurso?.uuid]);

    const handleChangeFormModal = (name, value) => {
      setModalForm(prevState => ({
          ...prevState,
          [name]: value
      }));
    };

    const handleClose = useCallback(() => setModalForm(initialStateFormModal), []);

    const handleOpenModalForm = useCallback((rowData) => setModalForm({ 
      ...rowData, 
      operacao: "edit", 
      open: true,
      exibir_paa_original: rowData.exibir_paa,
      recurso: { uuid: rowData.recurso_uuid || selectedRecurso?.uuid }
    }), [selectedRecurso?.uuid]);

    const handleCloseModalDeleteAcao = useCallback(() => {
        setShowModalDeleteAcao(false);
    }, []);

    const handleDelete = useCallback(async (uuid) => {
        mutationDelete.mutate(uuid);
        handleCloseModalDeleteAcao();
    }, [mutationDelete, handleCloseModalDeleteAcao]);

    const handleCloseModalConfirmDesabilitarAcao = useCallback(() => setShowModalConfirmDesabilitarAcao(initialStateModalConfirmDesabilitarAcao), []);

    const handleOpenModalDeleteAcao = useCallback(() => {
        setShowModalDeleteAcao(true);
    }, []);

    const submitForm = useCallback(async (values) => {
        console.log("recurso value", values.recurso);
        const payload = {
            nome: values.nome,
            e_recursos_proprios: values.e_recursos_proprios,
            aceita_capital: values.aceita_capital,
            aceita_custeio: values.aceita_custeio,
            aceita_livre: values.aceita_livre,
            exibir_paa: values.exibir_paa,
            recurso: values.recurso.uuid,
        };

        if (!values.uuid) {
            mutationPost.mutate({ payload })
        } else {
            mutationPatch.mutate({ UUID: values.uuid, payload })
        }
    }, [mutationPost, mutationPatch]);

    const handleSubmitFormModal = useCallback(async (values) => {
        // valida quando uma ação estiver sendo desabilitada
        // verifica quando houver receitas previstas indicadas
        const desabilitando_acao = (
            values?.exibir_paa === false && values?.exibir_paa_original === true
        )
        const edicao = values.operacao === 'edit';
        const tem_receitas_previstas_indicadas = values?.tem_receitas_previstas_paa_em_elaboracao;
        const tem_prioridades = values?.tem_prioridades_paa_em_elaboracao;
        
        if (edicao && desabilitando_acao && (tem_receitas_previstas_indicadas || tem_prioridades)) {
            // Exibe Modal de confirmação da desativacão da ação,
            // guardando o formModal para ser utilizado posteriormente na modal de
            // confirmação sem a perda dos dados em edição
            setShowModalConfirmDesabilitarAcao({open: true, form: values});
        } else {
            // Fluxo normal
            await submitForm(values);
        }
    }, [submitForm]);

    const handleChangeFiltros = useCallback((name, value) => {
        setDraftFilters({
            ...draftFilters,
            [name]: value
        });
    }, [draftFilters]);

    const handleSubmitFiltros = useCallback(async () => {
        setFilters(draftFilters);
    }, [draftFilters]);

    const limpaFiltros = useCallback(async () => {
        const initialFilterWithRecurso = { 
          ...initialFilters,
          recurso_uuid: selectedRecurso?.uuid || ""
        };
        setFilters(initialFilterWithRecurso);
        setDraftFilters(initialFilterWithRecurso);
    }, [selectedRecurso?.uuid]);

    const contextValue = useMemo(() => ({
        filters,
        setFilters,
        draftFilters,
        setDraftFilters,
        modalForm,
        setModalForm,
        showModalConfirmDesabilitarAcao,
        setShowModalConfirmDesabilitarAcao,
        showModalDeleteAcao,
        setShowModalDeleteAcao,
        isLoading,
        results,
        TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES,
        handleOpenCreateModal,
        handleChangeFormModal,
        handleClose,
        handleOpenModalForm,
        handleDelete,
        handleSubmitFormModal,
        handleChangeFiltros,
        handleSubmitFiltros,
        limpaFiltros,
        handleCloseModalConfirmDesabilitarAcao,
        handleCloseModalDeleteAcao,
        handleOpenModalDeleteAcao,
        submitForm
    }), [
        filters,
        draftFilters,
        modalForm,
        showModalConfirmDesabilitarAcao,
        showModalDeleteAcao,
        isLoading,
        results,
        TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES,
        handleOpenCreateModal,
        handleClose,
        handleOpenModalForm,
        handleDelete,
        handleSubmitFormModal,
        handleChangeFiltros,
        handleSubmitFiltros,
        limpaFiltros,
        handleCloseModalConfirmDesabilitarAcao,
        handleCloseModalDeleteAcao,
        handleOpenModalDeleteAcao,
        submitForm
    ]);

    return <AcoesContext.Provider value={contextValue}>
      {children}
    </AcoesContext.Provider>;
};
