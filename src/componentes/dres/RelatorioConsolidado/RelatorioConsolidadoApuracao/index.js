import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getItensDashboard} from "../../../../services/dres/Dashboard.service";
import {InfoAssociacoesEmAnalise} from "./InfoAssociacoesEmAnalise";

export const RelatorioConsolidadoApuracao = () =>{

    let {periodo_uuid, conta_uuid} = useParams();

    const [itensDashboard, setItensDashboard] = useState(false);
    const [totalEmAnalise, setTotalEmAnalise] = useState(0);

    useEffect(() => {
        carregaItensDashboard();
    }, []);

    useEffect(() => {
        retornaQtdeEmAnalise();
    }, [itensDashboard]);

    const carregaItensDashboard = async () =>{
        if (periodo_uuid){
            let itens = await getItensDashboard(periodo_uuid);
            setItensDashboard(itens)
        }
    };

    const retornaQtdeEmAnalise = () =>{
        if (itensDashboard) {
            let total = itensDashboard.cards.filter(elemtent => elemtent.status === 'RECEBIDA' || elemtent.status === 'DEVOLVIDA' || elemtent.status === 'EM_ANALISE').reduce((total, valor) => total + valor.quantidade_prestacoes, 0);
            setTotalEmAnalise(total)
        }
    };

    console.log("RelatorioConsolidadoApuracao items ", itensDashboard)
    console.log("RelatorioConsolidadoApuracao Total ", totalEmAnalise)

    return(
        <>
            <div className="col-12 container-visualizacao-da-ata mb-5">
                <div className="col-12 mt-4">
                    <h1>RelatorioConsolidadoApuracao</h1>
                    <InfoAssociacoesEmAnalise
                        totalEmAnalise={totalEmAnalise}
                    />
                </div>
            </div>
        </>
    )
};