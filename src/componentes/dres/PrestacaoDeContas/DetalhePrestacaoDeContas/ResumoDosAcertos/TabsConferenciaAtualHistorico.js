import React, {memo, useEffect, useState, useCallback} from "react";
import DevolverParaAcertos from "./DevolverParaAcertos";
import { RelatorioDosAcertos } from "./RelatorioDosAcertos";
import ExibeAcertosEmLancamentosEDocumentosPorConta from "../../../../Globais/ExibeAcertosEmLancamentosEDocumentosPorConta";
import {MsgImgCentralizada} from "../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../assets/img/img-404.svg";
import CardsDevolucoesParaAcertoDaDre from "../../../../Globais/CardsDevolucoesParaAcertoDaDre";
import { RelatorioAposAcertos } from "../../../../Globais/ExibeAcertosEmLancamentosEDocumentosPorConta/RelatorioAposAcertos";
import { getAnalisePrestacaoConta } from "../../../../../services/dres/PrestacaoDeContas.service";
 
const TabsConferenciaAtualHistorico = ({
    dataLimiteDevolucao, 
    handleChangeDataLimiteDevolucao, 
    prestacao_conta_uuid, 
    analiseAtualUuid, 
    msgNaoExistemSolicitacoesDeAcerto = null, 
    totalAnalisesDePcDevolvidas, 
    setAnaliseAtualUuidComPCAnaliseAtualUuid, 
    setPrimeiraAnalisePcDevolvida, 
    setAnaliseAtualUuid, 
    editavel, 
    pcEmAnalise, 
    prestacaoDeContas, 
    limpaStorage,
    abaAtiva = "",
    setAbaAtiva = () => {},
    setAbaSelecionadaManualmente = () => {}
}) =>{
    const setPermitirTriggerOnclick = useCallback(() => {}, [])
    const [analisePC, setAnalisePC] = useState(false);
 
    const carregaAnalisePC = useCallback(async () =>{
        if (analiseAtualUuid){
            let analise_encontrada = await getAnalisePrestacaoConta(analiseAtualUuid);
            setAnalisePC(analise_encontrada);
            return analise_encontrada;
        }
 
    }, [analiseAtualUuid]);
 
    useEffect(() => {
        carregaAnalisePC();
 
    }, [carregaAnalisePC])
 
    return(
    <>
        <nav>
            <div className="nav nav-tabs mb-3 tabs-resumo-dos-acertos" id="nav-tab-conferencia-de-lancamentos" role="tablist">      
                { pcEmAnalise &&
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            setAbaSelecionadaManualmente(true);
                            setAbaAtiva("conferencia-atual");
                            setAnaliseAtualUuidComPCAnaliseAtualUuid();
                        }}
                        className={`nav-link btn-escolhe-acao ${abaAtiva === 'conferencia-atual' ? 'active' : ''}`}
                        id="nav-conferencia-atual-tab"
                        href="#"
                        role="tab"
                        aria-controls="nav-conferencia-atual"
                        aria-selected={abaAtiva === 'conferencia-atual' ? 'true' : 'false'}
                    >
                        Conferência atual
                    </a>
                }
                
                {totalAnalisesDePcDevolvidas > 0 &&
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            setAbaSelecionadaManualmente(true);
                            setAbaAtiva("historico");
                            setPrimeiraAnalisePcDevolvida();
                            limpaStorage()
                        }}
                        className={`nav-link btn-escolhe-acao ${abaAtiva === 'historico' ? 'active' : ''}`}
                        id="nav-historico-tab"
                        href="#"
                        role="tab"
                        aria-controls="nav-historico"
                        aria-selected={abaAtiva === 'historico' ? 'true' : 'false'}
                    >
                        Histórico
                    </a>
                }
            </div>
        </nav>
        
        <div className="tab-content" id="nav-tabContent">
            <div className={`tab-pane fade ${abaAtiva === 'conferencia-atual' ? 'show active' : ''}`} id="nav-conferencia-atual" role="tabpanel" aria-labelledby="nav-conferencia-atual-tab">
                {abaAtiva === 'conferencia-atual' && (msgNaoExistemSolicitacoesDeAcerto ? (
                    <MsgImgCentralizada
                        texto={msgNaoExistemSolicitacoesDeAcerto}
                        img={Img404}
                    />
                ):
                    <>
                        <DevolverParaAcertos
                            dataLimiteDevolucao={dataLimiteDevolucao}
                            handleChangeDataLimiteDevolucao={handleChangeDataLimiteDevolucao}
                            editavel={editavel}
                        />
                        <ExibeAcertosEmLancamentosEDocumentosPorConta
                            prestacaoDeContasUuid={prestacao_conta_uuid}
                            analiseAtualUuid={analiseAtualUuid}
                            editavel={editavel}
                        />
    
                        <RelatorioDosAcertos
                            prestacaoDeContasUuid={prestacao_conta_uuid}
                            analiseAtualUuid={analiseAtualUuid}
                            podeGerarPrevia={true}
                        />
                    </>
                )}
            </div>

            <div className={`tab-pane fade ${abaAtiva === 'historico' ? 'show active' : ''}`} id="nav-historico" role="tabpanel" aria-labelledby="nav-historico-tab">
                {abaAtiva === 'historico' && (
                    <>
                        <CardsDevolucoesParaAcertoDaDre
                            prestacao_conta_uuid={prestacao_conta_uuid}
                            setAnaliseAtualUuid={setAnaliseAtualUuid}
                            analiseAtualUuid={analiseAtualUuid}
                            setPermitirTriggerOnclick={setPermitirTriggerOnclick}
                        />
 
                        <ExibeAcertosEmLancamentosEDocumentosPorConta
                            prestacaoDeContasUuid={prestacao_conta_uuid}
                            analiseAtualUuid={analiseAtualUuid}
                            editavel={editavel}
                        />
 
                        <RelatorioDosAcertos
                            prestacaoDeContasUuid={prestacao_conta_uuid}
                            analiseAtualUuid={analiseAtualUuid}
                            podeGerarPrevia={false}
                        />
                        {analisePC && analisePC.versao_pdf_apresentacao_apos_acertos === 'FINAL' &&
                            <RelatorioAposAcertos
                                prestacaoDeContasUuid={prestacao_conta_uuid}
                                prestacaoDeContas={prestacaoDeContas}
                                analiseAtualUuid={analiseAtualUuid}
                                podeGerarPrevia={false}
                            />
                        }
                    </>
                )}
            </div>
        </div>
    </>
    )
}

export default memo(TabsConferenciaAtualHistorico)