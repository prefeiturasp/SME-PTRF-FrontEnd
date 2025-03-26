import { useState, useCallback } from "react";
import moment from "moment";
import { usePatchAcaoPDDE } from "./usePatchAcaoPDDE";
import { usePostAcaoPDDE } from "./usePostAcaoPDDE";
import { useGetAcoesPDDE } from "./useGetAcoesPDDE";
import { useGetCategorias } from "./useGetCategorias";
import { useDeleteAcao } from "./useDeleteAcaoPDDE";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

const initialStateFormModal = {
    nome: "",
    categoria: "",
    aceita_capital: false,
    aceita_custeio: false,
    aceita_livre_aplicacao: false,    
    editavel: true,
    uuid: "",
    id: "",
    operacao: 'create',
    open: false
};
const initialStateFiltros = { filtrar_por_nome: "", filtrar_por_categoria: "" };
const rowsPerPage = 20;

export const useAcoesPDDE = () => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes();
    const [modalForm, setModalForm] = useState(initialStateFormModal);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [firstPage, setFirstPage] = useState(1);
    const [showModalInfoExclusaoNaoPermitida, setShowModalInfoExclusaoNaoPermitida] = useState(false);
    const [erroExclusaoNaoPermitida, setErroExclusaoNaoPermitida] = useState("");

    const { mutationPatch } = usePatchAcaoPDDE(setModalForm);
    const { mutationPost } = usePostAcaoPDDE(setModalForm);
    const { mutationDelete } = useDeleteAcao(setModalForm, setErroExclusaoNaoPermitida, setShowModalInfoExclusaoNaoPermitida);
    const { isLoading, isError, data: acoes, error, refetch, count } = useGetAcoesPDDE(stateFiltros, currentPage, rowsPerPage);
    const { isLoading: isLoadingCategoria, isError: isErrorCategoria, data: categorias, error: errorCategoria, refetch: refetchCategoria } = useGetCategorias();
    const handleOpenCreateModal = () => setModalForm({ ...initialStateFormModal, open: true });

    const handleClose = () => setModalForm(initialStateFormModal);
    const handleOpenModalForm = (rowData) => {
        setModalForm({ 
            ...rowData,
            operacao: "edit",
            open: true,
            editavel: true,
            categoria: rowData.categoria ? rowData.categoria : "", 
        });
    }
            
    const handleDelete = async (uuid) => mutationDelete.mutate(uuid);

    const submit = (values) => {
        if (!values.uuid) {
            mutationPost.mutate({payload: values})
        } else {
            mutationPatch.mutate({UUID: values.uuid, payload: values})
        }
    };

    const executaFiltros = (formFilter) => {
        setCurrentPage(1)
        setFirstPage(0)
        setStateFiltros(formFilter);
    };

    const limpaFiltros = () => {
        setCurrentPage(1)
        setFirstPage(0)
        setStateFiltros(initialStateFiltros);
    };

    const handleSubmitFormModal = async (values) => {
        const payload = {
            nome: values.nome,
            categoria: values.categoria,
            aceita_capital: values.aceita_capital,
            aceita_custeio: values.aceita_custeio,
            aceita_livre_aplicacao: values.aceita_livre_aplicacao,
            uuid: values.uuid
        };
        submit(payload)
    }

    return {
        modalForm,
        setModalForm,
        showModalConfirmDelete, 
        showModalInfoExclusaoNaoPermitida,
        erroExclusaoNaoPermitida, 
        stateFiltros,
        initialStateFiltros,
        isLoading,
        refetch,
        count,
        categorias,
        acoes,
        currentPage,
        firstPage,
        setCurrentPage,
        setFirstPage,
        TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES,
        handleOpenCreateModal, 
        handleClose,
        handleOpenModalForm, 
        handleDelete,
        handleSubmitFormModal,
        handleSubmitFiltros: executaFiltros, 
        limpaFiltros: limpaFiltros,
        setShowModalConfirmDelete, 
        setShowModalInfoExclusaoNaoPermitida,
    };
};
