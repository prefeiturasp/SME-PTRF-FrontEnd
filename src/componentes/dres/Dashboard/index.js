import React, {useEffect, useState} from "react";
import {getPeriodos, getItensDashboard} from "../../../services/dres/Dashboard.service";
import {SelectPeriodo} from "./SelectPeriodo";
import "./dashboard.scss"
import {BarraDeStatus} from "./BarraDeStatus";
import {DashboardCard} from "./DashboardCard";
import Loading from "../../../utils/Loading";

export const DreDashboard = () => {

    const [periodos, setPeriodos] = useState(false);
    const [periodoEsolhido, setPeriodoEsolhido] = useState(false);
    const [itensDashboard, setItensDashboard] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregaPeriodos();
    }, []);

    useEffect(() => {
        carregaItensDashboard();
    }, [periodoEsolhido]);

    useEffect(() => {
        setLoading(false);
    }, []);

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
        if (periodoEsolhido){
            let itens = await getItensDashboard(periodoEsolhido);
            setItensDashboard(itens)
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
                periodoEsolhido={periodoEsolhido}
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
                    <BarraDeStatus
                        itensDashboard={itensDashboard}
                    />
                    <DashboardCard
                        itensDashboard={itensDashboard}
                    />
                </>
            }
        </>
    )
};