import React, {useEffect, useState} from "react";
import {getPeriodos} from "../../../services/dres/Dashboard.service";
import {SelectPeriodo} from "./SelectPeriodo";
import "./dashboard.scss"
import {BarraDeStatus} from "./BarraDeStatus";
import {ObjetoDashboard} from "./ObjetoDashboard";

export const DreDashboard = () => {

    const [periodos, setPeriodos] = useState(false);

    useEffect(() => {
        carregaPeriodos();
    }, []);

    const carregaPeriodos = async () => {
        let periodos = await getPeriodos();
        setPeriodos(periodos);
    };

    const handleChangePeriodos = async (value) => {
    };

    return (
        <>
            <SelectPeriodo
                periodos={periodos}
                handleChangePeriodos={handleChangePeriodos}
           />
           <BarraDeStatus
               ObjetoDashboard={ObjetoDashboard}
           />
        </>
    )
};