import React, {useEffect, useState} from "react";
import {getPeriodos} from "../../../services/dres/Dashboard.service";
import {SelectPeriodo} from "./SelectPeriodo";

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
            <h1>Componente Dre Dashboard</h1>
            <SelectPeriodo
                periodos={periodos}
                handleChangePeriodos={handleChangePeriodos}
           />
        </>
    )
};