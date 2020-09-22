import React, {useEffect, useState} from "react";
import {getPeriodos, getItensDashboard} from "../../../services/dres/Dashboard.service";
import {SelectPeriodo} from "./SelectPeriodo";
import "./dashboard.scss"
import {BarraDeStatus} from "./BarraDeStatus";
import {ObjetoDashboard} from "./ObjetoDashboard";
import {DashboardCard} from "./DashboardCard";

export const DreDashboard = () => {

    const [periodos, setPeriodos] = useState(false);
    const [periodoEsolhido, setPeriodoEsolhido] = useState(false);
    const [itensDashboard, setItensDashboard] = useState(false);

    useEffect(() => {
        carregaPeriodos();
    }, []);

    useEffect(() => {
        carregaItensDashboard();
    }, [periodoEsolhido]);

    const carregaPeriodos = async () => {
        let periodos = await getPeriodos();
        setPeriodos(periodos);
        if (periodos && periodos.length > 0){
            setPeriodoEsolhido(periodos[0].uuid)
        }
    };

    const carregaItensDashboard = async () =>{
        if (periodoEsolhido){
            let itens = await getItensDashboard(periodoEsolhido);
            setItensDashboard(itens)
        }

    }

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
           <BarraDeStatus
               itensDashboard={itensDashboard}
           />
           <DashboardCard
               itensDashboard={itensDashboard}
           />
        </>
    )
};