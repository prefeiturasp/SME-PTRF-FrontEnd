import {useRef} from "react";
import HTTP_STATUS from "http-status-codes";
import {getErrorMessage} from "../../../../../utils/obtemMsgErroAxios";
import {
    criarDespesa,
    alterarDespesa,
    marcarLancamentoAtualizado,
    marcarGastoIncluido,
} from "../../../../../services/escolas/Despesas.service";
import {toastCustom} from "../../../../Globais/ToastCustom";
import {
    validaPayloadDespesas,
    metodosAuxiliares,
} from "../utils";

/**
 * Persistência da despesa (API create/update + fluxo acerto).
 */
export const useDespesaSubmit = (deps) => {
    const {
        despesaContext,
        parametroLocation,
        despesasTabelas,
        enviarFormulario,
        setFormErrors,
        setLoading,
        habilitaBtnSalvar,
        setShowDespesaIncompletaNaoPermitida,
        retornaPeriodo,
        mutationCreate,
        mutationUpdate,
        origem,
        montaPayloadMotivosPagamentoAntecipado,
        txtOutrosMotivosPagamentoAntecipado,
        checkBoxOutrosMotivosPagamentoAntecipado,
        validacoesPersonalizadas,
    } = deps;

    const aux = metodosAuxiliares;
    const onSubmitRef = useRef(async () => {});

    const existeErrosPersonalizadosComMensagem = (erros) =>
        Object.values(erros).some((msg) => msg !== null && msg !== undefined && String(msg).length > 0);

    const handleErroCriarDespesa = (response) => {
        let mensagemErro = "Verifique se os dados foram preenchidos corretamente.";
        if (response && response.data) {
            const error = {response};
            mensagemErro = getErrorMessage(error, "Ocorreu um erro criar/editar despesa.");
        }
        toastCustom.ToastCustomError("Erro ao tentar salvar despesa.", mensagemErro);
    };

    const onSubmit = async (values, setFieldValue) => {
        const erros_personalizados = await validacoesPersonalizadas(values, setFieldValue, "despesa_principal");
        setFormErrors(erros_personalizados);

        if (enviarFormulario && !existeErrosPersonalizadosComMensagem(erros_personalizados)) {
            validaPayloadDespesas(values, despesasTabelas, parametroLocation);

            values.motivos_pagamento_antecipado = montaPayloadMotivosPagamentoAntecipado();
            values.outros_motivos_pagamento_antecipado =
                txtOutrosMotivosPagamentoAntecipado.trim() && checkBoxOutrosMotivosPagamentoAntecipado
                    ? txtOutrosMotivosPagamentoAntecipado
                    : "";

            if (aux.origemAnaliseLancamento(parametroLocation)) {
                if (document.getElementsByClassName("despesa_incompleta").length > 0) {
                    setLoading(false);
                    habilitaBtnSalvar();
                    setShowDespesaIncompletaNaoPermitida(true);
                } else if (despesaContext.verboHttp === "POST") {
                    try {
                        let periodo_da_analise = await retornaPeriodo(parametroLocation.state.periodo_uuid);
                        aux.conciliaRateios(values, periodo_da_analise);

                        const response = await criarDespesa(values);
                        if (response.status === HTTP_STATUS.CREATED) {
                            console.log("Operação realizada com sucesso!");
                            let uuid_despesa = response.data.uuid;
                            let uuid_acerto_documento = parametroLocation.state.uuid_acerto_documento;
                            let payload = {
                                uuid_gasto_incluido: uuid_despesa,
                                uuid_solicitacao_acerto: uuid_acerto_documento,
                            };
                            let response_gasto_incluido = await marcarGastoIncluido(payload);
                            if (response_gasto_incluido.status === 200) {
                                console.log("Gasto incluido com sucesso!");
                            } else {
                                setLoading(false);
                            }
                            aux.getPath(origem, parametroLocation);
                        } else {
                            setLoading(false);
                            habilitaBtnSalvar();
                            handleErroCriarDespesa(response);
                        }
                    } catch (error) {
                        console.log(error);
                        setLoading(false);
                        habilitaBtnSalvar();
                    }
                } else if (despesaContext.verboHttp === "PUT") {
                    try {
                        let periodo_da_analise = await retornaPeriodo(parametroLocation.state.periodo_uuid);
                        aux.validaConciliacao(values, periodo_da_analise);

                        const response = await alterarDespesa(values, despesaContext.idDespesa);
                        if (response.status === 200) {
                            console.log("Operação realizada com sucesso!");
                            if (aux.ehOperacaoAtualizacao(parametroLocation)) {
                                let uuid_analise_lancamento = parametroLocation.state.uuid_analise_lancamento;
                                let response_atualiza_lancamento = await marcarLancamentoAtualizado(uuid_analise_lancamento);
                                if (response_atualiza_lancamento.status === 200) {
                                    console.log("Atualizacao de lancamento realizada com sucesso!");
                                } else {
                                    setLoading(false);
                                    habilitaBtnSalvar();
                                }
                            }
                            aux.getPath(origem, parametroLocation);
                        } else {
                            handleErroCriarDespesa(response);
                            setLoading(false);
                            habilitaBtnSalvar();
                        }
                    } catch (error) {
                        console.log(error);
                        setLoading(false);
                        habilitaBtnSalvar();
                    }
                }
            } else {
                if (despesaContext.verboHttp === "POST") {
                    mutationCreate.mutate({payload: values});
                } else if (despesaContext.verboHttp === "PUT") {
                    mutationUpdate.mutate({payload: values, idDespesa: despesaContext.idDespesa});
                }
            }
        } else {
            habilitaBtnSalvar();
        }
    };

    onSubmitRef.current = onSubmit;

    return {onSubmit, onSubmitRef, handleErroCriarDespesa};
};
