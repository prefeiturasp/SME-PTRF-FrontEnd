import React, { useEffect, useState, useCallback, useContext } from 'react'
import { useParams } from 'react-router-dom';
import { PaginasContainer } from "../../../../paginas/PaginasContainer";
import { getResumoConsolidado } from "../../../../services/sme/AcompanhamentoSME.service"
import { TopoComBotoes } from './TopoComBotoes'
import { TabsConferencia } from './TabsConferencia'
import { CardsInfoDevolucaoSelecionada } from "./CardsInfoDevolucaoSelecionada";
import { VisualizaDevolucoes } from './VisualizaDevolucoes'
import { ComentariosNotificados } from './ComentariosNotificados'
import { DataLimiteDevolucao } from '../../../../context/DataLimiteDevolucao';
import { TabelaConferenciaDeDocumentosRelatorios } from './TabelaConferenciaDeDocumentosRelatorios'
import { detalhamentoConsolidadoDRE } from "../../../../services/sme/AcompanhamentoSME.service"
import { RelatorioDosAcertos } from './RelatorioDosAcertos';
import Loading from "../../../../utils/Loading";


export const AcompanhamentoDeRelatorioConsolidadoSMEResumoAcertos = () => {
    const params = useParams()
    const { dataLimite } = useContext(DataLimiteDevolucao)

    const rowsPerPage = 10
    const [comentarios, setComentarios] = useState({})

    const [relatorioConsolidado, setRelatorioConsolidado] = useState(null);
    const [dataLimiteDevolucao, setDataLimiteDevolucao] = useState(dataLimite);
    const [cardDataDevolucao, setCardDataDevolucao] = useState({
        data_devolucao: "",
        data_retorno_analise: "",
        data_limite: dataLimiteDevolucao,
    })
    const [resumoConsolidado, setResumoConsolidado] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function pegaDadosResumoConsolidado() {
            const response = await getResumoConsolidado(params.consolidado_dre_uuid)
            setComentarios(response?.data?.comentarios_de_analise_do_consolidado_dre)
            setResumoConsolidado(response)
            setDataLimiteDevolucao(response?.data?.data_limite)
            setCardDataDevolucao({
                data_devolucao: response.data.data_devolucao,
                data_retorno_analise: response.data.data_retorno_analise,
                data_limite: response?.data?.data_limite
            })
            setLoading(false)
        }
        pegaDadosResumoConsolidado()
        
    }, [])

    const getConsolidadoDREUuid = useCallback(async () => {
        if (!resumoConsolidado) {
            return
        }
        let response = await detalhamentoConsolidadoDRE(resumoConsolidado?.data.consolidado_dre)
        setRelatorioConsolidado(response.data);
        setLoading(false);
        
    }, [resumoConsolidado]);

    useEffect(() => {
        getConsolidadoDREUuid()
    }, [getConsolidadoDREUuid])

    const handleChangeTab = (key, event) => {
        return ''
    }

    const handleChangeDataLimiteDevolucao = (name, value) => {
        setDataLimiteDevolucao(value)
    }

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento da documentação da DRE</h1>
            <TopoComBotoes
                dataLimiteDevolucao={dataLimiteDevolucao}
                relatorioConsolidado={relatorioConsolidado}
            />
            {!loading ?
                <TabsConferencia
                    relatorioConsolidado={relatorioConsolidado}
                /> :
                <Loading
                    corGrafico="black"
                    corFonte="dark"
                    marginTop="0"
                    marginBottom="0"
                />
            }
            <VisualizaDevolucoes
                dataLimiteDevolucao={dataLimiteDevolucao}
                handleChangeDataLimiteDevolucao={handleChangeDataLimiteDevolucao}
                relatorioConsolidado={relatorioConsolidado}
            />
            {!loading ? (
                <CardsInfoDevolucaoSelecionada
                    cardDataDevolucao={cardDataDevolucao}
                />
            ) : <Loading
                corGrafico="black"
                corFonte="dark"
                marginTop="0"
                marginBottom="0"
            />
            }
            {comentarios && !loading ? (
                <ComentariosNotificados
                    comentarios={comentarios}
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
                    resumoConsolidado={resumoConsolidado}
                    relatorioConsolidado={relatorioConsolidado}
                    rowsPerPage={rowsPerPage}
                    loadingDocumentosRelatorio={loading}
                    editavel={''} />
            }
            <RelatorioDosAcertos
                    relatorioConsolidado={relatorioConsolidado}
                    resumoConsolidado={resumoConsolidado}
                    podeGerarPrevia={true}
                />


        </PaginasContainer>
    )
}
