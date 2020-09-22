import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {getPeriodos} from "../../../../services/dres/Dashboard.service";
import {TopoSelectPeriodoBotaoVoltar} from "./TopoSelectPeriodoBotaoVoltar";
import {getPrestacoesDeContas} from "../../../../services/dres/PrestacaoDeContas.service";

export const ListaPrestacaoDeContas= () => {

    let {periodo_uuid, status_prestacao} = useParams();

    const [periodos, setPeriodos] = useState(false);
    const [periodoEscolhido, setPeriodoEsolhido] = useState(false);
    const [prestacaoDeContas, setPrestacaoDeContas] = useState(false);

    useEffect(() => {
        carregaPeriodos();
    }, []);


    useEffect(() => {
        console.log("Mudei o periodo")
        carregaPrestacoesDeContas();
    }, [periodoEscolhido]);

    const carregaPeriodos = async () => {
        let periodos = await getPeriodos();
        setPeriodos(periodos);
        if (periodo_uuid){
            setPeriodoEsolhido(periodo_uuid)
        }else if (periodos && periodos.length > 0){
            setPeriodoEsolhido(periodos[0].uuid)
        }
    };

    const carregaPrestacoesDeContas = async ()=>{
        if (periodoEscolhido){
            let prestacoes_de_contas = await getPrestacoesDeContas(periodoEscolhido);
            console.log("Prestacoes de contas ", prestacoes_de_contas)
            setPrestacaoDeContas(prestacoes_de_contas)
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