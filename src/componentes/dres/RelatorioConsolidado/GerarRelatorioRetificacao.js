import React, { useState } from 'react';
import ReactTooltip from "react-tooltip"
import { ModalPublicarRelatorioConsolidado, ModalPublicarRelatorioConsolidadoPendente } from "../../../utils/Modais";
import BotaoMarcarPublicacaoNoDiarioOficial from './MarcarPublicacaoNoDiarioOficial/BotaoMarcarPublicacaoNoDiarioOficial';
import InfoRefiticacaoRelatorio from "./BlocoRetificacao/InfoRefiticacaoRelatorio";
import {Retificar} from './Retificar';
import {visoesService} from "../../../services/visoes.service";

const GerarRelatorioRetificado = (publicarConsolidadoDre, podeGerarPrevia, children, consolidadoDre, execucaoFinanceira, disableGerar, setShowPublicarRelatorioConsolidado, publicarConsolidadoDePublicacoesParciais, carregaConsolidadosDreJaPublicadosProximaPublicacao, showPublicarRelatorioConsolidado) => {
    const [showPublicarRelatorioConsolidadoPendente, setShowPublicarRelatorioConsolidadoPendente] = useState(false)
    const [alertaJustificativa, setAlertaJustificativa] = useState(true)

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
                setShowPublicarRelatorioConsolidado(true)
            } else if (!execucaoFinanceira?.por_tipo_de_conta?.some((fisicoFinanceiro) => comparaValores(fisicoFinanceiro.valores))){
                setAlertaJustificativa(false)
                setShowPublicarRelatorioConsolidado(true)
            }
            else{
                setShowPublicarRelatorioConsolidadoPendente(true)
            } 
        }
        else {
            publicarConsolidadoDePublicacoesParciais()
        }
    }


    return (
        <>
            <div className="d-flex bd-highlight align-items-center container-publicar-cabecalho text-dark rounded-top border font-weight-bold">
                <div className="p-2 flex-grow-1 bd-highlight fonte-16">
                    {consolidadoDre?.titulo_relatorio}
                    <InfoRefiticacaoRelatorio
                        consolidadoDre={consolidadoDre}
                    />
                </div>

                {!consolidadoDre?.ja_publicado &&
                    <>
                        {podeGerarPrevia &&
                            <div className="p-2 bd-highlight">
                                {children}
                            </div>
                        }

                        {consolidadoDre?.habilita_botao_gerar ? (
                            <div className="p-2 bd-highlight">
                                <button
                                    onClick={handleClick}
                                    className="btn btn btn btn-success"
                                    disabled={disableGerar || !visoesService.getPermissoes(['gerar_relatorio_consolidado_dre'])}
                                >
                                    Gerar aa
                                </button>
                            </div>
                        ):

                            <div className="p-2 bd-highlight font-weight-normal" data-html={true} data-tip={consolidadoDre?.texto_tool_tip_botao_gerar}>
                                <button
                                    onClick={!consolidadoDre?.eh_consolidado_de_publicacoes_parciais ? () => setShowPublicarRelatorioConsolidado(true) : ()=>publicarConsolidadoDePublicacoesParciais()}
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
                    alertaJustificativa={alertaJustificativa}
                    publicarConsolidadoDre={() => publicarConsolidadoDre(consolidadoDre)}
                />
                <ModalPublicarRelatorioConsolidadoPendente
                    show={showPublicarRelatorioConsolidadoPendente}
                    handleClose={()=>setShowPublicarRelatorioConsolidadoPendente(false)}
                />
            </section>
        </>
    )
}

export default GerarRelatorioRetificado;