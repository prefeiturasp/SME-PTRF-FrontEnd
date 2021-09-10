import React, {Fragment} from "react";
import TabelaConferenciaDeLancamentos from "./TabelaConferenciaDeLancamentos";
import Loading from "../../../../../utils/Loading";

export const TabsConferenciaDeLancamentos = ({infoAta, toggleBtnEscolheConta, clickBtnEscolheConta, carregaLancamentosParaConferencia, prestacaoDeContas, setLancamentosParaConferencia, lancamentosParaConferencia, contaUuid, loadingLancamentosParaConferencia}) => {

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
                        <div className="nav nav-tabs mb-3 menu-interno-dre-prestacao-de-contas"
                             id="nav-tab-conferencia-de-lancamentos" role="tablist">
                            {infoAta && infoAta.contas && infoAta.contas.length > 0 && infoAta.contas.map((conta, index) =>
                                <Fragment key={`key_${conta.conta_associacao.uuid}`}>
                                    <a
                                        onClick={() => {
                                            toggleBtnEscolheConta(`key_${index}`);
                                            carregaLancamentosParaConferencia(prestacaoDeContas, conta.conta_associacao.uuid)
                                        }}
                                        className={`nav-link btn-escolhe-acao ${clickBtnEscolheConta[`key_${index}`] ? "btn-escolhe-acao-active" : ""}`}
                                        id={`nav-conferencia-de-lancamentos-${conta.conta_associacao.uuid}-tab`}
                                        data-toggle="tab"
                                        href={`#nav-conferencia-de-lancamentos-${conta.conta_associacao.uuid}`}
                                        role="tab"
                                        aria-controls={`nav-conferencia-de-lancamentos-${conta.conta_associacao.uuid}`}
                                        aria-selected="true"
                                    >
                                        Conta {conta.conta_associacao.nome}
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
                            />
                        </div>
                    </div>
                </>
            }

        </>
    )
}