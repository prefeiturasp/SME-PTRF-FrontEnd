import React, {memo, useState} from "react";
import { ModalPublicarRelatorioConsolidado, ModalPublicarRelatorioConsolidadoPendente } from "../../../utils/Modais";
import InfoPublicacaoNoDiarioOficial from "./MarcarPublicacaoNoDiarioOficial/InfoPublicacaoNoDiarioOficial";
import BotaoMarcarPublicacaoNoDiarioOficial from "./MarcarPublicacaoNoDiarioOficial/BotaoMarcarPublicacaoNoDiarioOficial";
import {Retificar} from "./Retificar";
import PreviaDocumentoRetificado from "./PreviaDocumentoRetificado";
import ReactTooltip from "react-tooltip";
import {visoesService} from "../../../services/visoes.service";

const PublicarDocumentos = ({publicarConsolidadoDre, podeGerarPrevia, children, consolidadoDre, carregaConsolidadosDreJaPublicadosProximaPublicacao, execucaoFinanceira, disableGerar, todasAsPcsDaRetificacaoConcluidas, publicarRetificacao, showPublicarRetificacao, setShowPublicarRetificacao, gerarPreviaRetificacao, removerBtnGerar=false, execucaoFinanceiraCarregando}) => {
    const [showPublicarRelatorioConsolidadoPendente, setShowPublicarRelatorioConsolidadoPendente] = useState(false)
    const [alertaJustificativa, setAlertaJustificativa] = useState(true)
    const [showPublicarRelatorioConsolidado, setShowPublicarRelatorioConsolidado] = useState(false)

    const comparaValores = (execucaoFinanceiraConta) => {
        if (execucaoFinanceiraConta) {
            return execucaoFinanceiraConta.repasses_previstos_sme_custeio !== execucaoFinanceiraConta.repasses_no_periodo_custeio ||
                execucaoFinanceiraConta.repasses_previstos_sme_capital !== execucaoFinanceiraConta.repasses_no_periodo_capital ||
                execucaoFinanceiraConta.repasses_previstos_sme_livre !== execucaoFinanceiraConta.repasses_no_periodo_livre ||
                execucaoFinanceiraConta.repasses_previstos_sme_total !== execucaoFinanceiraConta.repasses_no_periodo_total;
        }
    };

    const handleClick = () => {
        if(!consolidadoDre.eh_consolidado_de_publicacoes_parciais) {
            const isJustificativaTexto = execucaoFinanceira?.por_tipo_de_conta?.some((fisicoFinanceiro) => fisicoFinanceiro.justificativa_texto)
            if(isJustificativaTexto){
                setAlertaJustificativa(false);
                setShowPublicarRelatorioConsolidado(true)
            } else if (!execucaoFinanceira?.por_tipo_de_conta?.some((fisicoFinanceiro) => comparaValores(fisicoFinanceiro.valores))){
                setAlertaJustificativa(false)
                setShowPublicarRelatorioConsolidado(true)
            }
            else{
                setShowPublicarRelatorioConsolidadoPendente(true)
            } 
        }
    }

    return(
        <>
            <div className="d-flex bd-highlight align-items-center container-publicar-cabecalho text-dark rounded-top border font-weight-bold">
                <div className="p-2 flex-grow-1 bd-highlight fonte-16">
                    {consolidadoDre.titulo_relatorio}
                    <InfoPublicacaoNoDiarioOficial
                        consolidadoDre={consolidadoDre}
                        carregaConsolidadosDreJaPublicadosProximaPublicacao={carregaConsolidadosDreJaPublicadosProximaPublicacao}
                    />
                </div>

                {!consolidadoDre.ja_publicado && !consolidadoDre.eh_retificacao && !removerBtnGerar &&
                    (<>
                        {podeGerarPrevia() &&
                            <div className="p-2 bd-highlight">
                                {children}
                            </div>
                        }

                        {
                            consolidadoDre.habilita_botao_gerar ? (
                                <div className="p-2 bd-highlight">
                                    <button
                                        onClick={() => handleClick()}
                                        className="btn btn btn btn-success"
                                        disabled={disableGerar || !visoesService.getPermissoes(['gerar_relatorio_consolidado_dre'])}
                                    >
                                        Gerar
                                    </button>
                                </div>
                            ):

                            (!consolidadoDre.eh_consolidado_de_publicacoes_parciais &&
                                (<div className="p-2 bd-highlight font-weight-normal" data-html={true} data-tip={consolidadoDre.texto_tool_tip_botao_gerar}>
                                    <button
                                        onClick={() => setShowPublicarRelatorioConsolidado(true)}
                                        className="btn btn btn btn-success"
                                        disabled={true}
                                    >
                                        Gerar
                                    </button>
                                    <ReactTooltip html={true}/>
                                </div>)
                            )
                        }

                    </>)
                }
                <BotaoMarcarPublicacaoNoDiarioOficial
                    consolidadoDre={consolidadoDre}
                    carregaConsolidadosDreJaPublicadosProximaPublicacao={carregaConsolidadosDreJaPublicadosProximaPublicacao}
                />
                <PreviaDocumentoRetificado 
                    consolidadoDre={consolidadoDre} 
                    todasAsPcsDaRetificacaoConcluidas={todasAsPcsDaRetificacaoConcluidas} 
                    setShowPublicarRetificacao={setShowPublicarRetificacao}
                    showPublicarRetificacao={showPublicarRetificacao}  
                    publicarRetificacao={publicarRetificacao} 
                    gerarPreviaRetificacao={gerarPreviaRetificacao}
                    execucaoFinanceira={execucaoFinanceira}
                    execucaoFinanceiraCarregando={execucaoFinanceiraCarregando}
                />
                <Retificar
                    consolidadoDre={consolidadoDre}
                />
            </div>

            <section>
                <ModalPublicarRelatorioConsolidado
                    show={showPublicarRelatorioConsolidado}
                    handleClose={()=>setShowPublicarRelatorioConsolidado(false)}
                    alertaJustificativa={alertaJustificativa}
                    publicarConsolidadoDre={() => publicarConsolidadoDre(consolidadoDre, setShowPublicarRelatorioConsolidado)}
                />
                <ModalPublicarRelatorioConsolidadoPendente
                    show={showPublicarRelatorioConsolidadoPendente}
                    handleClose={()=>setShowPublicarRelatorioConsolidadoPendente(false)}
                />
            </section>
        </>
    )
}
export default memo(PublicarDocumentos)