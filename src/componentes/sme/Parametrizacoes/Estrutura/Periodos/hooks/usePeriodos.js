import { useState, useCallback } from "react";
import moment from "moment";
import { usePatchPeriodo } from "./usePatchPeriodo";
import { usePostPeriodo } from "./usePostPeriodo";
import { useGetPeriodos } from "./useGetPeriodos";
import { useDeletePeriodo } from "./useDeletePeriodo";
import { getDatasAtendemRegras } from "../../../../../../services/sme/Parametrizacoes.service";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

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
const initialStateFiltros = { filtrar_por_referencia: "" };

export const usePeriodos = () => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes();
    const [modalForm, setModalForm] = useState(initialStateFormModal);
    const [erroDatasAtendemRegras, setErroDatasAtendemRegras] = useState("");
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [showModalConfirmDeletePeriodo, setShowModalConfirmDeletePeriodo] = useState(false);
    const [showModalInfoExclusaoNaoPermitida, setShowModalInfoExclusaoNaoPermitida] = useState(false);
    const [erroExclusaoNaoPermitida, setErroExclusaoNaoPermitida] = useState("");

    const { mutationPatch } = usePatchPeriodo(setModalForm);
    const { mutationPost } = usePostPeriodo(setModalForm);
    const { mutationDelete } = useDeletePeriodo(setModalForm, setErroExclusaoNaoPermitida, setShowModalInfoExclusaoNaoPermitida);
    const { isLoading, data: results, count, refetch } = useGetPeriodos(stateFiltros);

    const handleOpenCreateModal = () => setModalForm({ ...initialStateFormModal, open: true });

    const handleClose = () => setModalForm(initialStateFormModal);

    const handleOpenModalForm = (rowData) => setModalForm({ ...rowData, operacao: "edit", open: true });

    const handleDelete = async (uuid) => mutationDelete.mutate(uuid);

    const submit = (values) => {
        if (!values.uuid) {
            mutationPost.mutate({payload: values})
        } else {
            mutationPatch.mutate({UUID: values.uuid, values: values})
        }
    };

    const handleSubmitFormModal = async (values) => {
        const payload = {
            uuid: values.uuid ? values.uuid : '',
            referencia: values.referencia,
            data_prevista_repasse: values.data_prevista_repasse ? moment(values.data_prevista_repasse).format("YYYY-MM-DD") : null,
            data_inicio_realizacao_despesas: values.data_inicio_realizacao_despesas ? moment(values.data_inicio_realizacao_despesas).format("YYYY-MM-DD") : null,
            data_fim_realizacao_despesas: values.data_fim_realizacao_despesas ? moment(values.data_fim_realizacao_despesas).format("YYYY-MM-DD") : null,
            data_inicio_prestacao_contas: values.data_inicio_prestacao_contas ? moment(values.data_inicio_prestacao_contas).format("YYYY-MM-DD") : null,
            data_fim_prestacao_contas: values.data_fim_prestacao_contas ? moment(values.data_fim_prestacao_contas).format("YYYY-MM-DD") : null,
            periodo_anterior: values.periodo_anterior ? values.operacao === "create" ? values.periodo_anterior : values.periodo_anterior.uuid : ''
        };

        let datas_atendem = await getDatasAtendemRegras(
                payload.data_inicio_realizacao_despesas, 
                payload.data_fim_realizacao_despesas, 
                payload.periodo_anterior, 
                payload.uuid,
            );
        if (!datas_atendem.valido){
            console.log(datas_atendem, datas_atendem.mensagem)
            setErroDatasAtendemRegras(datas_atendem.mensagem)
        } else {
            setErroDatasAtendemRegras("");
            submit(payload)
        }        
    }

    return {
        modalForm, 
        showModalConfirmDeletePeriodo, 
        showModalInfoExclusaoNaoPermitida,
        erroDatasAtendemRegras, 
        erroExclusaoNaoPermitida, 
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
        handleChangeFiltros: useCallback((name, value) => setStateFiltros((prev) => ({ ...prev, [name]: value })), []),
        handleSubmitFiltros: refetch, 
        limpaFiltros: () => setStateFiltros(initialStateFiltros),
        setShowModalConfirmDeletePeriodo, 
        setShowModalInfoExclusaoNaoPermitida,
        setErroDatasAtendemRegras
    };
};
