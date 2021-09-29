import React, {memo} from "react";
import DevolverParaAcertos from "./DevolverParaAcertos";
import ExibeAcertosEmLancamentosEDocumentosPorConta from "../../../../Globais/ExibeAcertosEmLancamentosEDocumentosPorConta";
import {MsgImgCentralizada} from "../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../assets/img/img-404.svg";
import CardsDevolucoesParaAcertoDaDre from "../../../../Globais/CardsDevolucoesParaAcertoDaDre";

const TabsConferenciaAtualHistorico = ({dataLimiteDevolucao, handleChangeDataLimiteDevolucao, prestacao_conta_uuid, analiseAtualUuid, exibeMsg, textoMsg, totalAnalisesDePcDevolvidas, setAnaliseAtualUuidComPCAnaliseAtualUuid, setPrimeiraAnalisePcDevolvida, setAnaliseAtualUuid}) =>{

    return(
        <>
            <nav>
                <div className="nav nav-tabs mb-3 tabs-resumo-dos-acertos" id="nav-tab-conferencia-de-lancamentos" role="tablist">
                    <a onClick={setAnaliseAtualUuidComPCAnaliseAtualUuid} className="nav-link btn-escolhe-acao active" id="nav-conferencia-atual-tab" data-toggle="tab" href="#nav-conferencia-atual" role="tab" aria-controls="nav-conferencia-atual" aria-selected="true">Conferência atual</a>
                    {totalAnalisesDePcDevolvidas > 0 &&
                        <a onClick={setPrimeiraAnalisePcDevolvida} className="nav-link btn-escolhe-acao" id="nav-historico-tab" data-toggle="tab" href="#nav-historico" role="tab" aria-controls="nav-historico" aria-selected="false">Histórico</a>
                    }
                </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
                <div className="tab-pane fade show active" id="nav-conferencia-atual" role="tabpanel" aria-labelledby="nav-conferencia-atual-tab">
                    {exibeMsg ? (
                            <MsgImgCentralizada
                                texto={textoMsg}
                                img={Img404}
                            />
                    ):
                        <>
                            <DevolverParaAcertos
                                dataLimiteDevolucao={dataLimiteDevolucao}
                                handleChangeDataLimiteDevolucao={handleChangeDataLimiteDevolucao}
                            />
                            <ExibeAcertosEmLancamentosEDocumentosPorConta
                                prestacaoDeContasUuid={prestacao_conta_uuid}
                                analiseAtualUuid={analiseAtualUuid}
                            />
                        </>
                    }
                </div>
                <div className="tab-pane fade" id="nav-historico" role="tabpanel" aria-labelledby="nav-historico-tab">
                    <>
                        <CardsDevolucoesParaAcertoDaDre
                            prestacao_conta_uuid={prestacao_conta_uuid}
                            setAnaliseAtualUuid={setAnaliseAtualUuid}
                            analiseAtualUuid={analiseAtualUuid}
                        />

                        <ExibeAcertosEmLancamentosEDocumentosPorConta
                            prestacaoDeContasUuid={prestacao_conta_uuid}
                            analiseAtualUuid={analiseAtualUuid}
                        />
                    </>

                </div>
            </div>
        </>
    )
}
export default memo(TabsConferenciaAtualHistorico)