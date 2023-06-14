import React, {useState,  memo} from "react";
import ReactTooltip from "react-tooltip";
import { ModalPublicarRetificacao } from "../../../utils/Modais";
import { ModalPublicarRetificacaoPendente } from "../../../utils/Modais";
import {postCriarAtaAtrelarAoConsolidadoDre} from "../../../services/dres/RelatorioConsolidado.service";
import { Button } from 'antd';
import {visoesService} from "../../../services/visoes.service";


const PreviaDocumentoRetificado = ({consolidadoDre, todasAsPcsDaRetificacaoConcluidas, publicarRetificacao, gerarPreviaRetificacao, execucaoFinanceira, execucaoFinanceiraCarregando}) => {
    const [showPublicarRetificacaoPendente, setShowPublicarRetificacaoPendente] = useState(false)
    const [showPublicarRetificacao, setShowPublicarRetificacao] = useState(false)
    const [alertaJustificativaRetificacao, setAlertaJustificativaRetificacao] = useState(true)

    const [adicionarSecaoJustificativaNoModal, setAdicionaSecaoJustificativaNoModal] = useState(false);
    const [adicionarSecaoMotivoRetificacaoNoModal, setAdicionaSecaoMotivoRetificacaoNoModal] = useState(false);

    const comparaValores = (execucaoFinanceiraConta) => {
        if (execucaoFinanceiraConta) {
            return execucaoFinanceiraConta.repasses_previstos_sme_custeio !== execucaoFinanceiraConta.repasses_no_periodo_custeio ||
                execucaoFinanceiraConta.repasses_previstos_sme_capital !== execucaoFinanceiraConta.repasses_no_periodo_capital ||
                execucaoFinanceiraConta.repasses_previstos_sme_livre !== execucaoFinanceiraConta.repasses_no_periodo_livre ||
                execucaoFinanceiraConta.repasses_previstos_sme_total !== execucaoFinanceiraConta.repasses_no_periodo_total;
        }
    };

    const handleClick = () => { 
        if(!consolidadoDre.eh_consolidado_de_publicacoes_parciais && !execucaoFinanceiraCarregando) {
            const temDiferencaDeValores = execucaoFinanceira?.por_tipo_de_conta?.some((fisicoFinanceiro) => comparaValores(fisicoFinanceiro.valores));

            const justificativaPreenchida = execucaoFinanceira?.por_tipo_de_conta?.some((fisicoFinanceiro) => fisicoFinanceiro.justificativa_texto);

            const motivoRetificacaoPreenchido = consolidadoDre.motivo_retificacao;

            if((!temDiferencaDeValores || justificativaPreenchida) && motivoRetificacaoPreenchido) {
                setAlertaJustificativaRetificacao(false);
                return setShowPublicarRetificacao(true);
            }

            if(!motivoRetificacaoPreenchido) {
                setAdicionaSecaoMotivoRetificacaoNoModal(true);
            }

            if(temDiferencaDeValores && !justificativaPreenchida) {
                setAdicionaSecaoJustificativaNoModal(true); 
            }

            return setShowPublicarRetificacaoPendente(true);
        }
    }

    const criarAtaAtrelarAoConsolidado = async() => {
        let payload = {
            dre: consolidadoDre.dre_uuid,
            periodo: consolidadoDre.periodo_uuid,
            consolidado: consolidadoDre.uuid,
        }
        try {
            let ata = await postCriarAtaAtrelarAoConsolidadoDre(payload)
            return window.location.assign(`/edicao-da-ata-parecer-tecnico/${ata.uuid}`)
        }catch (e) {
            console.log("Erro ao criar a Ata - criarAtaAtrelarAoConsolidado", e)
        }
    }

    const redirecionaPreenchimentoPendencias = (pendenciaSelecionada) => {
        if(pendenciaSelecionada === 'justificacao') {
            return window.location.assign(`/dre-relatorio-consolidado-em-tela/${consolidadoDre.periodo_uuid}/${consolidadoDre.ja_publicado}/${consolidadoDre.uuid}`)
        }

        if(pendenciaSelecionada === 'motivo' && consolidadoDre.ata_de_parecer_tecnico && consolidadoDre.ata_de_parecer_tecnico.uuid) {
            return window.location.assign(`/edicao-da-ata-parecer-tecnico/${consolidadoDre.ata_de_parecer_tecnico.uuid}/`)
        } else if(pendenciaSelecionada === 'motivo') {
            return criarAtaAtrelarAoConsolidado();
        }
    }

    return(
        <>
            {consolidadoDre && consolidadoDre.eh_retificacao &&
                <>
                    {!consolidadoDre.ja_publicado &&
                        <span data-html={true} data-tip={!todasAsPcsDaRetificacaoConcluidas(consolidadoDre) ? "A análise da(s) prestação(ões) de contas em retificação ainda não foi concluída." : ""}>
                            <button
                                onClick={() => gerarPreviaRetificacao(consolidadoDre)}
                                className="btn btn-outline-success"
                                disabled={!todasAsPcsDaRetificacaoConcluidas(consolidadoDre) || !visoesService.getPermissoes(['gerar_relatorio_consolidado_dre'])}
                            >
                                Prévias
                            </button>
                        </span>
                    }

                    {consolidadoDre.habilita_botao_gerar &&

                        <div className="p-2 bd-highlight font-weight-normal" data-html={true}>
                            <span data-html={true} data-tip={!todasAsPcsDaRetificacaoConcluidas(consolidadoDre) ? "Os documentos ainda não podem ser gerados, pois se encontra em análise prestação(ões) de contas a ser(em) retificada(s)." : ""}>
                                <Button
                                    className="btn btn btn btn-success botao-carregar"
                                    type="primary"
                                    size="large"
                                    loading={execucaoFinanceiraCarregando}
                                    disabled={!todasAsPcsDaRetificacaoConcluidas(consolidadoDre) || !visoesService.getPermissoes(['gerar_relatorio_consolidado_dre'])}
                                    onClick={() => handleClick()}
                                >
                                    Gerar
                                </Button>
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
                            secaoMotivoRetificacao={adicionarSecaoMotivoRetificacaoNoModal}
                            secaoJustificativa={adicionarSecaoJustificativaNoModal}
                            redirecionaMotivo={()=>redirecionaPreenchimentoPendencias('motivo')}
                            redirecionaJustifica={()=>redirecionaPreenchimentoPendencias('justificacao')}
                        />
                    </section>
                </>
            }
        </>
    )
}
export default memo(PreviaDocumentoRetificado)