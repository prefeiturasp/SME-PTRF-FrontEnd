import React, {Fragment} from "react";

export const TabsArquivosDeReferencia = (
    {
        infoAta,
        toggleBtnEscolheConta,
        exibeAtaPorConta,
        clickBtnEscolheConta,
        infoAtaPorConta,
        ...componentes
    }
) => {

    console.log("XXXXXXXXXXXXXX Componentes ",componentes)

    return (
        <>
            <hr className='mt-4 mb-3'/>
            <h4 className='mb-4'>Arquivos de referência</h4>
            <nav>
                <div className="nav nav-tabs mb-3 menu-interno" id="nav-tab" role="tablist">
                    {infoAta && infoAta.contas && infoAta.contas.length > 0 && infoAta.contas.map((conta, index) =>
                        <Fragment key={conta.conta_associacao.uuid}>
                            <a
                                onClick={() => {
                                    toggleBtnEscolheConta(index);
                                    exibeAtaPorConta(conta.conta_associacao.nome)
                                }}
                                className={`nav-link btn-escolhe-acao ${clickBtnEscolheConta[index] ? "btn-escolhe-acao-active" : ""}`}
                                id={`nav-${conta.conta_associacao.uuid}-tab`}
                                data-toggle="tab"
                                href={`#nav-${conta.conta_associacao.uuid}`}
                                role="tab"
                                aria-controls={`nav-${conta.conta_associacao.uuid}`}
                                aria-selected="true"
                            >
                                Conta {conta.conta_associacao.nome}
                            </a>
                        </Fragment>
                    )}
                </div>
            </nav>
            {infoAtaPorConta && infoAtaPorConta.conta_associacao && infoAtaPorConta.conta_associacao.uuid &&
                <div className="tab-content" id="nav-tabContent">
                    <div
                        className="tab-pane fade show active"
                        id={`nav-${infoAtaPorConta.conta_associacao.uuid}`}
                        role="tabpanel"
                        aria-labelledby={`nav-${infoAtaPorConta.conta_associacao.uuid}-tab`}
                    >
                        <>
                            {componentes.AnalisesDeContaDaPrestacao &&
                                <componentes.AnalisesDeContaDaPrestacao
                                    infoAta={infoAtaPorConta}
                                    analisesDeContaDaPrestacao={componentes.analisesDeContaDaPrestacao}
                                    handleChangeAnalisesDeContaDaPrestacao={componentes.handleChangeAnalisesDeContaDaPrestacao}
                                    getObjetoIndexAnalise={componentes.getObjetoIndexAnalise}
                                    editavel={componentes.editavel}
                                />
                            }
                            {componentes.ResumoFinanceiroTabelaTotais &&
                                <componentes.ResumoFinanceiroTabelaTotais
                                    infoAta={infoAtaPorConta}
                                    valorTemplate={componentes.valorTemplate}
                                />
                            }
                            {componentes.ResumoFinanceiroTabelaAcoes &&
                                <componentes.ResumoFinanceiroTabelaAcoes
                                    infoAta={infoAtaPorConta}
                                    valorTemplate={componentes.valorTemplate}
                                    toggleBtnTabelaAcoes={componentes.toggleBtnTabelaAcoes}
                                    clickBtnTabelaAcoes={componentes.clickBtnTabelaAcoes}
                                />
                            }
                        </>
                    </div>
                </div>
            }
        </>
    )
}