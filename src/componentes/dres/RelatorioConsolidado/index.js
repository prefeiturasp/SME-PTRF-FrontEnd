import React, {useCallback, useEffect, useState, memo} from "react";
import {visoesService} from "../../../services/visoes.service";
import {
    getFiqueDeOlhoRelatoriosConsolidados,
    getStatusConsolidadoDre,
    postPublicarConsolidadoDre,
    getConsolidadoDre,
} from "../../../services/dres/RelatorioConsolidado.service";
import {getItensDashboard, getPeriodos} from "../../../services/dres/Dashboard.service";
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

const RelatorioConsolidado = () => {

    const dre_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid');

    const [fiqueDeOlho, setFiqueDeOlho] = useState("");

    // Consolidado DRE
    const [consolidadoDre, setConsolidadoDre] = useState(false);
    const [statusConsolidadoDre, setStatusConsolidadoDre] = useState(false);
    const [statusProcessamentoConsolidadoDre, setStatusProcessamentoConsolidadoDre] = useState('');
    const [periodos, setPeriodos] = useState(false);
    const [periodoEscolhido, setPeriodoEsolhido] = useState(false);

    // Lauda
    const [disablebtnGerarLauda, setDisablebtnGerarLauda] = useState(true);

    const [itensDashboard, setItensDashboard] = useState(false);
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

    useEffect(() => {
        if (statusProcessamentoConsolidadoDre && statusProcessamentoConsolidadoDre === "EM_PROCESSAMENTO") {
            setLoading(true)
            const timer = setInterval(() => {
                retornaStatusConsolidadoDre();
            }, 5000);
            // clearing interval
            return () => clearInterval(timer);
        } else {
            setLoading(false)
        }
    }, [statusProcessamentoConsolidadoDre, retornaStatusConsolidadoDre]);

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

    const carregaItensDashboard = useCallback(async () => {
        if (periodoEscolhido) {
            let itens = await getItensDashboard(periodoEscolhido);
            setItensDashboard(itens)
        }
    }, [periodoEscolhido]);

    useEffect(() => {
        carregaItensDashboard()
    }, [carregaItensDashboard])

    const handleChangePeriodos = async (uuid_periodo) => {
        setPeriodoEsolhido(uuid_periodo)
    };

    const retornaQtdeStatus = (status) => {
        let item = itensDashboard.cards.find(element => element.status === status);
        let qtde_itens = item.quantidade_prestacoes;
        if (qtde_itens <= 9) {
            return '0' + qtde_itens;
        } else {
            return qtde_itens.toString();
        }
    };

    const retornaQtdeStatusTotal = () => {
        if (itensDashboard) {
            let total = itensDashboard.cards.filter(elemtent => elemtent.status === 'APROVADA' || elemtent.status === 'REPROVADA').reduce((total, valor) => total + valor.quantidade_prestacoes, 0);
            if (total <= 9) {
                return '0' + total;
            } else {
                return total.toString();
            }
        }
    };

    const publicarConsolidadoDre = async () => {
        let payload = {
            dre_uuid: dre_uuid,
            periodo_uuid: periodoEscolhido
        }
        try {
            let publicar = await postPublicarConsolidadoDre(payload)
            setStatusProcessamentoConsolidadoDre(publicar.status)
            setConsolidadoDre(publicar)
        }catch (e) {
            console.log("Erro ao publicar Consolidado Dre ", e)
        }
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
                            {periodoEscolhido && dre_uuid && itensDashboard ? (
                                    <>
                                        <TrilhaDeStatus
                                            retornaQtdeStatus={retornaQtdeStatus}
                                            retornaQtdeStatusTotal={retornaQtdeStatusTotal}
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
                                                        publicarConsolidadoDre={publicarConsolidadoDre}
                                                    />
                                                    <DemonstrativoDaExecucaoFisicoFinanceira
                                                        consolidadoDre={consolidadoDre}
                                                        statusConsolidadoDre={statusConsolidadoDre}
                                                        periodoEscolhido={periodoEscolhido}
                                                    />
                                                    {statusConsolidadoDre && statusConsolidadoDre.status_geracao === "GERADOS_TOTAIS" &&
                                                        <AtaParecerTecnico
                                                            dre_uuid={dre_uuid}
                                                            periodoEscolhido={periodoEscolhido}
                                                            statusConsolidadoDre={statusConsolidadoDre}
                                                            statusProcessamentoConsolidadoDre={statusProcessamentoConsolidadoDre}
                                                            setDisablebtnGerarLauda={setDisablebtnGerarLauda}
                                                        />
                                                    }
                                                    <Lauda
                                                        consolidadoDre={consolidadoDre}
                                                        periodoEscolhido={periodoEscolhido}
                                                        disablebtnGerarLauda={disablebtnGerarLauda}
                                                    />
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

        </PaginasContainer>
    )
}

export default memo(RelatorioConsolidado)