import React, {useState, useCallback, useEffect} from "react";
import ReactTooltip from "react-tooltip";
import { ModalPublicarRetificacao } from "../../../utils/Modais";
import { ModalPublicarRetificacaoPendente } from "../../../utils/Modais";
import { visoesService } from "../../../services/visoes.service";
import { getExecucaoFinanceira } from "../../../services/dres/RelatorioConsolidado.service";


const PreviaDocumentoRetificado = ({consolidadoDre, todasAsPcsDaRetificacaoConcluidas, publicarRetificacao, showPublicarRetificacao, setShowPublicarRetificacao, periodoEscolhido}) => {
    const [showPublicarRetificacaoPendente, setShowPublicarRetificacaoPendente] = useState(false)
    const [execucaoFinanceiraRetificacao, setExecucaoFinanceiraRetificacao] = useState({});
    const [alertaJustificativaRetificacao, setAlertaJustificativaRetificacao] = useState(true)

    const carregaExecucaoFinanceiraRetificacao = useCallback(async () => {
        const dre_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid');

        if(periodoEscolhido && consolidadoDre && consolidadoDre.eh_retificacao){
            try {
                let execucao = await getExecucaoFinanceira(dre_uuid, periodoEscolhido, consolidadoDre.uuid);
                setExecucaoFinanceiraRetificacao(execucao)
            } catch (e) {
                console.log("Erro ao carregar execução financeira ", e)
            }
        }

    }, [periodoEscolhido, consolidadoDre])

    useEffect(() => {
        carregaExecucaoFinanceiraRetificacao()
    }, [carregaExecucaoFinanceiraRetificacao])

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
            const isJustificativaTexto = execucaoFinanceiraRetificacao?.por_tipo_de_conta?.some((fisicoFinanceiro) => fisicoFinanceiro.justificativa_texto)

            if(isJustificativaTexto){
                setAlertaJustificativaRetificacao(false);
                setShowPublicarRetificacao(true);
            } else if (!execucaoFinanceiraRetificacao?.por_tipo_de_conta?.some((fisicoFinanceiro) => comparaValores(fisicoFinanceiro.valores))){
                setAlertaJustificativaRetificacao(false);
                setShowPublicarRetificacao(true);
            }
            else{
                setShowPublicarRetificacaoPendente(true)
            } 
        }
    }

    return(
        <>
            {consolidadoDre && consolidadoDre.eh_retificacao &&
                <>
                    {!consolidadoDre.ja_publicado &&
                        <span data-html={true} data-tip={!todasAsPcsDaRetificacaoConcluidas(consolidadoDre) ? "A análise da(s) prestação(ões) de contas em retificação ainda não foi concluída." : ""}>
                            <button onClick={() => console.log('previas')} className="btn btn-outline-success" disabled={!todasAsPcsDaRetificacaoConcluidas(consolidadoDre)}>
                                Prévias
                            </button>
                        </span>
                    }

                    {consolidadoDre.habilita_botao_gerar &&

                        <div className="p-2 bd-highlight font-weight-normal" data-html={true}>
                            <span data-html={true} data-tip={!todasAsPcsDaRetificacaoConcluidas(consolidadoDre) ? "Os documentos ainda não podem ser gerados, pois se encontra em análise prestação(ões) de contas a ser(em) retificada(s)." : ""}>
                                <button
                                    onClick={() => handleClick()}
                                    className="btn btn btn btn-success"
                                    disabled={!todasAsPcsDaRetificacaoConcluidas(consolidadoDre)}
                                >
                                    Gerar
                                </button>
                                <ReactTooltip html={true}/>
                            </span>
                        </div>
                    }

                    <section>
                        <ModalPublicarRetificacao
                            show={showPublicarRetificacao}
                            handleClose={()=>setShowPublicarRetificacao(false)}
                            alertaJustificativa={alertaJustificativaRetificacao}
                            publicarRetificacao={() => publicarRetificacao(consolidadoDre)}
                        />

                        <ModalPublicarRetificacaoPendente
                            show={showPublicarRetificacaoPendente}
                            handleClose={()=>setShowPublicarRetificacaoPendente(false)}
                        />
                    </section>
                </>
            }
        </>
    )
}
export default PreviaDocumentoRetificado