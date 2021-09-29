import React, {Fragment, memo} from "react";

const TabsAcertosEmLancamentosPorConta = ({contasAssociacao, carregaAcertosLancamentos, children, setStateFiltros, initialStateFiltros, toggleBtnEscolheConta, clickBtnEscolheConta}) => {

    return(
        <>
            <nav>
            <div className="nav nav-tabs mb-3 tabs-resumo-dos-acertos" id="nav-tab-conferencia-de-lancamentos" role="tablist">
                {contasAssociacao && contasAssociacao && contasAssociacao.length > 0 && contasAssociacao.map((conta, index) =>
                    <Fragment key={`key_${conta.uuid}`}>
                        <a
                            onClick={() => {
                                carregaAcertosLancamentos(conta.uuid)
                                setStateFiltros(initialStateFiltros)
                                toggleBtnEscolheConta(`${index}`);
                            }}
                            className={`nav-link btn-escolhe-acao ${clickBtnEscolheConta[`${index}`] ? "active" : ""}`}
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
                <div className="tab-pane fade show active" role="tabpanel">
                    {children}
                </div>
            </div>

        </>
    )
}
export default memo(TabsAcertosEmLancamentosPorConta)