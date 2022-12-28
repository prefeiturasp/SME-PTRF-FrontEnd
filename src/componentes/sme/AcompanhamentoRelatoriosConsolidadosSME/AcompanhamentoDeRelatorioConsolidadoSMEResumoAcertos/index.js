import React, { useEffect, useState, useCallback, useContext } from 'react'
import { useParams } from 'react-router-dom';
import {detalhamentoConferenciaDocumentos} from "../../../../services/sme/AcompanhamentoSME.service"
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
import { RelatorioAposAcertos } from './RelatorioAposAcertos';
import Loading from "../../../../utils/Loading";


export const AcompanhamentoDeRelatorioConsolidadoSMEResumoAcertos = () => {
    const params = useParams()
    const { dataLimite } = useContext(DataLimiteDevolucao)

    const rowsPerPage = 10
    const [comentarios, setComentarios] = useState({})

    const [relatorioConsolidado, setRelatorioConsolidado] = useState(null);
    const [analiseSequenciaVisualizacao, setAnaliseSequenciaVisualizacao] = useState({})
    const [listaDeDocumentosRelatorio, setListaDeDocumentosRelatorio] = useState(null)
    const [dataLimiteDevolucao, setDataLimiteDevolucao] = useState(dataLimite);
    const [tabAtual, setTabAtual] = useState('conferencia-atual');
    const [cardDataDevolucao, setCardDataDevolucao] = useState({
        data_devolucao: "",
        data_retorno_analise: "",
        data_limite: dataLimiteDevolucao,
    })
    const [resumoConsolidado, setResumoConsolidado] = useState(null);
    const [listaDocumentoHistorico, setListaDocumentoHistorico] = useState(null)
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
    }, [params])

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

    useEffect(() => {
        let indexConsolidado = tabAtual === 'conferencia-atual' ? relatorioConsolidado?.analises_do_consolidado_dre.length - 1 : relatorioConsolidado?.analises_do_consolidado_dre.length - 2
        getDetalhamentoConferenciaDocumentosHistorico(relatorioConsolidado?.analises_do_consolidado_dre[indexConsolidado]?.uuid)
    }, [relatorioConsolidado, tabAtual])

    const handleChangeDataLimiteDevolucao = (name, value) => {
        setDataLimiteDevolucao(value)
    }

    const getDetalhamentoConferenciaDocumentosHistorico = async (analise_atual_uuid) => {
        if (!relatorioConsolidado?.analise_atual?.uuid && relatorioConsolidado?.status_sme !== "ANALISADO"){
            return false
        }
        let response = ''
        if (!analise_atual_uuid && relatorioConsolidado?.status_sme !== "ANALISADO") {
            response = await detalhamentoConferenciaDocumentos(relatorioConsolidado?.uuid, relatorioConsolidado?.analise_atual?.uuid)
        }
        else {
            response = await detalhamentoConferenciaDocumentos(relatorioConsolidado?.uuid, analise_atual_uuid)
        }
        
        const documento = response?.data?.lista_documentos
        setListaDocumentoHistorico(documento?.filter((item) => item.analise_documento_consolidado_dre.resultado === "AJUSTE"))
    }

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento da documentação da DRE</h1>
            <div className="page-content-inner pt-5">
            <TopoComBotoes
                resumoConsolidado={resumoConsolidado}
                dataLimiteDevolucao={dataLimiteDevolucao}
                relatorioConsolidado={relatorioConsolidado}
                tabAtual={tabAtual}
            />
            {!loading ?

                <TabsConferencia
                    relatorioConsolidado={relatorioConsolidado}
                    setTabAtual={setTabAtual}
                    tabAtual={tabAtual}
                    setAnaliseSequenciaVisualizacao={setAnaliseSequenciaVisualizacao}
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
                tabAtual={tabAtual}
                setTabAtual={setTabAtual}
                getDetalhamentoConferenciaDocumentosHistorico={getDetalhamentoConferenciaDocumentosHistorico}
                listaDocumentoHistorico={listaDocumentoHistorico}
                setAnaliseSequenciaVisualizacao={setAnaliseSequenciaVisualizacao}
                analiseSequenciaVisualizacao={analiseSequenciaVisualizacao}
            />
            {!loading ? (
                typeof relatorioConsolidado?.status_sme === 'DEVOLVIDO' || (relatorioConsolidado?.status_sme == 'EM_ANALISE' || relatorioConsolidado?.analises_do_consolidado_dre.length) !== 'undefined' &&
                <>
                <CardsInfoDevolucaoSelecionada
                    cardDataDevolucao={cardDataDevolucao}
                    relatorioConsolidado={relatorioConsolidado}
                    listaDocumentoHistorico={listaDocumentoHistorico}
                    analiseSequenciaVisualizacao={analiseSequenciaVisualizacao}
                    tabAtual={tabAtual}
                />
                </>
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
                    listaDocumentoHistorico={listaDocumentoHistorico}
                    setListaDeDocumentosRelatorio={setListaDeDocumentosRelatorio}
                    getDetalhamentoConferenciaDocumentosHistorico={getDetalhamentoConferenciaDocumentosHistorico}
                    listaDeDocumentosRelatorio={listaDeDocumentosRelatorio}
                    rowsPerPage={rowsPerPage}
                    tabAtual={tabAtual}
                    editavel={''} />
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
            {tabAtual === 'historico' ?
            <RelatorioAposAcertos
                    analiseSequenciaVisualizacao={analiseSequenciaVisualizacao}
                    relatorioConsolidado={relatorioConsolidado}
                    resumoConsolidado={resumoConsolidado}
                    analiseAtualUuid={relatorioConsolidado.analise_atual}
                    podeGerarPrevia={false}
                />
            :
            <RelatorioDosAcertos
                    analiseSequenciaVisualizacao={analiseSequenciaVisualizacao}
                    relatorioConsolidado={relatorioConsolidado}
                    resumoConsolidado={resumoConsolidado}
                    podeGerarPrevia={true}
                />
            }
        </div>
        </PaginasContainer>
    )
}
