import {useRef} from "react";
import {getErrorMessage} from "../../../../../utils/obtemMsgErroAxios";
import {toastCustom} from "../../../../Globais/ToastCustom";
import {
    validaPayloadDespesas,
    metodosAuxiliares,
} from "../utils";

/**
 * Persistência da despesa (API create/update).
 *
 * Fluxo normal e acerto usam o mesmo caminho (mutationCreate / mutationUpdate).
 * Acerto create envia uuid_solicitacao_acerto no payload; REG-029/031 rodam no back.
 */
export const useDespesaSubmit = (deps) => {
    const {
        despesaContext,
        parametroLocation,
        despesasTabelas,
        enviarFormulario,
        setFormErrors,
        habilitaBtnSalvar,
        mutationCreate,
        mutationUpdate,
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
        // null = resposta stale de validação concorrente; não segue o save.
        if (erros_personalizados == null) {
            habilitaBtnSalvar();
            return;
        }
        setFormErrors(erros_personalizados);

        if (enviarFormulario && !existeErrosPersonalizadosComMensagem(erros_personalizados)) {
            validaPayloadDespesas(values, despesasTabelas, parametroLocation);

            values.motivos_pagamento_antecipado = montaPayloadMotivosPagamentoAntecipado();
            values.outros_motivos_pagamento_antecipado =
                txtOutrosMotivosPagamentoAntecipado.trim() && checkBoxOutrosMotivosPagamentoAntecipado
                    ? txtOutrosMotivosPagamentoAntecipado
                    : "";

            if (aux.origemAnaliseLancamento(parametroLocation)) {
                const uuidAcerto =
                    parametroLocation.state?.uuid_acerto_documento
                    || parametroLocation.state?.uuid_solicitacao_acerto;
                if (uuidAcerto) {
                    values.uuid_solicitacao_acerto = uuidAcerto;
                }
            }

            if (despesaContext.verboHttp === "POST") {
                mutationCreate.mutate({payload: values});
            } else if (despesaContext.verboHttp === "PUT") {
                mutationUpdate.mutate({payload: values, idDespesa: despesaContext.idDespesa});
            }
        } else {
            habilitaBtnSalvar();
        }
    };

    onSubmitRef.current = onSubmit;

    return {onSubmit, onSubmitRef, handleErroCriarDespesa};
};
