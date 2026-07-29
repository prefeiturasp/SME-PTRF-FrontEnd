import {
    getDespesaCadastrada,
    getMotivosPagamentoAntecipado,
} from "../../../../../services/escolas/Despesas.service";
import {
    validaPayloadDespesas,
    metodosAuxiliares,
} from "../utils";

/**
 * Cadeia de modais pré-save (saldo, ação, conferida, duplicada, antecipado, incompleta).
 * Ao final chama onSubmitRef.current.
 */
export const useCadeiaModais = (deps) => {
    const {
        despesaContext,
        parametroLocation,
        setExibeMsgErroValorRecursos,
        setExibeMsgErroValorOriginal,
        setSaldosInsuficientesDaConta,
        setSaldosInsuficientesDaAcao,
        setModalState,
        acaoNaoAceitaTipoRecurso,
        setListaDemotivosPagamentoAntecipado,
        setSelectMotivosPagamentoAntecipado,
        setTxtOutrosMotivosPagamentoAntecipado,
        habilitaBtnSalvar,
        onSubmitRef,
    } = deps;

    const aux = metodosAuxiliares;

    const serviceSubmitModais = async (values, setFieldValue, errors, msg) => {
        if (msg === "saldo_insuficiente_conta_validado") {
            await verificaSeAcaoAceitaTipoDeRecurso(values, errors, setFieldValue);
        } else if (msg === "acao_nao_aceita_tipo_de_aplicacao_validado") {
            await verificaSaldoInsuficienteAcao(values, errors, setFieldValue);
        } else if (msg === "saldo_insuficiente_acao_validado") {
            await verificaSeDespesaJaDemonstrada(values, errors, setFieldValue);
        } else if (msg === "despesa_ja_demonstrada_validado") {
            await verificaSeDespesaJaCadastrada(values, errors, setFieldValue);
        } else if (msg === "despesa_ja_cadastrada_validado") {
            await validaMotivosPagamentoAntecipado(values, errors, setFieldValue);
        } else if (msg === "pagamento_antecipado_validado") {
            await verificaSeDespesaIncompleta(values, errors, setFieldValue);
        } else if (msg === "despesa_incompleta_validado" || msg === "impossivel_determinar") {
            setModalState("close");
            await onSubmitRef.current(values, setFieldValue);
        }
    };

    const verificaSaldoInsuficienteConta = async (values, errors, setFieldValue) => {
        validaPayloadDespesas(values);
        if (values.data_transacao) {
            let retorno_saldo = await aux.verificarSaldo(values, despesaContext);
            if (
                retorno_saldo.situacao_do_saldo === "saldo_conta_insuficiente" ||
                retorno_saldo.situacao_do_saldo === "lancamento_anterior_implantacao"
            ) {
                setSaldosInsuficientesDaConta(retorno_saldo);
                setModalState("saldo-insuficiente-conta");
            } else if (retorno_saldo.situacao_do_saldo === "impossivel_determinar") {
                await serviceSubmitModais(values, setFieldValue, errors, "impossivel_determinar");
            } else {
                await serviceSubmitModais(values, setFieldValue, errors, "saldo_insuficiente_conta_validado");
            }
        } else {
            await serviceSubmitModais(values, setFieldValue, errors, "saldo_insuficiente_conta_validado");
        }
    };

    const verificaSeAcaoAceitaTipoDeRecurso = async (values, errors, setFieldValue) => {
        let acoes = acaoNaoAceitaTipoRecurso(values);
        if (acoes.length > 0) {
            setModalState("acao-nao-aceita-tipo-de-aplicacao");
        } else {
            await serviceSubmitModais(values, setFieldValue, errors, "acao_nao_aceita_tipo_de_aplicacao_validado");
        }
    };

    const verificaSaldoInsuficienteAcao = async (values, errors, setFieldValue) => {
        validaPayloadDespesas(values);
        if (values.data_transacao) {
            let retorno_saldo = await aux.verificarSaldo(values, despesaContext);
            if (retorno_saldo.situacao_do_saldo === "saldo_insuficiente") {
                setSaldosInsuficientesDaAcao(retorno_saldo);
                setModalState("saldo-insuficiente-acao");
            } else {
                await serviceSubmitModais(values, setFieldValue, errors, "saldo_insuficiente_acao_validado");
            }
        } else {
            await serviceSubmitModais(values, setFieldValue, errors, "saldo_insuficiente_acao_validado");
        }
    };

    const verificaSeDespesaJaDemonstrada = async (values, errors, setFieldValue) => {
        validaPayloadDespesas(values);
        if (aux.origemAnaliseLancamento(parametroLocation)) {
            aux.mantemConciliacaoAtual(values);
            await serviceSubmitModais(values, setFieldValue, errors, "despesa_ja_demonstrada_validado");
        } else if (values.rateios.find((element) => element.conferido)) {
            setModalState("despesa-ja-demonstrada");
        } else {
            await serviceSubmitModais(values, setFieldValue, errors, "despesa_ja_demonstrada_validado");
        }
    };

    const verificaSeDespesaJaCadastrada = async (values, errors, setFieldValue) => {
        validaPayloadDespesas(values);
        if (values.tipo_documento && values.numero_documento && !values.uuid) {
            let despesa_cadastrada = await getDespesaCadastrada(
                values.tipo_documento,
                values.numero_documento,
                values.cpf_cnpj_fornecedor,
                despesaContext.idDespesa
            );
            if (despesa_cadastrada.despesa_ja_lancada) {
                setModalState("despesa-ja-cadastrada");
            } else {
                await serviceSubmitModais(values, setFieldValue, errors, "despesa_ja_cadastrada_validado");
            }
        } else {
            await serviceSubmitModais(values, setFieldValue, errors, "despesa_ja_cadastrada_validado");
        }
    };

    const validaMotivosPagamentoAntecipado = async (values, errors, setFieldValue) => {
        validaPayloadDespesas(values);
        let data_transacao = values.data_transacao;
        let data_documento = values.data_documento;
        if (data_transacao && data_documento) {
            if (data_transacao < data_documento) {
                let motivos = await getMotivosPagamentoAntecipado();
                setListaDemotivosPagamentoAntecipado(motivos);
                setSelectMotivosPagamentoAntecipado(despesaContext.initialValues.motivos_pagamento_antecipado);
                setTxtOutrosMotivosPagamentoAntecipado(despesaContext.initialValues.outros_motivos_pagamento_antecipado);
                setModalState("pagamento-antecipado");
            } else {
                await serviceSubmitModais(values, setFieldValue, errors, "pagamento_antecipado_validado");
            }
        } else {
            await serviceSubmitModais(values, setFieldValue, errors, "pagamento_antecipado_validado");
        }
    };

    const verificaSeDespesaIncompleta = async (values, errors, setFieldValue) => {
        values.despesa_incompleta = document.getElementsByClassName("despesa_incompleta").length;
        validaPayloadDespesas(values);
        if (values.despesa_incompleta > 0) {
            setModalState("despesa-imcompleta");
        } else {
            await serviceSubmitModais(values, setFieldValue, errors, "despesa_incompleta_validado");
        }
    };

    const serviceIniciaEncadeamentoDosModais = async (values, errors, setFieldValue) => {
        if (errors && errors.valor_recusos_acoes) {
            setExibeMsgErroValorRecursos(true);
        } else {
            setExibeMsgErroValorRecursos(false);
        }
        if (errors && errors.valor_original) {
            setExibeMsgErroValorOriginal(true);
        } else {
            setExibeMsgErroValorOriginal(false);
        }
        validaPayloadDespesas(values);
        if (Object.entries(errors).length === 0) {
            await verificaSaldoInsuficienteConta(values, errors, setFieldValue);
        } else {
            habilitaBtnSalvar();
        }
    };

    return {
        serviceIniciaEncadeamentoDosModais,
        serviceSubmitModais,
        validaMotivosPagamentoAntecipado,
    };
};
