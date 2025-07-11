import React, {useEffect, useState} from "react";
import {getPeriodos, getItensDashboardSme} from "../../../services/sme/DashboardSme.service";
import {SelectPeriodo} from "./SelectPeriodo";
import "./dashboard.scss"
import {BarraDeStatus} from "./BarraDeStatus";
import {BarraTotalUnidades} from "./BarraTotalUnidades";
import {DashboardCard} from "./DashboardCard";
import {ResumoPorDre} from "./ResumoPorDre";
import Loading from "../../../utils/Loading";

export const AcompanhamentoPcsSme = () => {

    const [periodos, setPeriodos] = useState(false);
    const [periodoEscolhido, setPeriodoEsolhido] = useState(false);
    const [itensDashboard, setItensDashboard] = useState(false);
    const [resumoPorDre, setResumoPorDre] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusPeriodo, setStatusPeriodo] = useState(false);
    const [totalUnidades, setTotalUnidades] = useState(0);

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
        if (periodos && periodos.length > 0){
            setPeriodoEsolhido(periodos[0].uuid)
        }
        setLoading(false);
    };

    const carregaItensDashboard = async () =>{
        setLoading(true);
        if (periodoEscolhido){
            let itens = await getItensDashboardSme(periodoEscolhido, true);
            let cards = itens.cards;
            let totalCard = cards.shift();
            let totalUnidades = totalCard ? totalCard.quantidade_prestacoes : 0;
            let resumoPorDre = itens && itens.resumo_por_dre ? itens.resumo_por_dre : [];
            setItensDashboard(cards);
            setStatusPeriodo(itens.status);
            setTotalUnidades(totalUnidades);
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
                    <BarraDeStatus
                        statusRelatorio={statusPeriodo}
                    />
                    }
                    <h4 style={TituloStyle}>Resumo geral do período</h4>
                    <BarraTotalUnidades
                        totalUnidades={totalUnidades}
                    />
                    <DashboardCard
                        itensDashboard={itensDashboard}
                        statusPeriodo={statusPeriodo}
                    />
                    <h4 style={TituloStyle}>Resumo por diretoria regional</h4>
                    <ResumoPorDre resumoPorDre={resumoPorDre} statusPeriodo={statusPeriodo} periodoEscolhido={periodoEscolhido}/>
                </>
            }
        </>
    )
};