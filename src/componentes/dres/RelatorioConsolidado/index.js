import React, {useCallback, useEffect, useState, memo} from "react";
import {visoesService} from "../../../services/visoes.service";
import { getExecucaoFinanceira } from "../../../services/dres/RelatorioConsolidado.service";
import {
    getFiqueDeOlhoRelatoriosConsolidados,
    getStatusConsolidadoDre,
    postPublicarConsolidadoDre,
    getTrilhaStatus,
    postGerarPreviaConsolidadoDre,
    getConsolidadosDreJaPublicadosProximaPublicacao,
    postPublicarConsolidadoDePublicacoesParciais,
    getStatusRelatorioConsolidadoDePublicacoesParciais,
} from "../../../services/dres/RelatorioConsolidado.service";
import {getPeriodos} from "../../../services/dres/Dashboard.service";
import {SelectPeriodo} from "./SelectPeriodo";
import {PaginasContainer} from "../../../paginas/PaginasContainer";
import {BarraDeStatus} from "./BarraDeStatus";
import './relatorio-consolidado.scss'
import Img404 from "../../../assets/img/img-404.svg";
import {MsgImgCentralizada} from "../../Globais/Mensagens/MsgImgCentralizada";
import {TrilhaDeStatus} from "./TrilhaDeStatus";
import Loading from "../../../utils/Loading";
import PublicarDocumentos from "./PublicarDocumentos";
import DemonstrativoDaExecucaoFisicoFinanceira from "./DemonstrativoDaExecucaoFisicoFinanceira";
import {AtaParecerTecnico} from "./AtaParecerTecnico";
import Lauda from "./Lauda";
import {ModalAtaNaoPreenchida} from "../../../utils/Modais";
import PreviaDocumentos from "./PreviaDocumento";
import {PERIODO_RELATORIO_CONSOLIDADO_DRE} from "../../../services/auth.service";

