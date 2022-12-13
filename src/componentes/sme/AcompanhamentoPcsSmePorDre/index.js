import React, {useState, useEffect} from "react";
import {Redirect, Link} from 'react-router-dom'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {getPeriodos, getItensDashboard} from "../../../services/sme/DashboardSme.service";
import {SelectPeriodo} from "../AcompanhamentoPcsSme/SelectPeriodo";
import {BarraDeStatus} from "../AcompanhamentoPcsSme/./BarraDeStatus";
import {BarraTotalAssociacoes} from "./BarraTotalAssociacoes";
import {DashboardCard} from "../AcompanhamentoPcsSme/./DashboardCard";
import {ResumoPorDre} from "../AcompanhamentoPcsSme/./ResumoPorDre";
import Loading from "../../../utils/Loading";
import './style.scss'

export const AcompanhamentoPcsSmePorDre = (params) => {

    const [periodos, setPeriodos] = useState(false);
    const [periodoEscolhido, setPeriodoEsolhido] = useState(false);
    const [itensDashboard, setItensDashboard] = useState(false);
    const [resumoPorDre, setResumoPorDre] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusPeriodo, setStatusPeriodo] = useState(false);
    const [cardTotalUnidade, setCardTotalUnidade] = useState(0)

    const totalUnidades = cardTotalUnidade ? cardTotalUnidade.quantidade_prestacoes : 0;

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
            let itens = await getItensDashboard(periodoEscolhido);
            
            let cards = itens.cards;
            const totalCard = cards.shift();
            let resumoPorDre = itens && itens.resumo_por_dre ? itens.resumo_por_dre : [];
            setItensDashboard(cards);
            setStatusPeriodo(itens.status);
            setCardTotalUnidade(totalCard)
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
                        totalUnidades={totalUnidades}
                    />
                    <DashboardCard
                        itensDashboard={itensDashboard}
                        statusPeriodo={statusPeriodo}
                        cardTotalUnidade={cardTotalUnidade}
                    />
                    <h4 style={TituloStyle}>Resumo por diretoria regional</h4>
                    <ResumoPorDre resumoPorDre={resumoPorDre} statusPeriodo={statusPeriodo}/>
                </>
            }
        </>
    )
};