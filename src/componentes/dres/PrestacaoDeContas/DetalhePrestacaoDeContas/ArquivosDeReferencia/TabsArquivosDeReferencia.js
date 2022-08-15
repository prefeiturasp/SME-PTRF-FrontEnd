import React, {Fragment} from "react";
import {TabsArquivosDeReferenciaAccordion} from "./TabsArquivosDeReferenciaAccordion";
import {ResumoFinanceiroTabelaAcoes} from "../ResumoFinanceiroTabelaAcoes";
import {AnalisesDeContaDaPrestacao} from "../AnalisesDeContaDaPrestacao";
import {ResumoFinanceiroTabelaTotais} from "../ResumoFinanceiroTabelaTotais";
import Loading from "../../../../../utils/Loading";
import ArquivosDeReferenciaVisualizacaoDownload from "./ArquivosDeReferenciaVisualizacaoDownload";

export const TabsArquivosDeReferencia = ({valoresReprogramadosAjustes, setValoresReprogramadosAjustes, prestacaoDeContas, infoAta, toggleBtnEscolheConta, exibeAtaPorConta, clickBtnEscolheConta, infoAtaPorConta, adicaoAjusteSaldo, setAdicaoAjusteSaldo, onClickAdicionarAcertoSaldo, onClickDescartarAcerto, formErrosAjusteSaldo, validaAjustesSaldo, handleOnKeyDownAjusteSaldo, onClickSalvarAcertoSaldo, ajusteSaldoSalvoComSucesso, onClickDeletarAcertoSaldo, ...rest}) => {

    return (
        <>
            <hr className='mt-4 mb-3'/>
            <h4 className='mb-3'>Materiais de referência</h4>
            
            <nav>
                <div className="nav nav-tabs mb-3 menu-interno-dre-prestacao-de-contas" id="nav-tab" role="tablist">
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
            {infoAtaPorConta && infoAtaPorConta.conta_associacao && infoAtaPorConta.conta_associacao.uuid ? (
                    <div className="tab-content" id="nav-tabContent">
                        <div
                            className="tab-pane fade show active"
                            id={`nav-${infoAtaPorConta.conta_associacao.uuid}`}
                            role="tabpanel"
                            aria-labelledby={`nav-${infoAtaPorConta.conta_associacao.uuid}-tab`}
                        >
                            <>
                                <TabsArquivosDeReferenciaAccordion
                                    titulo='Síntese do período de realização da despesa'
                                    name='sintese_por_realizacao_da_despesa'
                                >
                                    <AnalisesDeContaDaPrestacao
                                        infoAta={infoAtaPorConta}
                                        analisesDeContaDaPrestacao={rest.analisesDeContaDaPrestacao}
                                        handleChangeAnalisesDeContaDaPrestacao={rest.handleChangeAnalisesDeContaDaPrestacao}
                                        getObjetoIndexAnalise={rest.getObjetoIndexAnalise}
                                        editavel={rest.editavel}
                                        prestacaoDeContas={prestacaoDeContas}
                                        adicaoAjusteSaldo={adicaoAjusteSaldo}
                                        setAdicaoAjusteSaldo={setAdicaoAjusteSaldo}
                                        onClickAdicionarAcertoSaldo={onClickAdicionarAcertoSaldo}
                                        onClickDescartarAcerto={onClickDescartarAcerto}
                                        formErrosAjusteSaldo={formErrosAjusteSaldo}
                                        validaAjustesSaldo={validaAjustesSaldo}
                                        handleOnKeyDownAjusteSaldo={handleOnKeyDownAjusteSaldo}
                                        onClickSalvarAcertoSaldo={onClickSalvarAcertoSaldo}
                                        ajusteSaldoSalvoComSucesso={ajusteSaldoSalvoComSucesso}
                                        onClickDeletarAcertoSaldo={onClickDeletarAcertoSaldo}
                                    />
                                    <ResumoFinanceiroTabelaTotais
                                        infoAta={infoAtaPorConta}
                                        valorTemplate={rest.valorTemplate}
                                    />

                                </TabsArquivosDeReferenciaAccordion>

                                <TabsArquivosDeReferenciaAccordion
                                    titulo='Síntese do período por ação'
                                    name='sintese_por_acao'
                                >

                                    <ResumoFinanceiroTabelaAcoes
                                        infoAta={infoAtaPorConta}
                                        valorTemplate={rest.valorTemplate}
                                        toggleBtnTabelaAcoes={rest.toggleBtnTabelaAcoes}
                                        clickBtnTabelaAcoes={rest.clickBtnTabelaAcoes}
                                        prestacaoDeContas={prestacaoDeContas}
                                    />

                                </TabsArquivosDeReferenciaAccordion>

                                <ArquivosDeReferenciaVisualizacaoDownload
                                    prestacaoDeContas={prestacaoDeContas}
                                    infoAta={infoAtaPorConta}
                                />
                            </>
                        </div>
                    </div>
                ) :
                <Loading
                    corGrafico="black"
                    corFonte="dark"
                    marginTop="0"
                    marginBottom="0"
                />

            }
        </>
    )
}