import React, {useEffect, useState} from "react";
import {getPeriodosDePrestacaoDeContasDaAssociacao} from "../../../services/escolas/Associacao.service";

export const DreDashboard = () => {

    const [periodosAssociacao, setPeriodosAssociacao] = useState(false);

    useEffect(()=>{
        carregaPeriodos();
    }, [])

    const carregaPeriodos = async () => {
        let periodos = await getPeriodosDePrestacaoDeContasDaAssociacao();
        setPeriodosAssociacao(periodos);
    };

    const handleChangePeriodosAssociacao = async (name, value) => {
        if (value){
            let valor = JSON.parse(value);
        }
    };

    console.log("Periodos ", periodosAssociacao)

    return(
        <h1>Componente Dre Dashboard</h1>
    )
};