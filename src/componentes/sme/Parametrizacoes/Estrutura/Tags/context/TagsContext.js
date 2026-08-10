import { createContext, useState, useCallback, useMemo } from 'react';
import { useAbasPorRecursoContext } from '../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext';
import { useGetTags } from '../hooks/useGetTags';
import { usePostTag } from '../hooks/usePostTag';
import { usePatchTag } from '../hooks/usePatchTag';
import { useDeleteTag } from '../hooks/useDeleteTag';
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from '../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes';
import { useEffect } from 'react';

const initialFilters = {
    filtrar_por_nome: "",
    filtrar_por_status: "",
    is_required_recurso_uuid: true,
    recurso_uuid: '',
};

const initialStateFormModal = {
    nome: "",
    status: "INATIVO",
    uuid: "",
    id: "",
    operacao: 'create',
    open: false,
};

const initialStateModalConfirmDeleteTag = {
    open: false,
    tag_uuid: "",
}

export const TagsContext = createContext({
    filters: initialFilters,
    setFilters: () => {},
    draftFilters: initialFilters,
    setDraftFilters: () => {},

    modalForm: initialStateFormModal,
    setModalForm: () => {},

    showModalConfirmDeleteTag: initialStateModalConfirmDeleteTag,
    setShowModalConfirmDeleteTag: () => {},

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
    handleCloseModalConfirmDeleteTag: () => {},
});

export const TagsContextProvider = ({ children }) => {
    const { selectedRecurso } = useAbasPorRecursoContext();
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes();

    const [modalForm, setModalForm] = useState(initialStateFormModal);
    const [draftFilters, setDraftFilters] = useState(initialFilters);
    const [filters, setFilters] = useState(initialFilters);
    const [showModalConfirmDeleteTag, setShowModalConfirmDeleteTag] = useState(initialStateModalConfirmDeleteTag);

    const { mutationPatch } = usePatchTag(setModalForm);
    const { mutationPost } = usePostTag(setModalForm);
    const { mutationDelete } = useDeleteTag(setModalForm);
    const { isLoading, data: results } = useGetTags({ filters });

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
          recurso: { uuid: selectedRecurso?.uuid } 
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
      recurso: { uuid: rowData.recurso }
    }), []);

    const handleDelete = useCallback(async (uuid) => mutationDelete.mutate(uuid), [mutationDelete]);

    const handleCloseModalConfirmDeleteTag = useCallback(() => setShowModalConfirmDeleteTag(initialStateModalConfirmDeleteTag), []);

    const handleSubmitFormModal = useCallback(async (values) => {
        const payload = {
          nome: values.nome,
          status: values.status,
          recurso: values.recurso.uuid,
        };

        if (!values.uuid) {
            mutationPost.mutate({ payload })
        } else {
            mutationPatch.mutate({ UUID: values.uuid, payload })
        }
    }, [mutationPost, mutationPatch]);

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
        setFilters(prevState => ({ 
          ...initialFilters,
          recurso_uuid: selectedRecurso?.uuid
          }
        ));

        setDraftFilters(prevState => ({
          ...initialFilters,
          recurso_uuid: prevState.recurso_uuid
        }));
    }, [selectedRecurso?.uuid]);

    const contextValue = useMemo(() => ({
        filters,
        setFilters,
        draftFilters,
        setDraftFilters,
        modalForm,
        setModalForm,
        showModalConfirmDeleteTag,
        setShowModalConfirmDeleteTag,
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
        handleCloseModalConfirmDeleteTag
    }), [
        filters,
        draftFilters,
        modalForm,
        showModalConfirmDeleteTag,
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
        handleCloseModalConfirmDeleteTag
    ]);

    return <TagsContext.Provider value={contextValue}>
      {children}
    </TagsContext.Provider>;
};
