import React, {Fragment} from "react";

export const TabsArquivosDeReferencia = ({
                                             infoAta,
                                             toggleBtnEscolheConta,
                                             exibeAtaPorConta,
                                             clickBtnEscolheConta,
                                             infoAtaPorConta,
                                             AnalisesDeContaDaPrestacao,
                                             analisesDeContaDaPrestacao,
                                             handleChangeAnalisesDeContaDaPrestacao,
                                             getObjetoIndexAnalise,
                                             editavel,
                                             ResumoFinanceiroTabelaTotais,
                                             valorTemplate,
                                             ResumoFinanceiroTabelaAcoes,
                                             toggleBtnTabelaAcoes,
                                             clickBtnTabelaAcoes,
                                         }) => {
    return (
        <>
            <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    {infoAta && infoAta.contas && infoAta.contas.length > 0 && infoAta.contas.map((conta, index) =>
                        <Fragment key={conta.conta_associacao.uuid}>
                            <a
                                onClick={() => {
                                    toggleBtnEscolheConta(index);
                                    exibeAtaPorConta(conta.conta_associacao.nome)
                                }}
                                className={`nav-link btn-escolhe-acao mr-3 ${clickBtnEscolheConta[index] ? "btn-escolhe-acao-active" : ""}`}
                                id={`nav-${conta.conta_associacao.uuid}-tab`}
                                data-toggle="tab"
                                href={`#nav-${conta.conta_associacao.uuid}`}
                                role="tab"
                                aria-controls="nav-home"
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
                        OLLYVER {infoAtaPorConta.conta_associacao.nome}
                        <AnalisesDeContaDaPrestacao
                            infoAta={infoAtaPorConta}
                            analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                            handleChangeAnalisesDeContaDaPrestacao={handleChangeAnalisesDeContaDaPrestacao}
                            getObjetoIndexAnalise={getObjetoIndexAnalise}
                            editavel={editavel}
                        />
                        <ResumoFinanceiroTabelaTotais
                            infoAta={infoAtaPorConta}
                            valorTemplate={valorTemplate}
                        />
                        <ResumoFinanceiroTabelaAcoes
                            infoAta={infoAtaPorConta}
                            valorTemplate={valorTemplate}
                            toggleBtnTabelaAcoes={toggleBtnTabelaAcoes}
                            clickBtnTabelaAcoes={clickBtnTabelaAcoes}
                        />
                    </>
                </div>
            </div>
            }
        </>
    )
}