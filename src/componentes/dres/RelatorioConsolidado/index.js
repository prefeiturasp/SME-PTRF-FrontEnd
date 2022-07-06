import React, {useCallback, useEffect, useState, memo} from "react";
import {visoesService} from "../../../services/visoes.service";
import {
    getFiqueDeOlhoRelatoriosConsolidados,
    getStatusConsolidadoDre,
    postPublicarConsolidadoDre,
    getConsolidadoDre,
    getTrilhaStatus,
    getStatusAta,
    postGerarPreviaConsolidadoDre
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
import { ModalAtaNaoPreenchida, ModalPublicarRelatorioConsolidado } from "../../../utils/Modais";
import {
    getDocumentosConsolidadoDre,
} from "../../../services/dres/RelatorioConsolidado.service";
import PreviaDocumentos from "./PreviaDocumento";

const RelatorioConsolidado = () => {

    const dre_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid');

    const [fiqueDeOlho, setFiqueDeOlho] = useState("");

    // Consolidado DRE
    const [consolidadoDre, setConsolidadoDre] = useState(false);
    const [statusConsolidadoDre, setStatusConsolidadoDre] = useState(false);
    const [statusProcessamentoConsolidadoDre, setStatusProcessamentoConsolidadoDre] = useState('');
    const [periodos, setPeriodos] = useState(false);
    const [periodoEscolhido, setPeriodoEsolhido] = useState(false);
    const [showPublicarRelatorioConsolidado, setShowPublicarRelatorioConsolidado] = useState(false);

    // Ata
    const [ataParecerTecnico, setAtaParecerTecnico] = useState(false);
    const [showAtaNaoPreenchida, setShowAtaNaoPreenchida] = useState(false);

    const [trilhaStatus, setTrilhaStatus] = useState(false);
    const [loading, setLoading] = useState(false);

    const carregaPeriodos = useCallback(async () => {
        try {
            let periodos = await getPeriodos();
            setPeriodos(periodos);
            if (periodos && periodos.length > 0) {
                setPeriodoEsolhido(periodos[0].uuid)
            }
        }catch (e) {
            console.log("Erro ao buscar períodos ", e)
        }
    }, []);

    useEffect(() => {
        carregaPeriodos()
    }, [carregaPeriodos])

    const carregaConsolidadoDre = useCallback(async () => {
        if (dre_uuid && periodoEscolhido){
            try {
                let consolidado_dre = await getConsolidadoDre(dre_uuid, periodoEscolhido)
                if (consolidado_dre && consolidado_dre.length > 0){
                    setConsolidadoDre(consolidado_dre[0])
                }else {
                    setConsolidadoDre(false)
                }
            }catch (e) {
                console.log("Erro ao buscar Consolidado Dre ", e)
            }
        }
    }, [dre_uuid, periodoEscolhido])

    useEffect(() => {
        carregaConsolidadoDre()
    }, [carregaConsolidadoDre])

    const carregaAtaParecerTecnico = useCallback(async () => {
        if (dre_uuid && periodoEscolhido){
            try {
                let ata = await getStatusAta(dre_uuid, periodoEscolhido);
                if(ata && ata.uuid){
                    setAtaParecerTecnico(ata);
                }
                else{
                    setAtaParecerTecnico(false);
                }
            }catch (e) {
                console.log("Erro ao buscar Ata parecer tecnico ", e)
            }
        }
    }, [dre_uuid, periodoEscolhido])

    useEffect(() => {
        carregaAtaParecerTecnico()
    }, [carregaAtaParecerTecnico])

    const retornaStatusConsolidadoDre = useCallback(async () => {
        if (dre_uuid && periodoEscolhido) {
            try {
                let status = await getStatusConsolidadoDre(dre_uuid, periodoEscolhido)
                setStatusConsolidadoDre(status)
                setStatusProcessamentoConsolidadoDre(status.status_geracao)
            }catch (e) {
                console.log("Erro ao buscar status Consolidado Dre ", e)
            }
        }
    }, [dre_uuid, periodoEscolhido])

    useEffect(() => {
        retornaStatusConsolidadoDre()
    }, [retornaStatusConsolidadoDre])

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
                retornaStatusConsolidadoDre();
            }, 5000);
            // clearing interval
            return () => clearInterval(timer);
        } else {
            buscaTrilhaStatus();
            setLoading(false);
        }
    }, [statusProcessamentoConsolidadoDre, retornaStatusConsolidadoDre, buscaTrilhaStatus]);

    const buscaFiqueDeOlho = useCallback(async () => {
        try {
            let fique_de_olho = await getFiqueDeOlhoRelatoriosConsolidados();
            setFiqueDeOlho(fique_de_olho.detail);
        }catch (e) {
            console.log("Erro ao buscar Fique de Olho ", e)
        }
    }, [])

    useEffect(() => {
        buscaFiqueDeOlho()
    }, [buscaFiqueDeOlho])

    const retornaDocumentosAta = useCallback(async () => {
        if (consolidadoDre && consolidadoDre.uuid) {
            try {
                let documentos = await getDocumentosConsolidadoDre(consolidadoDre.uuid)
                if(documentos.atas_de_parecer_tecnico_do_consolidado_dre.length > 0){
                    setAtaParecerTecnico(documentos.atas_de_parecer_tecnico_do_consolidado_dre[0])
                }
            } catch (e) {
                console.log("Erro ao buscar documentos da ata ", e)
            }
        }
    }, [consolidadoDre])

    useEffect(() => {
        if(statusProcessamentoConsolidadoDre && statusProcessamentoConsolidadoDre !== "EM_PROCESSAMENTO" ){
            retornaDocumentosAta();
        }
    }, [statusProcessamentoConsolidadoDre, retornaDocumentosAta])

    const handleChangePeriodos = async (uuid_periodo) => {
        setPeriodoEsolhido(uuid_periodo)
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

        if(qtde_formatado && qtde_formatado.length < 3){
            return "circulo-relatorio-consolidado-dois-digitos"
        }
        else{
            return "circulo-relatorio-consolidado-tres-digitos"
        }
    };

    const retornaCorCirculoTrilhaStatus = (estilo) => {
        if(estilo === 2){
            return "circulo-relatorio-consolidado-simples-vermelho"
        }
        
        return "circulo-relatorio-consolidado-simples"
        
    };

    const eh_circulo_duplo = (estilo) => {
        if(estilo === 1){
            return true;
        }

        return false;
    }

    const filtraStatus = () => {
        return trilhaStatus.cards.filter((item) => item.status !== "APROVADA" && item.status !== "REPROVADA")
    }

    const podeGerarPrevia = () => {
        if(!consolidadoDre){
            return true;
        }
        else if(consolidadoDre && consolidadoDre.versao !== "FINAL"){
            return true;
        }

        return false;
    }

    const publicarConsolidadoDre = async () => {
        let payload = {
            dre_uuid: dre_uuid,
            periodo_uuid: periodoEscolhido
        }
        try {
            if(ataParecerTecnico.uuid && ataParecerTecnico.alterado_em === null){
                setShowAtaNaoPreenchida(true);
            }
            else{
                let publicar = await postPublicarConsolidadoDre(payload);
                setStatusProcessamentoConsolidadoDre(publicar.status);
                setConsolidadoDre(publicar);
                setShowPublicarRelatorioConsolidado(false);
            }
        }catch (e) {
            console.log("Erro ao publicar Consolidado Dre ", e)
        }
    }

    const gerarPreviaConsolidadoDre = async () =>{
        let payload = {
            dre_uuid: dre_uuid,
            periodo_uuid: periodoEscolhido
        }

        try {
            let previa = await postGerarPreviaConsolidadoDre(payload);
            setStatusProcessamentoConsolidadoDre(previa.status);
            setConsolidadoDre(previa);
        }catch (e) {
            console.log("Erro ao publicar Prévia Consolidado Dre ", e)
        } 
    }

    const publicado = () => {
        if(!consolidadoDre){
            return false;
        }
        else if(consolidadoDre && consolidadoDre.versao === "PREVIA"){
            return false;
        }
        else if(consolidadoDre && consolidadoDre.versao === "FINAL"){
            return true;
        }

        return false;
    }

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Relatório consolidado</h1>

            <>
                        <div className="col-12 container-texto-introdutorio mb-4 mt-3">
                            <div dangerouslySetInnerHTML={{__html: fiqueDeOlho}}/>
                        </div>
                        <div className="page-content-inner pt-0">
                            {statusConsolidadoDre &&
                                <BarraDeStatus
                                    statusRelatorio={statusConsolidadoDre}
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
                                        <>
                                        {loading ? (
                                                <div className="mt-5">
                                                    <Loading
                                                        corGrafico="black"
                                                        corFonte="dark"
                                                        marginTop="0"
                                                        marginBottom="0"
                                                    />
                                                    <p className='text-center'>Os documentos estão sendo gerados. Enquanto isso, você pode realizar outras atividades no sistema.</p>
                                                </div>
                                            ) :
                                                <>
                                                    <PublicarDocumentos
                                                        podeGerarPrevia={podeGerarPrevia}
                                                        publicado={publicado}
                                                        setShowPublicarRelatorioConsolidado={setShowPublicarRelatorioConsolidado}
                                                    >
                                                        <PreviaDocumentos
                                                            gerarPreviaConsolidadoDre={gerarPreviaConsolidadoDre}
                                                        />
                                                    </PublicarDocumentos>

                                                    <DemonstrativoDaExecucaoFisicoFinanceira
                                                        consolidadoDre={consolidadoDre}
                                                        statusConsolidadoDre={statusConsolidadoDre}
                                                        periodoEscolhido={periodoEscolhido}
                                                        publicado={publicado}
                                                    />
                                                    
                                                    <AtaParecerTecnico
                                                        ataParecerTecnico={ataParecerTecnico}
                                                        publicado={publicado}
                                                    />

                                                    {consolidadoDre && consolidadoDre.uuid &&
                                                        <Lauda
                                                            consolidadoDre={consolidadoDre}
                                                        />
                                                    }
                                                </>
                                            }
                                        </>

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
                            handleClose={()=>setShowAtaNaoPreenchida(false)}
                        />
                    </section>

                    <section>
                        <ModalPublicarRelatorioConsolidado
                            show={showPublicarRelatorioConsolidado}
                            handleClose={()=>setShowPublicarRelatorioConsolidado(false)}
                            publicarConsolidadoDre={publicarConsolidadoDre}
                        />
                    </section>

        </PaginasContainer>
    )
}

export default memo(RelatorioConsolidado)