import React, {useEffect, useState} from "react";
import {TopoSelectPeriodoBotaoConcluir} from "./TopoSelectPeriodoBotaoConcluir";
import {getPeriodosDePrestacaoDeContasDaAssociacao} from "../../../services/escolas/Associacao.service"

export const PrestacaoDeContas = () => {

    const [periodoPrestacaoDeConta, setPeriodoPrestacaoDeConta] = useState("");
    const [periodosAssociacao, setPeriodosAssociacao] = useState(false);


    useEffect(() => {
        getPeriodoPrestacaoDeConta();
        carregaPeriodos();
    }, []);


    useEffect(() => {
        localStorage.setItem('periodoPrestacaoDeConta', JSON.stringify(periodoPrestacaoDeConta));
    }, [periodoPrestacaoDeConta]);

    const carregaPeriodos = async () => {
        let periodos = await getPeriodosDePrestacaoDeContasDaAssociacao();
        console.log("Periodos ", periodos)
        setPeriodosAssociacao(periodos);
    };


    const getPeriodoPrestacaoDeConta = () => {
        if (localStorage.getItem('periodoPrestacaoDeConta')) {
            const files = JSON.parse(localStorage.getItem('periodoPrestacaoDeConta'));
            setPeriodoPrestacaoDeConta(files)
        } else {
            setPeriodoPrestacaoDeConta({
                periodo_uuid: "",
                data_inicial: "",
            })
        }
    };

    const handleChangePeriodoPrestacaoDeConta = (name, value) => {
        if (value){
            setPeriodoPrestacaoDeConta(JSON.parse(value));
        }
    };

    const retornaObjetoPeriodoPrestacaoDeConta = (periodo_uuid, data_inicial) => {
        return JSON.stringify({
            periodo_uuid: periodo_uuid,
            data_inicial: data_inicial,
        });
    };

    return (
        <>
            <TopoSelectPeriodoBotaoConcluir
                periodoPrestacaoDeConta={periodoPrestacaoDeConta}
                handleChangePeriodoPrestacaoDeConta={handleChangePeriodoPrestacaoDeConta}
                periodosAssociacao={periodosAssociacao}
                retornaObjetoPeriodoPrestacaoDeConta={retornaObjetoPeriodoPrestacaoDeConta}
            />
        </>
    )
};