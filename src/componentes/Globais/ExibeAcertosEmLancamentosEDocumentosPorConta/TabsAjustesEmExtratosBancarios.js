import React, {Fragment, memo} from "react";

const TabsAjustesEmExtratosBancarios = ({contasAssociacao, carregarAjustesExtratosBancarios, children, toggleBtnEscolheContaExtratoBancario, clickBtnEscolheContaExtratoBancario}) => {

    return(
        <>
            <nav>
                <div className="nav nav-tabs mb-3 tabs-resumo-dos-acertos" id="nav-tab-conferencia-de-extratos-bancarios" role="tablist">
                    {contasAssociacao && contasAssociacao && contasAssociacao.length > 0 && contasAssociacao.map((conta, index) =>
                        <Fragment key={`key_${conta.uuid}`}>
                            <a
                                onClick={() => {
                                    carregarAjustesExtratosBancarios(conta.uuid)
                                    toggleBtnEscolheContaExtratoBancario(`${index}`);
                                }}
                                className={`nav-link btn-escolhe-acao ${clickBtnEscolheContaExtratoBancario[`${index}`] ? "active" : ""}`}
                                id={`nav-conferencia-de-extratos-bancarios-${conta.uuid}-tab`}
                                data-toggle="tab"
                                href={`#nav-conferencia-de-extratos-bancarios-${conta.uuid}`}
                                role="tab"
                                aria-controls={`nav-conferencia-de-extratos-bancarios-${conta.uuid}`}
                                aria-selected="true"
                            >
                                Conta {conta.tipo_conta.nome}
                            </a>
                        </Fragment>
                    )}
                </div>
            </nav>
            <div className="tab-content" id="nav-conferencia-de-extratos-bancarios-tabContent">
                <div className="tab-pane fade show active" role="tabpanel">
                    {children}
                </div>
            </div>

        </>
    )
}
export default memo(TabsAjustesEmExtratosBancarios)