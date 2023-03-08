import React, {useState, useEffect} from "react";
import {Link} from 'react-router-dom'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {getPeriodos} from "../../../services/sme/DashboardSme.service";
import {getResumoDRE} from "../../../services/sme/AcompanhamentoSME.service"
import {getItensDashboard} from "../../../services/sme/DashboardSme.service";
import {getItensDashboardComDreUuid} from "../../../services/dres/RelatorioConsolidado.service"
import {SelectPeriodo} from "../AcompanhamentoPcsSme/SelectPeriodo";
import {BarraDeStatusPorDiretoria} from "./BarraDeStatusPorDiretoria";
import {BarraTotalAssociacoes} from "./BarraTotalAssociacoes";
import {DashboardCardPorDiretoria} from "./DashboardCardPorDiretoria";
import {ResumoPorUnidadeEducacional} from "./ResumoPorUnidadeEducacional";
import {FiltroUnidadeEducacional} from "./FiltroUnidadeEducacional";
import {mantemEstadoAcompanhamentoDePcUnidade as meapcservice} from "../../../services/mantemEstadoAcompanhamentoDePcUnidadeEducacional.service"
import Loading from "../../../utils/Loading";
import './style.scss'
import { visoesService } from "../../../services/visoes.service";

export const AcompanhamentoPcsSmePorDre = (params) => {

    const [periodos, setPeriodos] = useState(false);
    const [periodoEscolhido, setPeriodoEsolhido] = useState(false);
    const [itensDashboard, setItensDashboard] = useState(null);
    const [unidadesEducacionais, setUnidadesEducacionais] = useState([])
    const [loading, setLoading] = useState(false);
    const [loadingDataTable, setLoadingDataTable] = useState(false);
    const [statusPeriodo, setStatusPeriodo] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(meapcservice.getAcompanhamentoDePcUnidadeUsuarioLogado(params.dre_uuid)?.paginacao_atual ?? 0);

    useEffect(() => {
        carregaPeriodos();
    }, []);

    useEffect(() => {
        carregaItensDashboard();
    }, [periodoEscolhido]);

    const carregaPeriodos = async () => {
        setLoading(true);
        let periodos = await getPeriodos();
        setPeriodos(periodos);
        if (params.periodo_uuid){
            setPeriodoEsolhido(params.periodo_uuid)
        }
        setLoading(false);
    };

    const resetPageDataTable = () => {
        setPaginaAtual(0);
        meapcservice.setAcompanhamentoPcUnidadePorUsuario(visoesService.getUsuarioLogin(), {[params.dre_uuid]: {paginacao_atual: 0}})
    }

    const carregaItensDashboard = async () =>{
        setLoading(true);
        if (periodoEscolhido){
            let itensPorCard = await getItensDashboardComDreUuid(params.periodo_uuid, params.dre_uuid);
            let unidadesEducacionaisResumo = await getResumoDRE(params.dre_uuid, params.periodo_uuid)
            if (localStorage.getItem('ACOMPANHAMENTO_PC_UNIDADE')) {
                let newParms = meapcservice.getAcompanhamentoDePcUnidadeUsuarioLogado(params.dre_uuid)
                unidadesEducacionaisResumo = await getResumoDRE(
                    params?.dre_uuid,
                    params?.periodo_uuid,
                    newParms?.filtra_por_termo,
                    newParms?.filtra_por_tipo_unidade,
                    newParms?.filtra_por_devolucao_tesouro,
                    newParms?.filtra_por_status,
                )
            }
            let itens = await getItensDashboard(periodoEscolhido)
            setItensDashboard(itensPorCard);
            setStatusPeriodo(itens.status)
            setUnidadesEducacionais(unidadesEducacionaisResumo);
        }
        setLoading(false);
    };

    const handleChangePeriodos = async (uuid_periodo) => {
        setPeriodoEsolhido(uuid_periodo)
    };

    return (
        <>
            <SelectPeriodo
                periodos={periodos}
                periodoEscolhido={periodoEscolhido}
                handleChangePeriodos={handleChangePeriodos}
            />
            {loading ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) :
                <>
                    {statusPeriodo &&
                    <>
                        <BarraDeStatusPorDiretoria
                            statusRelatorio={statusPeriodo}
                        />
                        <div className="titulo-voltar d-flex justify-content-between mb-3 mt-2">
                            <h4 className="titulo-pagina-perstacao-por-dre">{params.nomeDre}</h4>
                            
                            <div className="d-flex align-items-center">
                                <button onClick={()=>window.location.assign('/acompanhamento-pcs-sme')} className="btn btn-success">
                                    <FontAwesomeIcon
                                        style={{marginRight: "5px", color: '#fff'}}
                                        icon={faArrowLeft}
                                    />
                                    <span>Voltar para painel geral</span>
                                </button>
                            </div>
                        </div>
                        <hr style={{marginTop: -10}}/>
                    </>
                    }
                    <BarraTotalAssociacoes
                        itensDashboard={itensDashboard}
                    />
                    <DashboardCardPorDiretoria
                        itensDashboard={itensDashboard}
                        statusPeriodo={statusPeriodo}
                    />
                    <h4> Resumo por Unidade Educacional </h4>
                    <FiltroUnidadeEducacional
                        setLoadingDataTable={setLoadingDataTable}
                        periodoUuid={params.periodo_uuid}
                        dreUuid={params.dre_uuid}
                        setUnidadesEducacionais={setUnidadesEducacionais}
                        resetPageDataTable={resetPageDataTable}
                    />
                    <ResumoPorUnidadeEducacional 
                        loadingDataTable={loadingDataTable}
                        dreUuid={params.dre_uuid}
                        unidadesEducacionais={unidadesEducacionais}
                        setPaginaAtual={setPaginaAtual}
                        paginaAtual={paginaAtual}
                    />
                </>
            }
        </>
    )
};