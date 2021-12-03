import React, {Fragment, memo} from "react";

const TabsAjustesEmValoresReprogramados = ({contasAssociacao, carregarAjustesValoresReprogramados, children, toggleBtnEscolheContaValoresReprogramados, clickBtnEscolheContaValoresReprogramados}) => {

    return(
        <>
            <nav>
                <div className="nav nav-tabs mb-3 tabs-resumo-dos-acertos" id="nav-tab-conferencia-de-valores-reprogramados" role="tablist">
                    {contasAssociacao && contasAssociacao && contasAssociacao.length > 0 && contasAssociacao.map((conta, index) =>
                        <Fragment key={`key_${conta.uuid}`}>
                            <a
                                onClick={() => {
                                    carregarAjustesValoresReprogramados(conta.uuid)
                                    toggleBtnEscolheContaValoresReprogramados(`${index}`);
                                }}
                                className={`nav-link btn-escolhe-acao ${clickBtnEscolheContaValoresReprogramados[`${index}`] ? "active" : ""}`}
                                id={`nav-conferencia-de-valores-reprogramados-${conta.uuid}-tab`}
                                data-toggle="tab"
                                href={`#nav-conferencia-de-valores-reprogramados-${conta.uuid}`}
                                role="tab"
                                aria-controls={`nav-conferencia-de-valores-reprogramados-${conta.uuid}`}
                                aria-selected="true"
                            >
                                Conta {conta.tipo_conta.nome}
                            </a>
                        </Fragment>
                    )}
                </div>
            </nav>
            <div className="tab-content" id="nav-conferencia-de-valores-reprogramados-tabContent">
                <div className="tab-pane fade show active" role="tabpanel">
                    {children}
                </div>
            </div>

        </>
    )
}
export default memo(TabsAjustesEmValoresReprogramados)