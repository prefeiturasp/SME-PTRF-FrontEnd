import React, {useState, useEffect} from "react";
import {Link} from 'react-router-dom'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {getPeriodos} from "../../../services/sme/DashboardSme.service";
import {getItensDashboard} from "../../../services/sme/DashboardSme.service";
import {getItensDashboardComDreUuid} from "../../../services/dres/RelatorioConsolidado.service"
import {SelectPeriodo} from "../AcompanhamentoPcsSme/SelectPeriodo";
import {BarraDeStatus} from "../AcompanhamentoPcsSme/./BarraDeStatus";
import {BarraTotalAssociacoes} from "./BarraTotalAssociacoes";
import {DashboardCardPorDiretoria} from "./DashboardCardPorDiretoria";
import {ResumoPorDre} from "../AcompanhamentoPcsSme/./ResumoPorDre";
import Loading from "../../../utils/Loading";
import './style.scss'

export const AcompanhamentoPcsSmePorDre = (params) => {

    const [periodos, setPeriodos] = useState(false);
    const [periodoEscolhido, setPeriodoEsolhido] = useState(false);
    const [itensDashboard, setItensDashboard] = useState(null);
    const [resumoPorDre, setResumoPorDre] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusPeriodo, setStatusPeriodo] = useState(false);

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

    const carregaItensDashboard = async () =>{
        setLoading(true);
        if (periodoEscolhido){
            let itensPorCard = await getItensDashboardComDreUuid(params.periodo_uuid, params.dre_uuid);
            let itens = await getItensDashboard(periodoEscolhido)

            let resumoPorDre = itens && itens.resumo_por_dre ? itens.resumo_por_dre : [];
            setItensDashboard(itensPorCard);
            setStatusPeriodo(itens.status);
            setResumoPorDre(resumoPorDre);
        }
        setLoading(false);
    };

    const handleChangePeriodos = async (uuid_periodo) => {
        setPeriodoEsolhido(uuid_periodo)
    };

    const TituloStyle = {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: "700",
        fontSize: "18px",
        lineHeight: "32px",
        color: "#42474A",
        paddingTop: "16px",
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
                        <BarraDeStatus
                        statusRelatorio={statusPeriodo}
                        />
                        <div className="titulo-voltar">
                                <h4 className="titulo-pagina-perstacao-por-dre">{params.nomeDre}</h4>
                                <Link
                                    to='/acompanhamento-pcs-sme'
                                    className="btn btn-out-success"
                                >
                                <FontAwesomeIcon
                                    style={{marginRight: "5px", color: '#000'}}
                                    icon={faArrowLeft}
                                />
                                    Voltar
                                </Link>
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
                    <h4 style={TituloStyle}>Resumo por diretoria regional</h4>
                    <ResumoPorDre resumoPorDre={resumoPorDre} statusPeriodo={statusPeriodo}/>
                </>
            }
        </>
    )
};