import React, {Fragment} from "react";
import TabelaConferenciaDeLancamentos from "./TabelaConferenciaDeLancamentos";
import Loading from "../../../../../utils/Loading";
import {mantemEstadoAcompanhamentoDePc as meapcservice} from "../../../../../services/mantemEstadoAcompanhamentoDePc.service";

export const TabsConferenciaDeLancamentos = ({contasAssociacao, toggleBtnEscolheConta, clickBtnEscolheConta, carregaLancamentosParaConferencia, prestacaoDeContas, setLancamentosParaConferencia, lancamentosParaConferencia, contaUuid, loadingLancamentosParaConferencia, editavel, handleChangeCheckBoxOrdenarPorImposto, stateCheckBoxOrdenarPorImposto, setStateCheckBoxOrdenarPorImposto}) => {

    // Manter o estado do Acompanhamento de PC
    let dados_acompanhamento_de_pc_usuario_logado = meapcservice.getAcompanhamentoDePcUsuarioLogado()
    let filtrar_por_acao = dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_acao
    let filtrar_por_lancamento = dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_lancamento

    let filtrar_por_data_inicio = dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_data_inicio
    let filtrar_por_data_fim = dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_data_fim
    let filtrar_por_numero_de_documento = dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_numero_de_documento
    let filtrar_por_tipo_de_documento = dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_tipo_de_documento
    let filtrar_por_tipo_de_pagamento = dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_tipo_de_pagamento

    return (
        <>
            {loadingLancamentosParaConferencia ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) :
                <>
                    <nav>
                        <div className="nav nav-tabs mb-3 menu-interno-dre-prestacao-de-contas" id="nav-tab-conferencia-de-lancamentos" role="tablist">
                            {contasAssociacao.map((conta, index) =>
                                <Fragment key={`key_${conta.uuid}`}>
                                    <a
                                        onClick={() => {
                                            toggleBtnEscolheConta(conta.uuid);
                                            setStateCheckBoxOrdenarPorImposto(false)
                                            carregaLancamentosParaConferencia(prestacaoDeContas, conta.uuid, filtrar_por_acao, filtrar_por_lancamento, 0, false, filtrar_por_data_inicio, filtrar_por_data_fim, filtrar_por_numero_de_documento, filtrar_por_tipo_de_documento, filtrar_por_tipo_de_pagamento)

                                        }}
                                        className={`nav-link btn-escolhe-acao ${clickBtnEscolheConta === conta.uuid ? "btn-escolhe-acao-active" : ""}`}
                                        id={`nav-conferencia-de-lancamentos-${conta.uuid}-tab`}
                                        data-toggle="tab"
                                        href={`#nav-conferencia-de-lancamentos-${conta.uuid}`}
                                        role="tab"
                                        aria-controls={`nav-conferencia-de-lancamentos-${conta.uuid}`}
                                        aria-selected="true"
                                    >
                                        Conta {conta.tipo_conta.nome}
                                    </a>
                                </Fragment>
                            )}
                        </div>
                    </nav>

                    <div className="tab-content" id="nav-conferencia-de-lancamentos-tabContent">
                        <div
                            className="tab-pane fade show active"
                            role="tabpanel"
                        >
                            <TabelaConferenciaDeLancamentos
                                setLancamentosParaConferencia={setLancamentosParaConferencia}
                                lancamentosParaConferencia={lancamentosParaConferencia}
                                contaUuid={contaUuid}
                                carregaLancamentosParaConferencia={carregaLancamentosParaConferencia}
                                prestacaoDeContas={prestacaoDeContas}
                                editavel={editavel}
                                handleChangeCheckBoxOrdenarPorImposto={handleChangeCheckBoxOrdenarPorImposto}
                                stateCheckBoxOrdenarPorImposto={stateCheckBoxOrdenarPorImposto}
                                setStateCheckBoxOrdenarPorImposto={setStateCheckBoxOrdenarPorImposto}
                            />
                        </div>
                    </div>
                </>
            }
        </>
    )
}