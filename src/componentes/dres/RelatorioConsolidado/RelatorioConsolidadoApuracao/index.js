import React from "react";
import {useParams} from "react-router-dom";

export const RelatorioConsolidadoApuracao = () =>{

    let {periodo_uuid, conta_uuid} = useParams();

    console.log("RelatorioConsolidadoApuracao periodo_uuid ", periodo_uuid)
    console.log("RelatorioConsolidadoApuracao conta_uuid ", conta_uuid)

    return(
        <>
            <div className="col-12 container-visualizacao-da-ata mb-5">
                <div className="col-12 mt-4">
                    <h1>RelatorioConsolidadoApuracao</h1>
                </div>
            </div>
        </>
    )
};