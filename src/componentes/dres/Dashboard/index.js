import React, {useEffect, useState} from "react";
import {getPeriodos} from "../../../services/dres/Dashboard.service";
import {TopoSelectPeriodo} from "./TopoSelectPeriodo";

export const DreDashboard = () => {

    const [periodosAssociacao, setPeriodosAssociacao] = useState(false);
    const [periodoSelecionado, setPeriodoSelecionado] = useState(false);

    useEffect(() => {
        carregaPeriodos();
    }, []);

    const carregaPeriodos = async () => {
        let periodos = await getPeriodos();
        setPeriodosAssociacao(periodos);
    };

    const handleChangePeriodosAssociacao = async (value) => {
        setPeriodoSelecionado(value)
    };

    return (
        <>
            <h1>Componente Dre Dashboard</h1>
            <TopoSelectPeriodo
                periodosAssociacao={periodosAssociacao}
                periodoSelecionado={periodoSelecionado}
                handleChangePeriodosAssociacao={handleChangePeriodosAssociacao}
           />
        </>
    )
};