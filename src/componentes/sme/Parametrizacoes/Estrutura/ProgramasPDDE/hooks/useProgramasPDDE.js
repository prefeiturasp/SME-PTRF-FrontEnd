import { useState } from "react";
import { useGetProgramasPDDE } from "./useGetProgramasPDDE";
import { usePostProgramaPDDE } from "./usePostProgramaPDDE";
import { usePatchProgramaPDDE } from "./usePatchProgramaPDDE";
import { useDeleteProgramaPDDE } from "./useDeleteProgramaPDDE";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

export const initialStateFormModal = {
    nome: "",
    uuid: "",
    id: "",
    pode_ser_excluida: true,
    operacao: "create",
    open: false,
};
export const initialStateFiltros = { filtrar_por_nome: "" };
export const rowsPerPage = 20;

export const useProgramasPDDE = () => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes();
    const [modalForm, setModalForm] = useState(initialStateFormModal);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [firstPage, setFirstPage] = useState(0);

    const handleClose = () => setModalForm(initialStateFormModal);

    const { isLoading, data: programas } = useGetProgramasPDDE(stateFiltros, currentPage, rowsPerPage);
    const { mutationPost } = usePostProgramaPDDE(handleClose);
    const { mutationPatch } = usePatchProgramaPDDE(handleClose);
    const { mutationDelete } = useDeleteProgramaPDDE(handleClose);

    const handleOpenCreateModal = () => setModalForm({ ...initialStateFormModal, open: true });

    const handleOpenModalForm = (rowData) => {
        setModalForm({
            ...initialStateFormModal,
            nome: rowData.nome,
            uuid: rowData.uuid,
            id: rowData.id,
            pode_ser_excluida: rowData.pode_ser_excluida,
            operacao: "edit",
            open: true,
        });
    };

    const handleSubmitFormModal = (values) => {
        const payload = { nome: values.nome.trim() };
        if (values.uuid) {
            mutationPatch.mutate({ uuid: values.uuid, payload });
        } else {
            mutationPost.mutate({ payload });
        }
    };

    const handleDelete = (uuid) => mutationDelete.mutate(uuid);

    const handleSubmitFiltros = (formFilter) => {
        setCurrentPage(1);
        setFirstPage(0);
        setStateFiltros(formFilter);
    };

    const limpaFiltros = () => {
        setCurrentPage(1);
        setFirstPage(0);
        setStateFiltros(initialStateFiltros);
    };

    return {
        TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES,
        modalForm,
        stateFiltros,
        isLoading,
        programas,
        firstPage,
        setCurrentPage,
        setFirstPage,
        showModalConfirmDelete,
        setShowModalConfirmDelete,
        handleOpenCreateModal,
        handleOpenModalForm,
        handleClose,
        handleSubmitFormModal,
        handleDelete,
        handleSubmitFiltros,
        limpaFiltros,
    };
};
