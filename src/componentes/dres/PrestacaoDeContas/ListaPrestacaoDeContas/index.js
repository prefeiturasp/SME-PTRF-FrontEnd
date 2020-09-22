import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {getPeriodos} from "../../../../services/dres/Dashboard.service";
import {TopoSelectPeriodoBotaoVoltar} from "./TopoSelectPeriodoBotaoVoltar";

export const ListaPrestacaoDeContas= () => {
    let {periodo_uuid, status_prestacao} = useParams();
    const [periodos, setPeriodos] = useState(false);
    const [periodoEscolhido, setPeriodoEsolhido] = useState(false);

    useEffect(() => {
        carregaPeriodos();
    }, []);


    const carregaPeriodos = async () => {
        let periodos = await getPeriodos();
        setPeriodos(periodos);
        if (periodo_uuid){
            setPeriodoEsolhido(periodo_uuid)
        }
    };

    const handleChangePeriodos = async (uuid_periodo) => {
        setPeriodoEsolhido(uuid_periodo)
    };

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
            <div className="page-content-inner">
                <TopoSelectPeriodoBotaoVoltar
                    periodos={periodos}
                    periodoEscolhido={periodoEscolhido}
                    handleChangePeriodos={handleChangePeriodos}
                />
            </div>
        </PaginasContainer>
    )
};