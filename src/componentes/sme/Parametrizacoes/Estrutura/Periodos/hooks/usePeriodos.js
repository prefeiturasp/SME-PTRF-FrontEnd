import { useState, useCallback, useEffect } from "react";
import moment from "moment";
import { usePatchPeriodo } from "./usePatchPeriodo";
import { usePostPeriodo } from "./usePostPeriodo";
import { useGetPeriodos } from "./useGetPeriodos";
import { useDeletePeriodo } from "./useDeletePeriodo";
import { getDatasAtendemRegras } from "../../../../../../services/sme/Parametrizacoes.service";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import { useGetPeriodosForm } from "./useGetPeriodosForm";

const initialStateFormModal = {
    referencia: "",
    data_prevista_repasse: "",
    data_inicio_realizacao_despesas: "",
    data_fim_realizacao_despesas: "",
    data_inicio_prestacao_contas: "",
    data_fim_prestacao_contas: "",
    periodo_anterior: "",
    editavel: true,
    uuid: "",
    id: "",
    operacao: 'create',
    open: false
};

const initialStateFiltros = {
    filtrar_por_referencia: "",
    is_required_recurso_uuid: true,
    recurso_uuid: '',
};

const initialStateModalConfirmDeletePeriodo = {
    open: false,
    periodo_uuid: "",
}

export const usePeriodos = () => {
    const { selectedRecurso } = useAbasPorRecursoContext();
    
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes();
    const [modalForm, setModalForm] = useState(initialStateFormModal);
    const [erroDatasAtendemRegras, setErroDatasAtendemRegras] = useState("");
    const [draftFilters, setDraftFilters] = useState(initialStateFiltros);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [showModalConfirmDeletePeriodo, setShowModalConfirmDeletePeriodo] = useState(initialStateModalConfirmDeletePeriodo);
    const [showModalInfoExclusaoNaoPermitida, setShowModalInfoExclusaoNaoPermitida] = useState(false);
    const [erroExclusaoNaoPermitida, setErroExclusaoNaoPermitida] = useState("");

    const { mutationPatch } = usePatchPeriodo(setModalForm);
    const { mutationPost } = usePostPeriodo(setModalForm);
    const { mutationDelete } = useDeletePeriodo(setModalForm);
    const { isLoading, data: results, count, refetch } = useGetPeriodos({ filters: stateFiltros });
    const { data: resultsPeriodosForm } = useGetPeriodosForm({
        filters: {
            ...initialStateFiltros,
            recurso_uuid: selectedRecurso?.uuid
        },
        is_enabled: modalForm.open
    });

    useEffect(() => {
        const initialFilterWithRecurso = { ...initialStateFiltros, recurso_uuid: selectedRecurso?.uuid };
        setStateFiltros(initialFilterWithRecurso);
        setDraftFilters(initialFilterWithRecurso);
    }, [selectedRecurso?.uuid]);

    const handleOpenCreateModal = (recursoSelecionadoAba) => {
        setModalForm({ ...initialStateFormModal, open: true, recurso: { uuid: recursoSelecionadoAba?.uuid } })
    };

    const handleClose = () => setModalForm(initialStateFormModal);

    const handleOpenModalForm = (rowData) => setModalForm({ ...rowData, operacao: "edit", open: true });

    const handleDelete = async (uuid) => mutationDelete.mutate(uuid);

    const handleCloseModalConfirmDeletePeriodo = () => setShowModalConfirmDeletePeriodo(initialStateModalConfirmDeletePeriodo);

    const submit = (values) => {
        if (!values.uuid) {
            mutationPost.mutate({payload: values})
        } else {
            mutationPatch.mutate({UUID: values.uuid, payload: values})
        }
    };

    const handleSubmitFormModal = async (values) => {
        const payload = {
            recurso: values.recurso.uuid,
            uuid: values.uuid ? values.uuid : '',
            referencia: values.referencia,
            data_prevista_repasse: values.data_prevista_repasse ? moment(values.data_prevista_repasse).format("YYYY-MM-DD") : null,
            data_inicio_realizacao_despesas: values.data_inicio_realizacao_despesas ? moment(values.data_inicio_realizacao_despesas).format("YYYY-MM-DD") : null,
            data_fim_realizacao_despesas: values.data_fim_realizacao_despesas ? moment(values.data_fim_realizacao_despesas).format("YYYY-MM-DD") : null,
            data_inicio_prestacao_contas: values.data_inicio_prestacao_contas ? moment(values.data_inicio_prestacao_contas).format("YYYY-MM-DD") : null,
            data_fim_prestacao_contas: values.data_fim_prestacao_contas ? moment(values.data_fim_prestacao_contas).format("YYYY-MM-DD") : null,
            periodo_anterior: values.periodo_anterior
                ? (typeof values.periodo_anterior === 'object' ? values.periodo_anterior.uuid : values.periodo_anterior)
                : ''
 
        };

        let datas_atendem = await getDatasAtendemRegras(
                payload.data_inicio_realizacao_despesas, 
                payload.data_fim_realizacao_despesas, 
                payload.periodo_anterior, 
                payload.uuid,
                payload.recurso,
            );
        if (!datas_atendem.valido){
            setErroDatasAtendemRegras(datas_atendem.mensagem)
        } else {
            setErroDatasAtendemRegras("");
            submit(payload)
        }        
    }

    const handleLimparFiltros = () => {
        setStateFiltros(prevState => ({
            ...initialStateFiltros,
            recurso_uuid: prevState.recurso_uuid
        }))

        setDraftFilters((prevState) => ({
            ...initialStateFiltros,
            recurso_uuid: prevState.recurso_uuid
        }));
    }

    const handleSubmitFiltros = () => {
        setStateFiltros(draftFilters);
    }

    return {
        modalForm, 
        showModalConfirmDeletePeriodo, 
        showModalInfoExclusaoNaoPermitida,
        erroDatasAtendemRegras, 
        erroExclusaoNaoPermitida,
        draftFilters,
        stateFiltros, 
        isLoading,
        results, 
        count, 
        refetch, 
        TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES,
        handleOpenCreateModal, 
        handleClose, 
        handleOpenModalForm, 
        handleDelete,
        handleSubmitFormModal, 
        handleChangeFiltros: useCallback((name, value) => setDraftFilters((prev) => ({ ...prev, [name]: value })), []),
        handleSubmitFiltros, 
        limpaFiltros: handleLimparFiltros,
        setShowModalConfirmDeletePeriodo, 
        setShowModalInfoExclusaoNaoPermitida,
        setErroDatasAtendemRegras,
        handleCloseModalConfirmDeletePeriodo,
        resultsPeriodosForm
    };
};
