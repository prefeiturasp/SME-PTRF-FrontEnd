import React, {useState, useCallback, useEffect} from 'react';
import {Button} from 'react-bootstrap';
import {useHistory} from 'react-router-dom'
import {ModalConfirmaDevolverParaAcerto} from "../../.././../../componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/DevolucaoParaAcertos/ModalConfirmaDevolverParaAcerto";
import {devolverConsolidado} from '../../../../../services/dres/RelatorioConsolidado.service'
import { toastCustom } from "../../../../Globais/ToastCustom";
import './styles.scss'
import {exibeDataPT_BR} from "../../../../../utils/ValidacoesAdicionaisFormularios";

export const TopoComBotoes = ({relatorioConsolidado, dataLimiteDevolucao, tabAtual}) => {
    const [showModalConfirmaDevolverParaAcerto, setShowModalConfirmaDevolverParaAcerto] = useState(false)
    const [loading, setLoading] = useState(null);

    const devolverParaAcertos = useCallback(async () =>{
        setLoading(true);
        setShowModalConfirmaDevolverParaAcerto(false)
        await devolverConsolidado(relatorioConsolidado.uuid, dataLimiteDevolucao)
        toastCustom.ToastCustomSuccess('Status alterado com sucesso', 'O relatório foi alterado para "devolvido para acertos".')
        setLoading(false)
        document.location.reload()
    }, [dataLimiteDevolucao, relatorioConsolidado, setLoading])

    const obterUuid = () => {
        if (relatorioConsolidado?.analise_atual) {
            return relatorioConsolidado.analise_atual.consolidado_dre;
        } else if (relatorioConsolidado?.analises_do_consolidado_dre) {
            return relatorioConsolidado.analises_do_consolidado_dre[relatorioConsolidado.analises_do_consolidado_dre.length - 1]?.consolidado_dre;
        } else {
            return null;
        }
    }
    

    let history = useHistory();

    return (
        <>
        <div className="d-flex bd-highlight mt-3 mb-0 container-cabecalho">
            <div className="flex-grow-1 bd-highlight">
                <p className='titulo-explicativo mb-0'>{relatorioConsolidado?.dre?.nome}</p>
            </div>
        </div>
            { 
                relatorioConsolidado && relatorioConsolidado.periodo && 
                <div className="info-cabecalho pt-3">
                    <div className='periodo-info-cabecalho'>
                        <p>Período: <strong>{relatorioConsolidado?.periodo?.referencia} - {exibeDataPT_BR(relatorioConsolidado?.periodo?.data_inicio_realizacao_despesas)} até {exibeDataPT_BR(relatorioConsolidado?.periodo?.data_fim_realizacao_despesas)}</strong></p>
                    </div>
                </div>
            }
            <div className='d-flex justify-content-between mt-3'>
                <h2 className='text-resumo'>
                    Resumo de acertos
                </h2>
                <div className="container-botoes">
                    <Button variant="outline-success"
                        onClick={() => history.push(`/analise-relatorio-consolidado-dre-detalhe/${obterUuid()}/`)}>
                        Voltar
                    </Button>
                    {tabAtual === 'conferencia-atual' &&              
                    <Button variant="success"
                        onClick={
                            e => setShowModalConfirmaDevolverParaAcerto(true)
                        }
                        disabled={
                            relatorioConsolidado?.status_sme !== 'EM_ANALISE' || !dataLimiteDevolucao
                    }>
                        Devolver para DRE
                    </Button>
    }
                </div>
            </div>
            <section>
                <ModalConfirmaDevolverParaAcerto
                    show={showModalConfirmaDevolverParaAcerto}
                    handleClose={() => setShowModalConfirmaDevolverParaAcerto(false)}
                    onDevolverParaAcertoTrue={devolverParaAcertos}
                    titulo="Devolver para acertos"
                    texto='<p>O relatório consolidado será movido para o status de ”Relatórios devolvidos para acertos” e ficará nesse status até que seja retornado para em análise.</p> <p>A DRE será notificada sobre a "Devolução para acertos" desse relatório consolidado.</p><p> Deseja continuar?</p>'
                    primeiroBotaoTexto="Cancelar"
                    primeiroBotaoCss="outline-success"
                    segundoBotaoCss="success"
                    segundoBotaoTexto="Devolver para a DRE"
                />
            </section>
        </>
    )
}
