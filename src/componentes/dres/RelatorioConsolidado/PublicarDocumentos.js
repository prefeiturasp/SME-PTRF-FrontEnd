import React, {memo} from "react";
import { ModalPublicarRelatorioConsolidado } from "../../../utils/Modais";
import InfoPublicacaoNoDiarioOficial from "./MarcarPublicacaoNoDiarioOficial/InfoPublicacaoNoDiarioOficial";
import BotaoMarcarPublicacaoNoDiarioOficial
    from "./MarcarPublicacaoNoDiarioOficial/BotaoMarcarPublicacaoNoDiarioOficial";
import {Retificar} from "./Retificar";
import ReactTooltip from "react-tooltip";

const PublicarDocumentos = ({publicarConsolidadoDre, podeGerarPrevia, children, consolidadoDre, publicarConsolidadoDePublicacoesParciais, showPublicarRelatorioConsolidado, setShowPublicarRelatorioConsolidado, carregaConsolidadosDreJaPublicadosProximaPublicacao}) => {

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

                {!consolidadoDre.ja_publicado &&
                    <>
                        {podeGerarPrevia() &&
                            <div className="p-2 bd-highlight">
                                {children}
                            </div>
                        }

                        {consolidadoDre.habilita_botao_gerar ? (
                            <div className="p-2 bd-highlight">
                                <button
                                    onClick={!consolidadoDre.eh_consolidado_de_publicacoes_parciais ? () => setShowPublicarRelatorioConsolidado(true) : ()=>publicarConsolidadoDePublicacoesParciais()}
                                    className="btn btn btn btn-success"
                                >
                                    Gerar
                                </button>
                            </div>
                        ):

                            <div className="p-2 bd-highlight font-weight-normal" data-html={true} data-tip={consolidadoDre.texto_tool_tip_botao_gerar}>
                                <button
                                    onClick={!consolidadoDre.eh_consolidado_de_publicacoes_parciais ? () => setShowPublicarRelatorioConsolidado(true) : ()=>publicarConsolidadoDePublicacoesParciais()}
                                    className="btn btn btn btn-success"
                                    disabled={true}
                                >
                                    Gerar
                                </button>
                                <ReactTooltip html={true}/>
                            </div>
                        }


                    </>
                }
                <BotaoMarcarPublicacaoNoDiarioOficial
                    consolidadoDre={consolidadoDre}
                    carregaConsolidadosDreJaPublicadosProximaPublicacao={carregaConsolidadosDreJaPublicadosProximaPublicacao}
                />
                <Retificar
                    consolidadoDre={consolidadoDre}
                />
            </div>

            <section>
                <ModalPublicarRelatorioConsolidado
                    show={showPublicarRelatorioConsolidado}
                    handleClose={()=>setShowPublicarRelatorioConsolidado(false)}
                    publicarConsolidadoDre={() => publicarConsolidadoDre(consolidadoDre)}
                />
            </section>
        </>
    )
}
export default memo(PublicarDocumentos)