const RelatorioConsolidado = () => {

    const dre_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid');
    const periodo_relatorio_consolidado_localstorage = localStorage.getItem(PERIODO_RELATORIO_CONSOLIDADO_DRE)

    const [fiqueDeOlho, setFiqueDeOlho] = useState("");

    // Consolidado DRE
    const [consolidadosDreJaPublicados, setConsolidadosDreJaPublicados] = useState(false);
    const [consolidadoDreProximaPublicacao, setConsolidadoDreProximaPublicacao] = useState(false);
    const [execucaoFinanceira, setExecucaoFinanceira] = useState({})
    const [statusBarraDeStatus, setStatusBarraDeStatus] = useState('');
    const [statusProcessamentoConsolidadoDre, setStatusProcessamentoConsolidadoDre] = useState('');
    const [statusProcessamentoRelatorioConsolidadoDePublicacoesParciais, setStatusProcessamentoRelatorioConsolidadoDePublicacoesParciais] = useState('');
    const [periodos, setPeriodos] = useState(false);
    const [periodoEscolhido, setPeriodoEsolhido] = useState(false);
    const [showPublicarRelatorioConsolidado, setShowPublicarRelatorioConsolidado] = useState(false);
    const [showPublicarRetificacao, setShowPublicarRetificacao] = useState(false);

    // Ata
    const [showAtaNaoPreenchida, setShowAtaNaoPreenchida] = useState(false);

    const [trilhaStatus, setTrilhaStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [disableGerar, setDisableGerar] = useState(true);

    const carregaPeriodos = useCallback(async () => {
        try {
            let periodos = await getPeriodos();
            setPeriodos(periodos);
            if (periodos && periodos.length > 0){
                //Caso exista mais de um período seleciona por default o anterior ao corrente.
                const periodoIndex = periodos.length > 1 ? 1 : 0;
                if (periodo_relatorio_consolidado_localstorage){
                    setPeriodoEsolhido(periodo_relatorio_consolidado_localstorage)
                }else {
                    setPeriodoEsolhido(periodos[periodoIndex].uuid)
                }

            }
        } catch (e) {
            console.log("Erro ao buscar períodos ", e)
        }
    }, [periodo_relatorio_consolidado_localstorage]);

    useEffect(() => {
        carregaPeriodos()
    }, [carregaPeriodos])


    const carregaConsolidadosDreJaPublicadosProximaPublicacao = useCallback(async () => {
        if  ( (dre_uuid && periodoEscolhido && statusProcessamentoConsolidadoDre) || statusProcessamentoRelatorioConsolidadoDePublicacoesParciais ) {
            try {
                let consolidados_dre = await getConsolidadosDreJaPublicadosProximaPublicacao(dre_uuid, periodoEscolhido)
                setConsolidadosDreJaPublicados(consolidados_dre.publicacoes_anteriores)
                setConsolidadoDreProximaPublicacao(consolidados_dre.proxima_publicacao)
            } catch (e) {
                console.log("Erro ao buscar Consolidado Dre ", e)
            }
        }
    }, [dre_uuid, periodoEscolhido, statusProcessamentoConsolidadoDre, statusProcessamentoRelatorioConsolidadoDePublicacoesParciais])

    useEffect(() => {
        carregaConsolidadosDreJaPublicadosProximaPublicacao()
    }, [carregaConsolidadosDreJaPublicadosProximaPublicacao])

    const retornaStatusConsolidadosDre = useCallback(async () => {
        if (dre_uuid && periodoEscolhido) {
            try {
                let status = await getStatusConsolidadoDre(dre_uuid, periodoEscolhido)

                if (status && status.length > 0) {
                    setStatusBarraDeStatus(status[0])
                    setStatusProcessamentoConsolidadoDre(status[0].status_geracao)
                }
            } catch (e) {
                console.log("Erro ao buscar status Consolidado Dre ", e)
            }
        }
    }, [dre_uuid, periodoEscolhido])


    useEffect(() => {
        retornaStatusConsolidadosDre()
    }, [retornaStatusConsolidadosDre])

    useEffect(() => {
        (async () => {
            if(periodoEscolhido) {
                await carregaExecucaoFinanceira()
                setDisableGerar(false)
            }
        })()
    }, [periodoEscolhido])

    const retornaStatusProcessamentoRelatorioConsolidadoDePublicacoesParciais = useCallback(async () => {
        if (dre_uuid && periodoEscolhido) {
            try {
                let status = await getStatusRelatorioConsolidadoDePublicacoesParciais(dre_uuid, periodoEscolhido)
                setStatusProcessamentoRelatorioConsolidadoDePublicacoesParciais(status.status)
            } catch (e) {
                console.log("Erro ao buscar status Consolidado Dre ", e)
            }
        }
    }, [dre_uuid, periodoEscolhido])


    useEffect(() => {
        retornaStatusProcessamentoRelatorioConsolidadoDePublicacoesParciais()
    }, [retornaStatusProcessamentoRelatorioConsolidadoDePublicacoesParciais])

    const buscaTrilhaStatus = useCallback(async () => {
        if (dre_uuid && periodoEscolhido) {
            let trilha_status = await getTrilhaStatus(dre_uuid, periodoEscolhido)
            setTrilhaStatus(trilha_status)
        }
    }, [dre_uuid, periodoEscolhido])

    useEffect(() => {
        buscaTrilhaStatus()
    }, [buscaTrilhaStatus])

    useEffect(() => {
        if (statusProcessamentoConsolidadoDre && statusProcessamentoConsolidadoDre === "EM_PROCESSAMENTO") {
            setLoading(true)
            const timer = setInterval(() => {
                retornaStatusConsolidadosDre();
            }, 5000);
            // clearing interval
            return () => clearInterval(timer);
        } else {
            buscaTrilhaStatus();
            setLoading(false);
        }
    }, [statusProcessamentoConsolidadoDre, retornaStatusConsolidadosDre, buscaTrilhaStatus]);

    useEffect(() => {
        if (statusProcessamentoRelatorioConsolidadoDePublicacoesParciais && statusProcessamentoRelatorioConsolidadoDePublicacoesParciais === "EM_PROCESSAMENTO") {
            setLoading(true)
            const timer = setInterval(() => {
                retornaStatusProcessamentoRelatorioConsolidadoDePublicacoesParciais();
            }, 5000);
            // clearing interval
            return () => clearInterval(timer);
        } else {
            setLoading(false);
        }
    }, [statusProcessamentoRelatorioConsolidadoDePublicacoesParciais, retornaStatusProcessamentoRelatorioConsolidadoDePublicacoesParciais]);

    const buscaFiqueDeOlho = useCallback(async () => {
        try {
            let fique_de_olho = await getFiqueDeOlhoRelatoriosConsolidados();
            setFiqueDeOlho(fique_de_olho.detail);
        } catch (e) {
            console.log("Erro ao buscar Fique de Olho ", e)
        }
    }, [])

    useEffect(() => {
        buscaFiqueDeOlho()
    }, [buscaFiqueDeOlho])

    const handleChangePeriodos = async (uuid_periodo) => {
        setPeriodoEsolhido(uuid_periodo)
        localStorage.setItem(PERIODO_RELATORIO_CONSOLIDADO_DRE, uuid_periodo);
    };

    const formataNumero = (status) => {
        let item = trilhaStatus.cards.find(element => element.status === status);
        let qtde_itens = item.quantidade_prestacoes;

        if (qtde_itens <= 9) {
            return '0' + qtde_itens;
        } else {
            return qtde_itens.toString();
        }
    };

    const retornaClasseCirculoTrilhaStatus = (status) => {
        let qtde_formatado = formataNumero(status);

        if (qtde_formatado && qtde_formatado.length < 3) {
            return "circulo-relatorio-consolidado-dois-digitos"
        } else {
            return "circulo-relatorio-consolidado-tres-digitos"
        }
    };

    const retornaCorCirculoTrilhaStatus = (estilo) => {
        if (estilo === 2) {
            return "circulo-relatorio-consolidado-simples-vermelho"
        }
        return "circulo-relatorio-consolidado-simples"
    };

    const eh_circulo_duplo = (estilo) => {
        return estilo === 1;
    }

    const filtraStatus = () => {
        return trilhaStatus.cards.filter((item) => item.status !== "APROVADA" && item.status !== "REPROVADA")
    }

    const podeGerarPrevia = () => {
        if (trilhaStatus && trilhaStatus.cards && trilhaStatus.cards.length > 0){
            let card_concluido = trilhaStatus.cards.find((element) => element.status === 'CONCLUIDO' )
            let qtde_prestacoes = card_concluido.quantidade_prestacoes
            return qtde_prestacoes > 0
        }
    }

    const podeGerarPreviaRetificacao = (consolidadoDre) => {
        if (trilhaStatus && trilhaStatus.cards && trilhaStatus.cards.length > 0){
            let filteredCards = trilhaStatus.cards.filter((element) => ["RECEBIDA", "DEVOLVIDA", "EM_ANALISE"].includes(element.status))
            return !filteredCards.every((element) => element.quantidade_prestacoes === 0)
        }
    }

    const todasAsPcsDaRetificacaoConcluidas = (consolidadoDre) => {
        if(consolidadoDre && consolidadoDre.eh_retificacao){
            return consolidadoDre.todas_pcs_da_retificacao_concluidas
        }
    }

    const podeAcessarInfoConsolidado = (consolidadoDre) => {
        if(consolidadoDre && consolidadoDre.eh_retificacao){
            return consolidadoDre.todas_pcs_da_retificacao_concluidas;
        }
        else{
            if (trilhaStatus && trilhaStatus.cards && trilhaStatus.cards.length > 0){
                let card_concluido = trilhaStatus.cards.find((element) => element.status === 'CONCLUIDO' )
                let qtde_prestacoes = card_concluido.quantidade_prestacoes
                return qtde_prestacoes > 0
            }
        }
    }

    const podeExibirProximaPublicacao = () =>{
        return (consolidadoDreProximaPublicacao && podeGerarPrevia()) || (consolidadoDreProximaPublicacao && consolidadoDreProximaPublicacao.eh_consolidado_de_publicacoes_parciais)
    }

    const publicarConsolidadoDre = async (consolidado_dre) => {
        setShowPublicarRelatorioConsolidado(false)

        let payload = {
            dre_uuid: dre_uuid,
            periodo_uuid: periodoEscolhido,
            uuid_retificacao: null
        }
        try {
            if (!consolidado_dre.ata_de_parecer_tecnico || !consolidado_dre.ata_de_parecer_tecnico.alterado_em) {
                setShowAtaNaoPreenchida(true);
            } else {
                let publicar = await postPublicarConsolidadoDre(payload);
                setStatusProcessamentoConsolidadoDre(publicar.status);
            }
            await carregaConsolidadosDreJaPublicadosProximaPublicacao()
        } catch (e) {
            console.log("Erro ao publicar Consolidado Dre ", e)
        }
    }

    const publicarConsolidadoDePublicacoesParciais = async () => {
        let payload = {
            dre_uuid: dre_uuid,
            periodo_uuid: periodoEscolhido
        }
        try {
            await postPublicarConsolidadoDePublicacoesParciais(payload);

            let status = await getStatusRelatorioConsolidadoDePublicacoesParciais(dre_uuid, periodoEscolhido)

            setStatusProcessamentoRelatorioConsolidadoDePublicacoesParciais(status.status);

        } catch (e) {
            console.log("Erro ao publicar Consolidado de Publicações Parciais ", e)
        }
        await carregaConsolidadosDreJaPublicadosProximaPublicacao()
    }

    const publicarRetificacao = async (consolidado_dre) => {
        setShowPublicarRetificacao(false)

        let payload = {
            dre_uuid: dre_uuid,
            periodo_uuid: periodoEscolhido,
            uuid_retificacao: consolidado_dre.uuid
        }

        try {
            if (!consolidado_dre.ata_de_parecer_tecnico || !consolidado_dre.ata_de_parecer_tecnico.alterado_em) {
                setShowAtaNaoPreenchida(true);
            } else {
                let publicar = await postPublicarConsolidadoDre(payload);
                setStatusProcessamentoConsolidadoDre(publicar.status);
            }
            await carregaConsolidadosDreJaPublicadosProximaPublicacao()
        } catch (e) {
            console.log("Erro ao publicar Consolidado Dre ", e)
        }
    }

    const gerarPreviaConsolidadoDre = async () => {
        let payload = {
            dre_uuid: dre_uuid,
            periodo_uuid: periodoEscolhido
        }

        try {
            let previa = await postGerarPreviaConsolidadoDre(payload);
            setStatusProcessamentoConsolidadoDre(previa.status);
            await carregaConsolidadosDreJaPublicadosProximaPublicacao()
        } catch (e) {
            console.log("Erro ao publicar Prévia Consolidado Dre ", e)
        }
    }

    const carregaExecucaoFinanceira = async () => {
        const dre_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid');
        try {
            let execucao = await getExecucaoFinanceira(dre_uuid, periodoEscolhido,  consolidadoDreProximaPublicacao?.uuid !== 'null' ? consolidadoDreProximaPublicacao?.uuid : '');
            setExecucaoFinanceira(execucao);
        } catch (e) {
            console.log("Erro ao carregar execução financeira ", e)
        }
        setLoading(false)
    };

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Consolidado das PCs</h1>
            <>
                <div className="col-12 container-texto-introdutorio mb-4 mt-3">
                    <div dangerouslySetInnerHTML={{__html: fiqueDeOlho}}/>
                </div>
                <div className="page-content-inner pt-0">
                    {statusBarraDeStatus &&
                        <BarraDeStatus
                            statusBarraDeStatus={statusBarraDeStatus}
                        />
                    }
                    <SelectPeriodo
                        periodos={periodos}
                        periodoEscolhido={periodoEscolhido}
                        handleChangePeriodos={handleChangePeriodos}
                    />
                    {periodoEscolhido && dre_uuid && trilhaStatus ? (
                            <>
                                <TrilhaDeStatus
                                    trilhaStatus={trilhaStatus}
                                    filtraStatus={filtraStatus}
                                    retornaClasseCirculoTrilhaStatus={retornaClasseCirculoTrilhaStatus}
                                    formataNumero={formataNumero}
                                    retornaCorCirculoTrilhaStatus={retornaCorCirculoTrilhaStatus}
                                    eh_circulo_duplo={eh_circulo_duplo}
                                />
                                {loading ? (
                                        <div className="mt-5">
                                            <Loading
                                                corGrafico="black"
                                                corFonte="dark"
                                                marginTop="0"
                                                marginBottom="0"
                                            />
                                            <p className='text-center'>Os documentos estão sendo gerados. Enquanto isso, você
                                                pode realizar outras atividades no sistema.</p>
                                        </div>
                                    ) :
                                    <>
                                        {podeExibirProximaPublicacao() &&
                                            <>
                                            <div className='mt-3'>
                                                <PublicarDocumentos
                                                    publicarConsolidadoDre={publicarConsolidadoDre}
                                                    publicarConsolidadoDePublicacoesParciais={publicarConsolidadoDePublicacoesParciais}
                                                    podeGerarPrevia={podeGerarPrevia}
                                                    consolidadoDre={consolidadoDreProximaPublicacao}
                                                    showPublicarRelatorioConsolidado={showPublicarRelatorioConsolidado}
                                                    setShowPublicarRelatorioConsolidado={setShowPublicarRelatorioConsolidado}
                                                    execucaoFinanceira={execucaoFinanceira}
                                                    disableGerar={disableGerar}
                                                    carregaConsolidadosDreJaPublicadosProximaPublicacao={carregaConsolidadosDreJaPublicadosProximaPublicacao}
                                                    todasAsPcsDaRetificacaoConcluidas={todasAsPcsDaRetificacaoConcluidas}
                                                    publicarRetificacao={publicarRetificacao}
                                                    showPublicarRetificacao={showPublicarRetificacao}
                                                    setShowPublicarRetificacao={setShowPublicarRetificacao}
                                                    periodoEscolhido={periodoEscolhido}
                                                >
                                                    <PreviaDocumentos
                                                        gerarPreviaConsolidadoDre={gerarPreviaConsolidadoDre}
                                                    />
                                                </PublicarDocumentos>
                                                <DemonstrativoDaExecucaoFisicoFinanceira
                                                    consolidadoDre={consolidadoDreProximaPublicacao}
                                                    periodoEscolhido={periodoEscolhido}
                                                    podeAcessarInfoConsolidado={podeAcessarInfoConsolidado}
                                                    execucaoFinanceira={execucaoFinanceira}
                                                />
                                                {!consolidadoDreProximaPublicacao.eh_consolidado_de_publicacoes_parciais &&
                                                    <AtaParecerTecnico
                                                    consolidadoDre={consolidadoDreProximaPublicacao}
                                                    podeAcessarInfoConsolidado={podeAcessarInfoConsolidado}
                                                    />
                                                }
                                                {!consolidadoDreProximaPublicacao.eh_consolidado_de_publicacoes_parciais &&
                                                    <Lauda
                                                        consolidadoDre={consolidadoDreProximaPublicacao}
                                                    />
                                                }
                                            </div>
                                            </>
                                        }

                                        {consolidadosDreJaPublicados && consolidadosDreJaPublicados.map((consolidadoDre) =>
                                            
                                            <div key={consolidadoDre.uuid} className='mt-3'>
                                                <PublicarDocumentos
                                                    publicarConsolidadoDre={publicarConsolidadoDre}
                                                    podeGerarPrevia={podeGerarPrevia}
                                                    consolidadoDre={consolidadoDre}
                                                    showPublicarRelatorioConsolidado={showPublicarRelatorioConsolidado}
                                                    setShowPublicarRelatorioConsolidado={setShowPublicarRelatorioConsolidado}
                                                    carregaConsolidadosDreJaPublicadosProximaPublicacao={carregaConsolidadosDreJaPublicadosProximaPublicacao}
                                                    todasAsPcsDaRetificacaoConcluidas={todasAsPcsDaRetificacaoConcluidas}
                                                    publicarRetificacao={publicarRetificacao}
                                                    showPublicarRetificacao={showPublicarRetificacao}
                                                    setShowPublicarRetificacao={setShowPublicarRetificacao}
                                                    periodoEscolhido={periodoEscolhido}
                                                >
                                                    <PreviaDocumentos
                                                        gerarPreviaConsolidadoDre={gerarPreviaConsolidadoDre}
                                                    />
                                                    
                                                </PublicarDocumentos>
                                                <DemonstrativoDaExecucaoFisicoFinanceira
                                                    consolidadoDre={consolidadoDre}
                                                    periodoEscolhido={periodoEscolhido}
                                                    podeAcessarInfoConsolidado={podeAcessarInfoConsolidado}
                                                />
                                                <AtaParecerTecnico
                                                    consolidadoDre={consolidadoDre}
                                                    podeGerarPreviaRetificacao={podeGerarPreviaRetificacao(consolidadoDre)}
                                                    podeAcessarInfoConsolidado={podeAcessarInfoConsolidado}
                                                />
                                                <Lauda
                                                    consolidadoDre={consolidadoDre}
                                                />
                                            </div>
                                        )}
                                    </>
                                }
                            </>
                        ) :
                        <MsgImgCentralizada
                            texto='Selecione um período acima para visualizar as ações'
                            img={Img404}
                        />
                    }
                </div>
            </>
            <section>
                <ModalAtaNaoPreenchida
                    show={showAtaNaoPreenchida}
                    handleClose={() => setShowAtaNaoPreenchida(false)}
                />
            </section>
        </PaginasContainer>
    )
}

export default memo(RelatorioConsolidado)