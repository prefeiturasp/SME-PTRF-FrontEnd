import React from "react";
import {useParams} from "react-router-dom";
import {visoesService} from "../../../../services/visoes.service";

export const RelatorioConsolidadoDadosDasUes = () => {

    let {periodo_uuid, conta_uuid} = useParams();

    const dre_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid');

    return (
        <>
            <div className="col-12 container-visualizacao-da-ata mb-5">
                <div className="col-12 mt-5">
                    <h1>RelatorioConsolidadoDadosDasUes</h1>
                </div>
            </div>
        </>
    )
};