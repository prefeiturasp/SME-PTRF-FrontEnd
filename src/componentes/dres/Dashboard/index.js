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
            <SelectPeriodo
                periodos={periodos}
                handleChangePeriodos={handleChangePeriodos}
           />
        </>
    )
};