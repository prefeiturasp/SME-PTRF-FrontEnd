import React, {useEffect, useState} from "react";
import {TopoSelectPeriodoBotaoConcluir} from "./TopoSelectPeriodoBotaoConcluir";
import {getPeriodosDePrestacaoDeContasDaAssociacao} from "../../../services/escolas/Associacao.service"
import {getStatusPeriodoPorData} from "../../../services/escolas/PrestacaoDeContas.service";

export const PrestacaoDeContas = () => {

    const [periodoPrestacaoDeConta, setPeriodoPrestacaoDeConta] = useState("");
    const [periodosAssociacao, setPeriodosAssociacao] = useState(false);
    const [statusPrestacaoDeConta, setStatusPrestacaoDeConta] = useState(false);

    useEffect(() => {
        getPeriodoPrestacaoDeConta();
        carregaPeriodos();
        getStatusPrestacaoDeConta();
    }, []);

    useEffect(() => {
        localStorage.setItem('periodoPrestacaoDeConta', JSON.stringify(periodoPrestacaoDeConta));
    }, [periodoPrestacaoDeConta]);

    useEffect(() => {
        localStorage.setItem('statusPrestacaoDeConta', JSON.stringify(statusPrestacaoDeConta));
    }, [statusPrestacaoDeConta]);

    const carregaPeriodos = async () => {
        let periodos = await getPeriodosDePrestacaoDeContasDaAssociacao();
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

    const getStatusPrestacaoDeConta = () => {
        if (localStorage.getItem('statusPrestacaoDeConta')) {
            const files = JSON.parse(localStorage.getItem('statusPrestacaoDeConta'));
            setStatusPrestacaoDeConta(files)
        } else {
            setStatusPrestacaoDeConta({})
        }
    };

    const handleChangePeriodoPrestacaoDeConta = async (name, value) => {
        if (value){
            let valor = JSON.parse(value);
            setPeriodoPrestacaoDeConta(valor);
            let status = await getStatusPeriodoPorData(valor.data_inicial)
            console.log("Status ", status)
            setStatusPrestacaoDeConta(status)
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