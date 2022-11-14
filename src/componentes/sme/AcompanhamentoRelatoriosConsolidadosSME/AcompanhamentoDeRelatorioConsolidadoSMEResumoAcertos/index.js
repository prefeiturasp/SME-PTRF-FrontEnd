import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {getResumoConsolidado} from "../../../../services/sme/AcompanhamentoSME.service"
import { TopoComBotoes } from './TopoComBotoes'
import { TabsConferencia } from './TabsConferencia'
import { CardsInfoDevolucaoSelecionada } from "./CardsInfoDevolucaoSelecionada";
import { VisualizaDevolucoes } from './VisualizaDevolucoes'
import { ComentariosNotificados } from './ComentariosNotificados'
import { TabelaConferenciaDeDocumentosRelatorios } from './TabelaConferenciaDeDocumentosRelatorios'
import { RelatorioAposAcertos } from './RelatorioAposAcertos'
import Loading from "../../../../utils/Loading";


export const AcompanhamentoDeRelatorioConsolidadoSMEResumoAcertos = () => {
    const params = useParams()
    const rowsPerPage = 10
    const [objetoConteudoCard, setObjetoConteudoCard] = useState({})
    const [comentariosNotificados, setComentariosNotificados] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function pegaDadosResumoConsolidado() {
            const response = await getResumoConsolidado(params.consolidado_dre_uuid)
            setObjetoConteudoCard({'nome': 'feijao'})
            setComentariosNotificados({'primeiro': 2})
            setLoading(false)
        }
        pegaDadosResumoConsolidado()
    }, [])

    const handleChangeTab = (key, event) => {
        return ''
    }

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento da documentação da DRE</h1>
            <TopoComBotoes />
            <TabsConferencia/>
            <VisualizaDevolucoes/>
            {objetoConteudoCard && !loading ? (
                <CardsInfoDevolucaoSelecionada 
                objetoConteudoCard={objetoConteudoCard}
                />
            ) : <Loading
                    corGrafico="black"
                    corFonte="dark"
                    marginTop="0"
                    marginBottom="0"
                />
            }
            {comentariosNotificados && !loading ? (
                <ComentariosNotificados 
                    comentariosNotificados={comentariosNotificados}
                />
            ) : <Loading
                    corGrafico="black"
                    corFonte="dark"
                    marginTop="0"
                    marginBottom="0"
                />
            }
                {loading ? (
                        <Loading
                            corGrafico="black"
                            corFonte="dark"
                            marginTop="0"
                            marginBottom="0"
                        />
                    ) :
                    <TabelaConferenciaDeDocumentosRelatorios
                        relatorioConsolidado={''}
                        listaDeDocumentosRelatorio={''}
                        carregaListaDeDocumentosRelatorio={''}
                        setListaDeDocumentosRelatorio={''}
                        rowsPerPage={rowsPerPage}
                        loadingDocumentosRelatorio={''}
                        editavel={''}/>
                }
                <RelatorioAposAcertos
                    // prestacaoDeContasUuid={prestacaoDeContasUuid}
                    // prestacaoDeContas={prestacaoDeContas}
                    // analiseAtualUuid={analiseAtualUuid}
                    podeGerarPrevia={true}
                />


        </PaginasContainer>
    )
}