import React from "react";
import "../geracao-da-ata.scss"
import {TopoComBotoes} from "./TopoComBotoes";

export const VisualizacaoDaAta = () => {
    return(
        <div className="col-12 container-visualizacao-da-ata">
            <div className="col-12 mt-4 mb-5">
                <TopoComBotoes/>
            </div>
        </div>
    )
}