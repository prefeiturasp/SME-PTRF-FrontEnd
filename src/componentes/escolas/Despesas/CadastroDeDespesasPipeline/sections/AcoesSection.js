import React from "react";
import {useFormikContext} from "formik";
import {visoesService} from "../../../../../services/visoes.service";
import {ASSOCIACAO_UUID} from "../../../../../services/auth.service";
import {
    SaldoInsuficiente,
    SaldoInsuficienteConta,
    ChecarDespesaExistente,
    TipoAplicacaoRecursoNaoAceito,
    ExcluirImposto
} from "../../../../../utils/Modais";
import {ModalDespesaConferida} from "../modals/ModalDespesaJaConferida";
import {ModalDespesaIncompleta} from "../modals/ModalDespesaIncompleta";
import ModalMotivosPagamentoAntecipado from "../modals/ModalMotivosPagamentoAntecipado";
import * as Sentry from "@sentry/react";
import {
    useDespesaTabelasCtx,
    useDespesaUiCtx,
    useDespesaFluxoCtx,
} from "../context/DespesaFormPipelineContext";

export const AcoesSection = ({podeHabilitar}) => {
    const props = useFormikContext();
    const {values, setFieldValue, errors, resetForm} = props;

    const {
        despesaContext,
        aux,
        parametroLocation,
        veioDeSituacaoPatrimonial,
    } = useDespesaTabelasCtx();

    const {
        exibeMsgErroValorOriginal,
        exibeMsgErroValorRecursos,
        readOnlyBtnAcao,
        setShowDelete,
        setShowTextoModalDelete,
        btnSubmitDisable,
        desabilitaBtnSalvar,
        habilitaBtnSalvar,
        eh_despesa_reconhecida,
        setShowExcluirImposto,
        showExcluirImposto,
    } = useDespesaUiCtx();

    const {
        houveAlteracoes,
        onShowModal,
        onCancelarTrue,
        saldosInsuficientesDaAcao,
        saldosInsuficientesDaConta,
        mensagensAceitaCusteioCapital,
        cancelarExclusaoImposto,
        listaDemotivosPagamentoAntecipado,
        selectMotivosPagamentoAntecipado,
        setSelectMotivosPagamentoAntecipado,
        checkBoxOutrosMotivosPagamentoAntecipado,
        txtOutrosMotivosPagamentoAntecipado,
        handleChangeCheckBoxOutrosMotivosPagamentoAntecipado,
        handleChangeTxtOutrosMotivosPagamentoAntecipado,
        modalState,
        setModalState,
        serviceIniciaEncadeamentoDosModais,
        serviceSubmitModais,
    } = useDespesaFluxoCtx();

return (
        <>
                                <div className="d-flex  justify-content-end pb-3 mt-3">
                                    {!veioDeSituacaoPatrimonial && (
                                        <>
                                            <button data-qa={`cadastro-edicao-despesa-btn-voltar`}
                                                type="reset"
                                                onClick={houveAlteracoes(props.values) ? onShowModal : onCancelarTrue}
                                                className="btn btn btn-outline-success mt-2 mr-2"
                                            >
                                                Voltar
                                            </button>
                                            {aux.mostraBotaoDeletar(despesaContext.idDespesa, parametroLocation)
                                                ?
                                                <button
                                                    data-qa={`cadastro-edicao-despesa-btn-deletar`}
                                                    disabled={!podeHabilitar}
                                                    type="reset"
                                                    onClick={() => aux.onShowDeleteModal(setShowDelete, setShowTextoModalDelete, props.values)}
                                                    className="btn btn btn-danger mt-2 mr-2"
                                                >
                                                    Deletar
                                                </button>
                                                : null
                                            }
                                            {!aux.ehOperacaoExclusao(parametroLocation) &&
                                                <button
                                                    data-qa={`cadastro-edicao-despesa-btn-salvar`}
                                                    disabled={
                                                        eh_despesa_reconhecida(props.values) ? btnSubmitDisable || readOnlyBtnAcao || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !props.values.despesa_anterior_ao_uso_do_sistema_editavel
                                                            : !props.values.numero_boletim_de_ocorrencia || btnSubmitDisable || readOnlyBtnAcao || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !props.values.despesa_anterior_ao_uso_do_sistema_editavel
                                                    }
                                                    type="button"
                                                    onClick={async (e) => {
                                                        try {
                                                            desabilitaBtnSalvar();
                                                            await serviceIniciaEncadeamentoDosModais(props.values, props.errors, props.setFieldValue, {resetForm: props.resetForm});
                                                        } catch (err) {
                                                            Sentry.withScope((scope) => {
                                                                scope.setTag("tela", "edicao-de-despesa");
                                                            
                                                                scope.setContext("despesa", {
                                                                    uuid_despesa: despesaContext.idDespesa,
                                                                    associacao: localStorage.getItem(ASSOCIACAO_UUID),
                                                                    numero_documento: props?.values?.numero_documento,
                                                                });
                                                            
                                                                Sentry.captureException(err);
                                                            });
                                                            habilitaBtnSalvar(); 
                                                        }
                                                    }}
                                                    className="btn btn-success mt-2"
                                                >
                                                    Salvar
                                                </button>
                                            }
                                        </>
                                    )}
                                </div>
                                <div className="d-flex justify-content-end">
                                    <p>{errors.valor_recusos_acoes && exibeMsgErroValorRecursos && <span
                                        data-qa={`cadastro-edicao-despesa-msg-erro-valor-recursos`}
                                        className="span_erro text-danger mt-1"> {errors.valor_recusos_acoes}</span>}</p>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <p>{errors.valor_original && exibeMsgErroValorOriginal && <span
                                        data-qa={`cadastro-edicao-despesa-msg-erro-valor-original`}
                                        className="span_erro text-danger mt-1"> {errors.valor_original}</span>}</p>
                                </div>

                                <section>
                                    <SaldoInsuficienteConta
                                        saldosInsuficientesDaConta={saldosInsuficientesDaConta}
                                        show={modalState === 'saldo-insuficiente-conta'}
                                        handleClose={() => {
                                            setModalState("close");
                                            habilitaBtnSalvar();
                                        }}
                                        onSaldoInsuficienteContaTrue={() => {
                                            serviceSubmitModais(values, setFieldValue, errors, 'saldo_insuficiente_conta_validado')
                                        }}
                                    />
                                </section>

                                <section>
                                    <TipoAplicacaoRecursoNaoAceito
                                        mensagensAceitaCusteioCapital={mensagensAceitaCusteioCapital}
                                        show={modalState === 'acao-nao-aceita-tipo-de-aplicacao'}
                                        onSalvarTipoRecursoNaoAceito={() => {
                                            serviceSubmitModais(values, setFieldValue, errors, 'acao_nao_aceita_tipo_de_aplicacao_validado')
                                        }}
                                        handleClose={() => {
                                            setModalState("close");
                                            habilitaBtnSalvar();
                                        }}
                                    />
                                </section>

                                <section>
                                    <SaldoInsuficiente
                                        saldosInsuficientesDaAcao={saldosInsuficientesDaAcao}
                                        show={modalState === 'saldo-insuficiente-acao'}
                                        handleClose={() => {
                                            setModalState("close");
                                            habilitaBtnSalvar();
                                        }}
                                        onSaldoInsuficienteTrue={() => {
                                            serviceSubmitModais(values, setFieldValue, errors, 'saldo_insuficiente_acao_validado')
                                        }}
                                    />
                                </section>

                                <section>
                                    <ModalDespesaConferida
                                        show={modalState === 'despesa-ja-demonstrada'}
                                        handleClose={() => {
                                            setModalState("close");
                                            habilitaBtnSalvar();
                                        }}
                                        onSalvarDespesaConferida={() => {
                                            serviceSubmitModais(values, setFieldValue, errors, 'despesa_ja_demonstrada_validado')
                                        }}
                                        titulo="Despesa já demonstrada"
                                        texto="<p>Atenção. Essa despesa já foi demonstrada, caso a alteração seja gravada ela voltará a ser não demonstrada. Confirma a gravação?</p>"
                                    />
                                </section>

                                <section>
                                    <ChecarDespesaExistente
                                        show={modalState === 'despesa-ja-cadastrada'}
                                        handleClose={() => {
                                            setModalState("close");
                                            habilitaBtnSalvar();
                                        }}
                                        onSalvarDespesaCadastradaTrue={() => {
                                            serviceSubmitModais(values, setFieldValue, errors, 'despesa_ja_cadastrada_validado')
                                        }}
                                    />
                                </section>

                                <section>
                                    <ModalMotivosPagamentoAntecipado
                                        show={modalState === 'pagamento-antecipado'}
                                        handleClose={() => {
                                            setModalState("close");
                                            habilitaBtnSalvar();
                                        }}
                                        listaDemotivosPagamentoAntecipado={listaDemotivosPagamentoAntecipado}
                                        selectMotivosPagamentoAntecipado={selectMotivosPagamentoAntecipado}
                                        setSelectMotivosPagamentoAntecipado={setSelectMotivosPagamentoAntecipado}
                                        checkBoxOutrosMotivosPagamentoAntecipado={checkBoxOutrosMotivosPagamentoAntecipado}
                                        txtOutrosMotivosPagamentoAntecipado={txtOutrosMotivosPagamentoAntecipado}
                                        handleChangeCheckBoxOutrosMotivosPagamentoAntecipado={handleChangeCheckBoxOutrosMotivosPagamentoAntecipado}
                                        handleChangeTxtOutrosMotivosPagamentoAntecipado={handleChangeTxtOutrosMotivosPagamentoAntecipado}
                                        onSalvarMotivosAntecipadosTrue={() => {
                                            serviceSubmitModais(values, setFieldValue, errors, 'pagamento_antecipado_validado')
                                        }}
                                    />
                                </section>

                                <section>
                                    <ModalDespesaIncompleta
                                        show={modalState === 'despesa-imcompleta'}
                                        handleClose={() => {
                                            setModalState("close");
                                            habilitaBtnSalvar();
                                        }}
                                        onSalvarDespesaIncompleta={() => {
                                            serviceSubmitModais(values, setFieldValue, errors, 'despesa_incompleta_validado')
                                        }}
                                        titulo="Cadastro da despesa"
                                        texto="<p>O cadastro desta despesa está incompleto. Você deseja finalizá-lo agora?</p>"
                                    />
                                </section>

                                <section>
                                    <ExcluirImposto
                                        show={showExcluirImposto}
                                        cancelarExclusaoImposto={() => cancelarExclusaoImposto(setFieldValue)}
                                        handleClose={() => setShowExcluirImposto(false)}
                                    />
                                </section>

        </>
    );
};
